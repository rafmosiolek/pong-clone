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
canvas.width = width;
canvas.height = height;
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


function update() {
	// animate the ball
	ball.update(player.paddle, computer.paddle);
}


var player = new Player();
var computer = new Computer();
var ball = new Ball(300, 200);

// render a table game by using the canvas API methods
function render() {
	context.fillStyle = "#2c3e50";
	context.fillRect(0, 0, width, height);
	
	context.fillStyle = "white";
	context.fillRect(299, 0, 5, height);

	context.beginPath();
	context.arc(300, 200, 50, 2 * Math.PI, false);
	context.stroke();
	context.strokeStyle = "white";
	context.lineWidth = 5;

	player.render();
	computer.render();
	ball.render();
}

// constructor function for Paddle object with x,y position, width and height and x,y speed
function Paddle (x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
}

// render Paddle object to the screen
Paddle.prototype.render = function() {
	context.fillStyle = "#ecf0f1";
	context.fillRect(this.x, this.y, this.width, this.height);
};


// constructor function for the Player object (controls one of the paddles)
function Player() {
	this.paddle = new Paddle(10, 175, 10, 50);
}

// constructor function for the Computer object (AI that will control the other paddle);
function Computer() {
	this.paddle = new Paddle(580, 175, 10, 50);
}

// render Computer's nad Player's paddles
Player.prototype.render = function() {
	this.paddle.render();
};

Computer.prototype.render = function() {
	this.paddle.render();
};


// constructor function for the Ball object 
function Ball (x, y) {
	this.x = x;
	this.y = y;
	this.x_speed = 0;
	this.y_speed = 3;
	this.radius = 5;
}

// render the Ball object to the screen
Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
	context.fillStyle = "#e74c3c";
	context.fill();
};

// add update method to the Ball object that will animate it inside the update function
Ball.prototype.update = function(paddle1, paddle2) {
	this.x += this.y_speed;
	this.y += this.x_speed;

	
	var top_x = this.x - 5;
	var top_y = this.y - 5;
	var bottom_x = this.x + 5;
	var bottom_y = this.y + 5;

	// add AABB collision detection - Axis-aligned minimum Bounding Box
		// hitting the top wall
	if (this.y - 5 < 0) {
		this.y = 5;
		this.y_speed = -this.y_speed;
		// hitting the bottom wall
	} else if (this.y + 5 > 400) {
		this.y = 395;
		this.y_speed = -this.y_speed;
	}
		// a point was scored
	if (this.x > 600 || this.x < 0) {
		this.x_speed = 0;
		this.y_speed = 3;
		this.x = 300;
		this.y = 200;
	}

	// hit the player's paddle
	if (top_x < 300) {
		if (top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
			this.x_speed = -3;
			this.y_speed += (paddle1.y_speed / 2);
			this.x += this.x_speed;
		}
	// hit the computer's paddle
	} else {
		if (top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_x > paddle1.x) {
			this.x_speed = 3;
			this.y_speed += (paddle2.y_speed / 2);
			this.x += this.x_speed;
		}
	}
};






























