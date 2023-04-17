
export var lineToDraw = [[80,80], [40,30], [100,10], [200,50], [250,120], [200,120]]; 

export var canvas = document.getElementById("canvas");
export var context = canvas.getContext("2d");

export var tension = 0.5;
export var numOfSegments = 16;
export var resolution = 10;
export var points = [];
export var res = [];


var t1x = 0;
var t2x = 0;
var t1y = 0;
var t2y = 0;

var c1 = 0;
var c2 = 0;
var c3 = 0;
var c4 = 0;

var x = 0;
var y = 0;

var st = 0;
var canDraw = true;

export function drawPoints()
{
    initialize();
    drawPoint(context, lineToDraw);
}

export function drawCurves()
{
    initialize();
    drawCurve(context, lineToDraw, tension, resolution);
}

function getCurvePoints (lineToDraw, tension, resolution) 
{
    canDraw = false;
    points = lineToDraw.slice(0);

    points.unshift(lineToDraw[0]);
    points.push(lineToDraw[lineToDraw.length-1]);

    for (let i=1; i < (points.length - 2); i++) 
    {
        for (let t=0; t <= numOfSegments; t++) 
        { 
            // calc tension vectors
            t1x = (points[i+1][0] - points[i-1][0]) * tension;
            t2x = (points[i+2][0] - points[i][0]) * tension;

            t1y = (points[i+1][1] - points[i-1][1]) * tension;
            t2y = (points[i+2][1] - points[i][1]) * tension;

            // calc step
            st = t / numOfSegments;

            // calc cardinals
            c1 =   2 * Math.pow(st, 3) 	- 3 * Math.pow(st, 2) + 1; 
            c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
            c3 = 	   Math.pow(st, 3)	- 2 * Math.pow(st, 2) + st; 
            c4 = 	   Math.pow(st, 3)	- 	  Math.pow(st, 2);

            // calc x and y cords with common control vectors
            x = c1 * points[i][0] + c2 * points[i+1][0] + c3 * t1x + c4 * t2x;
            y = c1 * points[i][1] + c2 * points[i+1][1] + c3 * t1y + c4 * t2y;

            //store points in array
            res.push([x,y]);
        }
    }
    canDraw = true;

    return res;
}

function drawCurve(context, lineToDraw, tension, resolution) 
{ 
    if(!canDraw) return
    drawLines(context, getCurvePoints(lineToDraw, tension, resolution));
    res = [];
}

function drawLines(context, points) 
{ 
    context.beginPath();
        context.moveTo(points[0][0], points[0][1]);
        for(let i=1;i<points.length;i++)
        {
            context.lineTo(points[i][0], points[i][1]);
           /*  if(i == points.length-1)
                context.lineTo(points[0][0], points[0][1]); */
        }
    context.stroke();
    return points;
}

function drawPoint (context, points, radius)
{ 
    getCurvePoints(lineToDraw, tension, resolution)
    radius = radius||2;
    context.beginPath();
        for(var i=0;i<points.length;i++) 
            context.rect(points[i][0] - radius, points[i][1] - radius, 2*radius, 2*radius);
    context.stroke();
}

function initialize()
{
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "red";
}

export function getMousePos()
{
    canvas.addEventListener("mousemove", mousePosition);
}

function mousePosition(evt) 
{
    var rect = canvas.getBoundingClientRect();
    var position = 
    {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };

    lineToDraw[5][0] = position.x;
    lineToDraw[5][1] = position.y;

    drawCurves();
  }

export function movePoint()
{

}


var offset = 5;

export function getPoint(mousePosition)
{
    for(let i = 0; i < lineToDraw.length; i++)
    {
        if(mousePosition.x > lineToDraw[i][0] - offset &&
            mousePosition.x < lineToDraw[i][0] + offset &&
            mousePosition.y > lineToDraw[i][1] - offset &&
            mousePosition.y < lineToDraw[i][1] + offset)
        {
            lineToDraw[i][0] = mousePosition.x;
            lineToDraw[i][1] = mousePosition.y;
        }
    }
}