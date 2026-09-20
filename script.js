document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graph');
    const context = canvas.getContext('2d');
    const form = document.getElementById('point-form');

    const size = 300;
    const dpr = window.devicePixelRatio || 1;

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    context.scale(dpr, dpr);

    drawArea("R");
    loadTableData();

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const xStr = document.getElementById('x-input').value;
        const yStr = document.getElementById('y-input').value;
        const rRadio = document.querySelector('input[name="r"]:checked');

        if (!validateInput(xStr, yStr, rRadio)) {
            return;
        }

        const x = parseFloat(xStr);
        const y = parseFloat(yStr);
        const r = parseFloat(rRadio.value);

        drawArea(r);
        const isHit = checkHit(x, y, r);

        const resultText = isHit ? 'Hit' : 'Miss';
        const dateTimeString = new Date().toISOString();

        addResultToTable(x, y, r, resultText, dateTimeString);
        saveToLocalStorage(x, y, r, resultText, dateTimeString);
    });

    function validateInput(xStr, yStr, rRadio) {
        if (!rRadio) {
            alert("please select a value for R");
            return false;
        }

        const regex = /^-?([0-4](\.\d+)?|5)$/;
        if (!regex.test(xStr)) {
            alert("invalid X value, please enter a number from -5 to 5");
            return false;
        }
        if (!regex.test(yStr)) {
            alert("invalid X value, please enter a number from -5 to 5");
            return false;
        }

        return true;
    }

    function drawArea(rLabel) {
        context.clearRect(0, 0, size, size);

        const centerX = size / 2;
        const centerY = size / 2;
        const rMultiplier = 100;

        context.fillStyle = '#3399FF';

        //rectangle
        context.fillRect(centerX - rMultiplier, centerY, rMultiplier, rMultiplier);

        //triangle
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.lineTo(centerX + rMultiplier / 2, centerY);
        context.lineTo(centerX, centerY - rMultiplier / 2);
        context.fill();

        //circle sector
        context.beginPath();
        context.moveTo(centerX, centerY);
        context.arc(centerX, centerY, rMultiplier / 2, 0, Math.PI / 2);
        context.fill();

        //axes
        context.strokeStyle = 'black';
        context.beginPath();

        //x
        context.moveTo(0, centerY);
        context.lineTo(size, centerY);

        context.moveTo(size - 10, centerY - 5);
        context.lineTo(size, centerY);
        context.lineTo(size - 10, centerY + 5);

        //y
        context.moveTo(centerX, 0);
        context.lineTo(centerX, size);

        context.moveTo(centerX - 5, 10);
        context.lineTo(centerX, 0);
        context.lineTo(centerX + 5, 10);

        context.fillStyle = 'black';
        context.font = "13px sans-serif";

        context.fillText("x", size - 15, centerY - 15);
        context.fillText("y", centerX + 15, 15);

        context.stroke();

        const tick = 5;
        const isText = (rLabel === "R");

        const points = [
            { multi: 1, label: isText ? "R" : rLabel },
            { multi: 0.5, label: isText ? "R/2" : rLabel / 2 },
            { multi: -0.5, label: isText ? "-R/2" : -(rLabel / 2) },
            { multi: -1, label: isText ? "-R" : -rLabel }
        ];

        points.forEach(p => {
            const offset = p.multi * rMultiplier;

            //x
            context.beginPath();
            context.moveTo(centerX + offset, centerY - tick);
            context.lineTo(centerX + offset, centerY + tick);
            context.stroke();
            context.fillText(p.label, centerX + offset - 10, centerY - 15);

            //y
            context.beginPath();
            context.moveTo(centerX - tick, centerY - offset);
            context.lineTo(centerX + tick, centerY - offset);
            context.stroke();
            context.fillText(p.label, centerX + 10, centerY - offset + 4);
        });
    }

    function checkHit(x, y, r) {
        //triangle
        if (x >= 0 && y >= 0 && y <= -x + (r / 2)) {
            return true;
        }
        //rectangle
        if (x <= 0 && y <= 0 && x >= -r && y >= -r) {
            return true;
        }
        //circle sector
        return x >= 0 && y <= 0 && (x * x + y * y <= (r / 2) ** 2);
    }

    function addResultToTable(x, y, r, resultText, dateTimeString) {
        const tbody = document.getElementById('results-body');
        const row = document.createElement('tr');

        const displayTime = new Date(dateTimeString).toLocaleString('ru-RU');

        row.innerHTML = `
            <td>${x}</td>
            <td>${y}</td>
            <td>${r}</td>
            <td>${resultText}</td>
            <td>${displayTime}</td>
        `;

        tbody.insertBefore(row, tbody.firstChild);
    }


    function saveToLocalStorage(x, y, r, resultText, dateTimeString) {
        const results = JSON.parse(localStorage.getItem('pointsData')) || [];

        results.push({ x, y, r, resultText, dateTimeString });

        localStorage.setItem('pointsData', JSON.stringify(results));
    }


    function loadTableData() {
        let results = JSON.parse(localStorage.getItem('pointsData')) || [];

        results.forEach(item => {
            addResultToTable(item.x, item.y, item.r, item.resultText, item.dateTimeString);
        });
    }
});