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

    context.moveTo(0, centerY);
    context.lineTo(canvas.width, centerY);

    context.moveTo(centerX, 0);
    context.lineTo(centerX, canvas.height);

    context.stroke();
});