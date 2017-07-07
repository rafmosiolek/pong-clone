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
	// player can update the position of its paddle depenging on a keypress event
	player.update();
	// computer will try to position its paddle according to the center of the ball (simple AI)
	computer.update(ball);
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

Paddle.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
	this.x_speed = x;
	this.y_speed = y;

	// all the way to the top
	if (this.y < 0) {
		this.y = 0;
		this.y_speed = 0;
	}
	// all the way to the bottom
	else if (this.y + this.height > 400) {
		this.y = 400 - this.height;
		this.y_speed = 0;
	}

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

// Player's paddle controls
Player.prototype.update = function() {
	for (var key in controls) {
		var value = Number(key);
		// key W or up arrow
		if(value == 87 || value == 38) {
			this.paddle.move(0, -4);
		// key S or down arrow
		} else if (value == 83 || value == 40) {
			this.paddle.move(0, 4);
		} else {
			this.paddle.move(0, 0);
		}
	}
};


Computer.prototype.render = function() {
	this.paddle.render();
};


Computer.prototype.update = function(ball) {
	
	var y_pos = ball.y;
	// add max speed so player can score a point
	var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
	// max speed to the top
	if (diff < 0 && diff < -4) {
		diff = -5;
	}
	// max speed to the bottom
	else if (diff > 0 && diff > 4) {
		diff = 5;
	}
	// edges
	this.paddle.move(0, diff);
	if (this.paddle.y < 0) {
		this.paddle.y = 0;
	} else if (this.paddle.y + this.paddle.height > 400) {
		this.paddle.y = 400 - this.paddle.height;
	}
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

	
	var top_x = this.x + 5;
	var top_y = this.y + 5;
	var bottom_x = this.x - 5;
	var bottom_y = this.y - 5;

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
		if ( bottom_x < (paddle1.x + paddle1.width) && top_x > paddle1.x && bottom_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
			this.y_speed = 3;
			this.y_speed += (paddle1.y_speed / 2);
			this.x += this.x_speed;
		}
	// hit the computer's paddle
	} else {
		if (top_x < (paddle2.x + paddle2.height) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_x > paddle2.x) {
			this.y_speed = -3;
			this.y_speed += (paddle2.y_speed / 2);
			this.x += this.y_speed;
		}
	}
};


//   if(top_y > 300) {
//     if(top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x) {
//       // hit the player's paddle
//       this.y_speed = -3;
//       this.x_speed += (paddle1.x_speed / 2);
//       this.y += this.y_speed;
//     }
//   } else {
//     if(top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x) {
//       // hit the computer's paddle
//       this.y_speed = 3;
//       this.x_speed += (paddle2.x_speed / 2);
//       this.y += this.y_speed;
//     }
//   }
// };









// Controls
// create a controls object to keep track of which key is pressed
var controls = {

};

window.addEventListener("keydown", function(e) {
	controls[e.keyCode] = true;
});

window.addEventListener("keyup", function(e){
	delete controls[e.keyCode];
});














