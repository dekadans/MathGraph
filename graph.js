/*
	MathGraph by Tomas Thelander
	
	This is an expanded and reworked version of the example from:
	http://matt.might.net/articles/rendering-mathematical-functions-in-javascript-with-canvas-html/
*/


// Explanation of the different coordinate systems from:
// http://matt.might.net/articles/rendering-mathematical-functions-in-javascript-with-canvas-html/
/*
  The origin (0,0) of the canvas is the upper left:

  (0,0)
    --------- +X
   |
   |
   |
   |
   +Y

  Positive x coordinates go to the right, and positive y coordinates go down.

  The origin in mathematics is the "center," and positive y goes *up*.

  We'll refer to the mathematics coordinate system as the "logical"
  coordinate system, and the coordinate system for the canvas as the
  "physical" coordinate system.

  The functions just below set up a mapping between the two coordinate
  systems.

  They're defined as functions, so that one wanted to, they could read
  ther values from a from instead of having them hard-coded.
 
 */

function MathGraph(id, mouse)
{
	if (mouse == null)
	{
		mouse = 'click';
	}
	
	this.Canvas = document.getElementById(id);
	this.Ctx = null;
	
	this.Width = this.Canvas.width;
	this.Height = this.Canvas.height;
	
	this.MaxY = this.MaxX * this.Height / this.Width;
	this.MinY = this.MinX * this.Height / this.Width;
	
	this._addEvent(this.Canvas,mouse,function(e){
		if (e == null)
		{
			e = window.event;
		}
		// physical coordinates of the click
		x = e.offsetX?(e.offsetX):e.pageX-document.getElementById(id).offsetLeft;
		y = e.offsetY?(e.offsetY):e.pageY-document.getElementById(id).offsetTop;
		
		// logical coordinates rounded to two decimal places
		xr = Math.round(this.XCi(x)*Math.pow(10,2))/Math.pow(10,2);
		yr = Math.round(this.YCi(y)*Math.pow(10,2))/Math.pow(10,2);
		
		for (f in this.Functions)
		{
			fy = this.Functions[f](xr);
			if (fy > (yr-this.YTick/2) && fy < (yr+this.YTick/2))
			{
				this.DrawDot(f,this.XCi(x),true);
				break;
			}
		}
	},this);
	
	this._addEvent(document,'keydown',function(e){
		if (e == null)
		{
			e = window.event;
		}
		if (e.keyCode == 27)
		{
			this.Draw();
		}
	},this);
}

MathGraph.prototype = {
	constructor : MathGraph,
	
	Functions : {},
	FColors : {},
	
	Canvas : '',
	Ctx : '',
	
	Width : '',
	Height : '',
	
	MaxX : 10,
	MinX : -10,
	
	MaxY : 10,
	MinY : -10,
	
	YTick : 1,
	XTick : 1,
	
	TickLabels : true,
	
	// Returns the physical x-coordinate of a logical x-coordinate:
	XC : function(x) {
	  return (x - this.MinX) / (this.MaxX - this.MinX) * this.Width;
	},
	
	// Returns the logical x-coordinate of a physical x-coordinate:
	XCi : function(x) {
	  return (x * (this.MaxX-this.MinX))/this.Width + this.MinX;
	},
	
	// Returns the physical y-coordinate of a logical y-coordinate:
	YC : function(y) {
	  return this.Height - (y - this.MinY) / (this.MaxY - this.MinY) * this.Height;
	},
	
	// Returns the logical y-coordinate of a physical y-coordinate:
	YCi : function(y) {
	  return (this.Height-y)*(this.MaxY-this.MinY)/this.Height + this.MinY;
	},
	
	Draw : function() {
		if (this.Canvas.getContext)
		{
			this.Ctx = this.Canvas.getContext('2d');
			this.Ctx.clearRect(0,0,this.Width,this.Height);

			// Draw:
			this.DrawAxes();
			
			for (f in this.Functions)
			{
				var color = (this.FColors[f] != null) ? this.FColors[f] : '#000000';
				this.RenderFunction(this.Functions[f], color);
			}
		}
	},
	
	// DrawAxes draws the X ad Y axes, with tick marks.
	DrawAxes : function() {
		this.Ctx.font = "bold 13px sans-serif";
		this.Ctx.strokeStyle = '#000000';
		this.Ctx.save();
		this.Ctx.lineWidth = 2;
		// +Y axis
		this.Ctx.beginPath();
		this.Ctx.moveTo(this.XC(0),this.YC(0));
		this.Ctx.lineTo(this.XC(0),this.YC(this.MaxY));
		this.Ctx.stroke();

		// -Y axis
		this.Ctx.beginPath();
		this.Ctx.moveTo(this.XC(0),this.YC(0));
		this.Ctx.lineTo(this.XC(0),this.YC(this.MinY));
		this.Ctx.stroke();

		// Y axis tick marks
		var delta = this.YTick;
		for (var i = 1; (i * delta) < this.MaxY; ++i)
		{
			this.Ctx.beginPath();
			this.Ctx.moveTo(this.XC(0) - 5,this.YC(i * delta));
			this.Ctx.lineTo(this.XC(0) + 5,this.YC(i * delta));
			
			if (this.TickLabels)
			{
				this.Ctx.textBaseline = "hanging";
				this.Ctx.fillText(i * delta, this.XC(0)+7,this.YC(i * delta)-5);
			}
			
			this.Ctx.stroke();
		}

		var delta = this.YTick;
		for (var i = -1; (i * delta) > this.MinY; --i)
		{
			this.Ctx.beginPath();
			this.Ctx.moveTo(this.XC(0) - 5,this.YC(i * delta));
			this.Ctx.lineTo(this.XC(0) + 5,this.YC(i * delta));
			
			if (this.TickLabels)
			{
				this.Ctx.textBaseline = "hanging";
				this.Ctx.fillText(i * delta, this.XC(0)+7,this.YC(i * delta)-5);
			}
			
			this.Ctx.stroke();
		}

		// +X axis
		this.Ctx.beginPath();
		this.Ctx.moveTo(this.XC(0),this.YC(0));
		this.Ctx.lineTo(this.XC(this.MaxX),this.YC(0));
		this.Ctx.stroke();

		// -X axis
		this.Ctx.beginPath();
		this.Ctx.moveTo(this.XC(0),this.YC(0));
		this.Ctx.lineTo(this.XC(this.MinX),this.YC(0));
		this.Ctx.stroke();

		// X tick marks
		var delta = this.XTick;
		for (var i = 1; (i * delta) < this.MaxX; ++i)
		{
			this.Ctx.beginPath();
			this.Ctx.moveTo(this.XC(i * delta),this.YC(0)-5);
			this.Ctx.lineTo(this.XC(i * delta),this.YC(0)+5);
			
			if (this.TickLabels)
			{
				this.Ctx.textBaseline = "hanging";
				this.Ctx.fillText(i * delta, this.XC(i * delta)-3,this.YC(0)+7);
			}
			
			this.Ctx.stroke();
		}

		var delta = this.XTick;
		for (var i = -1; (i * delta) > this.MinX; --i)
		{
			this.Ctx.beginPath();
			this.Ctx.moveTo(this.XC(i * delta),this.YC(0)-5);
			this.Ctx.lineTo(this.XC(i * delta),this.YC(0)+5);
			
			if (this.TickLabels)
			{
				this.Ctx.textBaseline = "hanging";
				this.Ctx.fillText(i * delta, this.XC(i * delta)-7,this.YC(0)+7);
			}
			
			this.Ctx.stroke();
		}
		
		
		this.Ctx.textBaseline = "top";
		this.Ctx.fillText("MathGraph", 8, 5);
		
		this.Ctx.restore();
	},
	
	// Draws a dot and coordinates when click near a function
	DrawDot : function(f,x,clean)
	{
		y = this.Functions[f](x);
		yr = Math.round(y);
		xr = Math.round(x);
		
		if (clean)
		{
			this.Draw();
		}
		
		this.Ctx.beginPath();
		this.Ctx.arc(this.XC(x), this.YC(y), 4, 0, Math.PI*2, true);
		this.Ctx.closePath();
		this.Ctx.fill();
		
		this.Ctx.textBaseline = "hanging";
		this.Ctx.fillText('(' + xr + ',' + yr + ')', this.XC(x)+10,this.YC(y));
		
		if (clean)
		{
			this.Ctx.textBaseline = "top";
			this.Ctx.fillText('x = ' + Math.round(x*Math.pow(10,3))/Math.pow(10,3), 8, 30);
			this.Ctx.fillText('y = ' + Math.round(y*Math.pow(10,3))/Math.pow(10,3), 8, 45);
			
			dydx = (this.Functions[f](x+0.000001) - this.Functions[f](x))/0.000001;
			this.Ctx.fillText('dy/dx \u2248 ' + Math.round(dydx*Math.pow(10,2))/Math.pow(10,2), 8, 65);
		}
		
	},
	
	// RenderFunction(f) renders the input funtion f on the canvas.
	RenderFunction : function(f,color) {
		// When rendering, XSTEP determines the horizontal distance between points:
		var XSTEP = (this.MaxX-this.MinX)/this.Width ;

		var first = true;

		this.Ctx.beginPath();
		for (var x = this.MinX; x <= this.MaxX; x += XSTEP)
		{
			var y = f(x);
			if (first)
			{
				this.Ctx.moveTo(this.XC(x),this.YC(y));
				first = false;
			}
			else
			{
				this.Ctx.lineTo(this.XC(x),this.YC(y));
			}
		}
		this.Ctx.strokeStyle = color;
		this.Ctx.stroke();
	},
	
	/* code from http://helephant.com/2008/04/26/objects-event-handlers-and-this-in-javascript/ */
	_addEvent : function(element, eventName, eventHandler, scope){
		var scopedEventHandler = scope ? function(e) { eventHandler.apply(scope, [e]); } : eventHandler;
		if(document.addEventListener)
			element.addEventListener(eventName, scopedEventHandler, false);
		else if(document.attachEvent)
			element.attachEvent("on"+eventName, scopedEventHandler);
	}
};






