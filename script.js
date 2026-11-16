'use strict';

document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graph');
    const context = canvas.getContext('2d');
    const form = document.getElementById('point-form');
    const xInputs = [...form.querySelectorAll('input[name="x"]')];
    const yInput = document.getElementById('y-input');
    const rInput = document.getElementById('r-input');
    const error = document.getElementById('form-error');
    const tbody = document.getElementById('results-body');
    const submitButton = form.querySelector('button[type="submit"]');
    const clearButton = document.getElementById('clear-history');
    const submitLabel = submitButton.textContent;
    const xValues = ['-2', '-1.5', '-1', '-0.5', '0', '0.5', '1', '1.5', '2'];
    const rValues = ['1', '2', '3', '4', '5'];
    const yPattern = new RegExp(`^(?:${yInput.pattern})$`);
    const storageKey = 'pointsDataLab2';
    const results = loadHistory();
    let isSubmitting = false;
    const size = 300;
    const radius = 100;
    const center = size / 2;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    context.scale(dpr, dpr);

    results.forEach(addResultToTable);
    validateInput();
    drawGraph();

    form.addEventListener('input', () => {
        validateInput();
        error.hidden = true;
    });

    rInput.addEventListener('change', drawGraph);

    form.addEventListener('invalid', event => {
        error.textContent = event.target.validationMessage;
        error.hidden = false;
    }, true);

    form.addEventListener('submit', async event => {
        event.preventDefault();
        validateInput();
        if (isSubmitting || !form.reportValidity()) {
            return;
        }

        const body = new URLSearchParams(new FormData(form));
        error.hidden = true;
        isSubmitting = true;
        submitButton.disabled = true;
        clearButton.disabled = true;
        submitButton.textContent = 'Checking';
        form.setAttribute('aria-busy', 'true');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                headers: { Accept: 'application/json' },
                body
            });
            let data;
            try {
                data = await response.json();
            } catch {
                throw new Error(`Не удалось прочитать ответ сервера (HTTP ${response.status})`);
            }
            if (!response.ok) {
                throw new Error(typeof data?.error === 'string'
                    ? data.error : `Ошибка сервера: HTTP ${response.status}`);
            }
            if (!Array.isArray(data?.results) || data.results.length !== body.getAll('x').length) {
                throw new Error('Некорректный ответ сервера');
            }

            const received = data.results.map(point => ({
                ...point,
                currentTime: data.currentTime,
                executionTimeMs: data.executionTimeMs
            }));
            if (!received.every(isResult)) {
                throw new Error('Некорректный ответ сервера');
            }

            results.push(...received);
            received.forEach(addResultToTable);
            drawGraph();
            try {
                localStorage.setItem(storageKey, JSON.stringify(results));
            } catch {
                error.textContent = 'Результаты получены, но не удалось сохранить историю в браузере';
                error.hidden = false;
            }
        } catch (err) {
            error.textContent = err instanceof TypeError
                ? 'Не удалось связаться с сервером, попробуйте ещё раз' : err.message;
            error.hidden = false;
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            clearButton.disabled = false;
            submitButton.textContent = submitLabel;
            form.removeAttribute('aria-busy');
        }
    });

    clearButton.addEventListener('click', () => {
        try {
            localStorage.removeItem(storageKey);
        } catch {
            error.textContent = 'Не удалось очистить историю в браузере';
            error.hidden = false;
            return;
        }
        results.length = 0;
        tbody.replaceChildren();
        drawGraph();
    });

    function validateInput() {
        const selected = xInputs.filter(input => input.checked);
        xInputs[0].required = selected.length === 0;
        xInputs[0].setCustomValidity(selected.length === 0
            ? 'Выберите хотя бы одно значение X'
            : selected.every(input => xValues.includes(input.value))
                ? '' : 'Выберите X из предложенных значений');
        yInput.setCustomValidity(yPattern.test(yInput.value)
            ? '' : 'Введите число строго между -3 и 3, дробная часть через точку');
        rInput.setCustomValidity(rValues.includes(rInput.value) ? '' : 'Выберите R от 1 до 5');
    }

    function drawGraph() {
        const r = Number(rInput.value);
        const rLabel = rValues.includes(rInput.value) ? r : 'R';
        drawArea(rLabel);
        if (rLabel !== 'R') {
            results.filter(item => Number(item.r) === r).forEach(item => addPoint(item, r));
        }
    }

    function drawArea(rLabel) {
        context.clearRect(0, 0, size, size);
        context.fillStyle = '#3399FF';
        context.fillRect(center, center, radius, radius);

        context.beginPath();
        context.moveTo(center, center);
        context.lineTo(center - radius, center);
        context.lineTo(center, center - radius);
        context.closePath();
        context.fill();

        context.beginPath();
        context.moveTo(center, center);
        context.arc(center, center, radius, Math.PI / 2, Math.PI);
        context.closePath();
        context.fill();

        context.strokeStyle = 'black';
        context.beginPath();
        context.moveTo(0, center);
        context.lineTo(size, center);
        context.moveTo(size - 10, center - 5);
        context.lineTo(size, center);
        context.lineTo(size - 10, center + 5);
        context.moveTo(center, size);
        context.lineTo(center, 0);
        context.moveTo(center - 5, 10);
        context.lineTo(center, 0);
        context.lineTo(center + 5, 10);
        context.stroke();

        context.fillStyle = 'black';
        context.font = '13px sans-serif';
        context.fillText('x', size - 15, center - 15);
        context.fillText('y', center + 15, 15);

        for (const multiplier of [1, 0.5, -0.5, -1]) {
            const offset = multiplier * radius;
            const label = rLabel === 'R'
                ? `${multiplier < 0 ? '-' : ''}R${Math.abs(multiplier) === 0.5 ? '/2' : ''}`
                : String(rLabel * multiplier);
            context.beginPath();
            context.moveTo(center + offset, center - 5);
            context.lineTo(center + offset, center + 5);
            context.moveTo(center - 5, center - offset);
            context.lineTo(center + 5, center - offset);
            context.stroke();
            context.fillText(label, center + offset - 10, center - 15);
            context.fillText(label, center + 10, center - offset + 4);
        }

        canvas.setAttribute('aria-label', `Область при R = ${rLabel}: треугольник во второй четверти, `
            + 'четверть круга в третьей и квадрат в четвёртой, границы входят в область');
    }

    function addPoint(item, r) {
        const x = Number(item.x);
        const y = Number(item.y);
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
            return;
        }
        context.beginPath();
        context.fillStyle = item.hit ? '#3ada17' : '#c60c18';
        context.arc(center + radius * x / r, center - radius * y / r, 5, 0, Math.PI * 2);
        context.fill();
    }

    function addResultToTable(item) {
        const row = document.createElement('tr');
        const values = [item.x, item.y, item.r, item.hit ? 'Hit' : 'Miss',
            new Date(item.currentTime).toLocaleString('ru-RU'), item.executionTimeMs];
        for (const value of values) {
            const cell = document.createElement('td');
            cell.textContent = value;
            row.append(cell);
        }
        tbody.prepend(row);
    }

    function loadHistory() {
        try {
            const saved = JSON.parse(localStorage.getItem(storageKey) || '[]');
            return Array.isArray(saved) ? saved.filter(isResult) : [];
        } catch {
            return [];
        }
    }

    function isResult(item) {
        return item !== null && typeof item === 'object'
            && xValues.includes(item.x)
            && typeof item.y === 'string' && yPattern.test(item.y)
            && rValues.includes(item.r)
            && typeof item.hit === 'boolean'
            && typeof item.currentTime === 'string' && Number.isFinite(Date.parse(item.currentTime))
            && Number.isFinite(item.executionTimeMs) && item.executionTimeMs >= 0;
    }
});
