document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graph');
    const context = canvas.getContext('2d');
    const form = document.getElementById('point-form');

    drawArea("R");

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const x = parseFloat(document.getElementById('x-input').value);
        const y = parseFloat(document.getElementById('y-input').value);
        const r = parseFloat(document.querySelector('input[name="r"]:checked').value);

        drawArea(r);
    });





    function drawArea(rLabel) {
        context.clearRect(0, 0, canvas.width, canvas.height);

        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
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
        context.lineTo(canvas.width, centerY);

        context.moveTo(canvas.width - 10, centerY - 5);
        context.lineTo(canvas.width, centerY);
        context.lineTo(canvas.width - 10, centerY + 5);

        //y
        context.moveTo(centerX, 0);
        context.lineTo(centerX, canvas.height);

        context.moveTo(centerX - 5, 10);
        context.lineTo(centerX, 0);
        context.lineTo(centerX + 5, 10);

        context.fillStyle = 'black';
        context.font = "12px Arial";

        context.fillText("x", canvas.width - 15, centerY - 15);
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






});