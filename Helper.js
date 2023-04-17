/* 
Original works at https://github.com/epistemex/cardinal-spline-js
*/
var context = document.getElementById("canvas").getContext("2d");

function drawLines(context, pts) 
{ context.beginPath();
  context.moveTo(pts[0][0], pts[0][1]);
  for(i=1;i<pts.length;i++) context.lineTo(pts[i][0], pts[i][1]);
  context.stroke();
  return pts;
}
function drawPoints (context, pts, radius)
{ radius = radius||2;
  context.beginPath();
  for(var i=0;i<pts.length;i++) 
    context.rect(pts[i][0] - radius, pts[i][1] - radius, 2*radius, 2*radius);
  context.stroke();
}
function drawCurve(context, ptsa, tension, resolution) 
{ var res = drawLines(context, getCurvePoints(ptsa, tension, resolution));
  drawPoints (context, res);
}

// Line to draw
var line = [[80,80], [40,30], [100,10], [200,50], [250,120], [200,120]]; //minimum two points
// Close line ?
// line.push(line[0]);
// Tension on nodes
var tension = .5;
// Resolution: (10px)
var resolution = 10;

context.strokeStyle = "red";
drawCurve(context, line, tension, resolution);
context.strokeStyle = "black";
drawPoints(context, line, 3);


function getCurvePoints (line, tension, resolution) 
{

  // use input value if provided, or use a default value	 
  tension = typeof tension === "number" ? tension : 0.5;
  resolution = resolution || 10;

  var pts, res = [],	      // clone array
      x, y,			            // our x,y coords
      t1x, t2x, t1y, t2y,	  // tension vectors
      c1, c2, c3, c4,		    // cardinal points
      st, t, i;		          // steps based on num. of segments

  // clone array so we don't change the original
  //
  pts = line.slice(0);

  // The algorithm require a previous and next point to the actual point array.
  // Check if we will draw closed or open curve.
  // If closed, copy end points to beginning and first points to end
  // If open, duplicate first points to befinning, end points to end
  if (line.length>2 && line[0][0]==line[line.length-1][0] && line[0][1]==line[line.length-1][1]) 
  { pts.unshift(line[line.length-2]);
    pts.push(line[1]);
  }
  else 
  { pts.unshift(line[0]);
    pts.push(line[line.length-1]);
  }

  // ok, lets start..

  // 1. loop goes through point array
  // 2. loop goes through each segment between the 2 pts + 1e point before and after
  for (i=1; i < (pts.length - 2); i++) 
  {
    
    var dx = pts[i+1][0]-pts[i][0];
    var dy = pts[i+1][1]-pts[i][1];
    var numOfSegments = Math.round(Math.sqrt(dx*dx+dy*dy)/resolution);
      
    for (t=0; t <= numOfSegments; t++) 
    { // calc tension vectors
      t1x = (pts[i+1][0] - pts[i-1][0]) * tension;
      t2x = (pts[i+2][0] - pts[i][0]) * tension;

      t1y = (pts[i+1][1] - pts[i-1][1]) * tension;
      t2y = (pts[i+2][1] - pts[i][1]) * tension;

      // calc step
      st = t / numOfSegments;

      // calc cardinals
      c1 =   2 * Math.pow(st, 3) 	- 3 * Math.pow(st, 2) + 1; 
      c2 = -(2 * Math.pow(st, 3)) + 3 * Math.pow(st, 2); 
      c3 = 	   Math.pow(st, 3)	- 2 * Math.pow(st, 2) + st; 
      c4 = 	   Math.pow(st, 3)	- 	  Math.pow(st, 2);

      // calc x and y cords with common control vectors
      x = c1 * pts[i][0]	+ c2 * pts[i+1][0] + c3 * t1x + c4 * t2x;
      y = c1 * pts[i][1]	+ c2 * pts[i+1][1] + c3 * t1y + c4 * t2y;

      //store points in array
      res.push([x,y]);

    }
  }

  return res;
}