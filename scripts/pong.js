// invoke the requestAnimationFrame API for animating the whole display
var animate =	window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function(callback) { 
					window.setTimeout(callback, 1000/60);
				};


// setup a canvas element
var canvas = document.createElement("canvas");
var width = 600;
var height = 400;
canvas.width = width = window.innerWidth;
canvas.height = height = window.innerHeight;
// grab canvas' context - the object that directly represents the drawing area of the canvas and allows to draw 2D shapes on it.
var context = canvas.getContext("2d");



// attach the canvas element to the screen when the page is loaded
window.onload = function() {
	document.body.appendChild(canvas);
	animate(step);
};

// update all the objects (paddles and ball), render those objects and use requestAnimationFrame API to call itself again - recursion
function step() {
	update();
	render();
	animate(step);
}