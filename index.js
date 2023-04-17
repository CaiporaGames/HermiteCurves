import { canvas, drawPoints, getPoint, drawCurves, lineToDraw } from './drawHermite.js'
 
canvas.addEventListener("mousemove", mousePosition);

function mousePosition(evt) 
{
    var rect = canvas.getBoundingClientRect();
    var position = 
    {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
    getPoint(position);
    

    drawCurves();
    //drawPoints();
}

