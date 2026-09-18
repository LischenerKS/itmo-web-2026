document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('graph');

    const context = canvas.getContext('2d');

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const R = 100;


    context.fillStyle = '#3399FF';

    //rectangle
    context.fillRect(centerX - R, centerY, R, R);

    //triangle
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.lineTo(centerX + R / 2, centerY);
    context.lineTo(centerX, centerY - R / 2);
    context.fill();

    //circle sector
    context.beginPath();
    context.moveTo(centerX, centerY);
    context.arc(centerX, centerY, R / 2, 0, Math.PI / 2);
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



    const points = [
        { multi: 1, label: "R" },
        { multi: 0.5, label: "R/2" },
        { multi: -0.5, label: "-R/2" },
        { multi: -1, label: "-R" }
    ];


    points.forEach(p => {
        const offset = p.multi * R;

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
});