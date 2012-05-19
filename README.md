MathGraph
=========

MathGraph is an easy way to display mathematical functions on your website.

Uses HTML5 Canvas. Supported in newer versions of the major browsers.

This is an expanded and reworked version of the example from:
http://matt.might.net/articles/rendering-mathematical-functions-in-javascript-with-canvas-html/

Live example: http://www.tthe.se/files/documents/graph/

Setup
-----

Include graph.js and create a canvas with suitable dimensions

	<canvas id="mathgraph" width="535" height="560" style="border: 1px solid;">
		MathGraph requires Canvas. Your browser is outdated.
	</canvas>

Configure MathGraph

	// The following code is from index.html
	
	// Create new object with the canvas id as parameter
	var m = new MathGraph('mathgraph');
	    
    // The second parameter determines when the point on the curve
    // should be moved. Default is 'click'
    //m = new MathGraph('mathgraph', 'drag');
    //m = new MathGraph('mathgraph', 'mousemove');
    
	// Define the functions
	m.Functions = {
		f1 : function(x) {
			return x*x*x + 3*x*x - 9*x - 12;
		},
		f2 : function(x) {
			return 4*x + 3;
		}
	};
	
	// The color of the plotted function. Default is black.
	m.FColors = {
		f1 : '#FF0000'
	};
	
	
	// Properties of the coordinate system
	m.MaxY = 50;
	m.MinY = -50;
	m.MaxX = 10;
	m.MinX = -10; // The default values of these four are -10/10
	
	m.YTick = 6;
	m.XTick = 1; // The distance between the points on the axes (default: 1)
	
	// Draws MathGraph:
	m.Draw();
	
	// Draws a dot at a specific X-value.
	// param1: function name. param2: X-value.
	// param3: If all other dots should be removed before drawing.
	m.DrawDot('f1',1,true);
	m.DrawDot('f1',3,false);
 




 



