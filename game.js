var GRID = 0;
var DIMENSIONS = 10;
var BOX_SIZE = 400;

var STATE = "off";

var MODE = "day";

var MOVE_FORWARD = true;
var MOVE_BACKWARD = true;

var WALL_BUFFER = 10;

let CURRENT_CELL;

let CAM_POS;
let CAM_DIR;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class cell {

	constructor(i, j) {

		this.i = i;
		this.j = j;

		this.visited = false;
		this.walls = [true, true, true, true];

	}

	nextCell(grid, cellStack) {

		this.visited = true;

		var neighbors = [];

		if (this.j > 0) {

			var cell = grid[this.i][this.j - 1];
			if (!cell.visited) neighbors.push([cell, "top"]);

		}

		if (this.i < grid.length - 1) {

			var cell = grid[this.i + 1][this.j];
			if (!cell.visited) neighbors.push([cell, "right"]);
			
		}

		if (this.j < grid[this.i].length - 1) {

			var cell = grid[this.i][this.j + 1];
			if (!cell.visited) neighbors.push([cell, "bottom"]);

		}

		if (this.i > 0) {

			var cell = grid[this.i - 1][this.j];
			if (!cell.visited) neighbors.push([cell, "left"]);
		
		}

		if (neighbors.length > 0) {

			cellStack.push(this);

			var randInt = getRandomInt(0, neighbors.length - 1);
			var neighborInfo = neighbors[randInt];

			if (neighborInfo[1] == "top") {

				this.walls[0] = false;
				neighborInfo[0].walls[2] = false;

			} else if (neighborInfo[1] == "right") {

				this.walls[1] = false;
				neighborInfo[0].walls[3] = false;

			} else if (neighborInfo[1] == "bottom") {

				this.walls[2] = false;
				neighborInfo[0].walls[0] = false;

			} else if (neighborInfo[1] == "left") {

				this.walls[3] = false;
				neighborInfo[0].walls[1] = false;

			}

			neighborInfo[0].nextCell(grid, cellStack);

		} else if (cellStack.length > 0) {

			var lastCell = cellStack.pop();
			lastCell.nextCell(grid, cellStack);			

		}

	}

	draw() {

		noStroke();

		var x = BOX_SIZE * this.i;
		var y = BOX_SIZE * this.j;

		var height = 200;



		if (this.walls[0]) {

			beginShape();

			ambientMaterial(0, 255, 0);

			vertex(x, y, 0);
			vertex(x + BOX_SIZE, y, 0);
			vertex(x + BOX_SIZE, y, height);
			vertex(x, y, height);
			vertex(x, y, 0);

			endShape(CLOSE);

		}

		if (this.walls[1]) {

			beginShape();

			ambientMaterial(0, 255, 0);

			vertex(x + BOX_SIZE, y, 0);
			vertex(x + BOX_SIZE, y + BOX_SIZE, 0);
			vertex(x + BOX_SIZE, y + BOX_SIZE, height);
			vertex(x + BOX_SIZE, y, height);
			vertex(x + BOX_SIZE, y, 0);

			endShape(CLOSE);

		}

		if (this.walls[2]) {

			beginShape();

			ambientMaterial(0, 255, 0);
			

			vertex(x + BOX_SIZE, y + BOX_SIZE, 0);
			vertex(x, y + BOX_SIZE, 0);
			vertex(x, y + BOX_SIZE, height);
			vertex(x + BOX_SIZE, y + BOX_SIZE, height);
			vertex(x + BOX_SIZE, y + BOX_SIZE, 0);

			endShape(CLOSE);
			
		}

		if (this.walls[3]) {

			beginShape();

			ambientMaterial(0, 255, 0);

			

			vertex(x, y + BOX_SIZE, 0);
			vertex(x, y, 0);
			vertex(x, y, height);
			vertex(x, y + BOX_SIZE, height);
			vertex(x, y + BOX_SIZE, 0);

			endShape(CLOSE);

		}

	}

}

function initMaze() {

	var grid = [];

	for (var i = 0; i < DIMENSIONS; i++) {
		
		grid[i] = [];

		for (var j = 0; j < DIMENSIONS; j++) {

			grid[i][j] = new cell(i, j);
		
		}
	
	}

	var cellStack = [];

	currentBox = grid[0][0];
	currentBox.nextCell(grid, cellStack);


	grid[0][0].walls[3] = false;
	//grid[DIMENSIONS - 1][DIMENSIONS - 1].walls[1] = false;

	return grid;

}

function rotateVector(vector, angle) {

	var vector2D = createVector(vector.x, vector.y);
	var rotatedVector2D = vector2D.rotate(angle);

	return createVector(rotatedVector2D.x, rotatedVector2D.y, vector.z);

}

function cellFromPosition(x, y, grid) {

	i = Math.floor(x / BOX_SIZE);
	j = Math.floor(y / BOX_SIZE);

	if (i >= 0 && i < DIMENSIONS && j >= 0 && j < DIMENSIONS) {

		return grid[i][j];

	} else {

		return null;

	}

}

function indexFromPosition(x, y) {

	i = Math.floor(x / BOX_SIZE);
	j = Math.floor(y / BOX_SIZE);

	return [i, j];

}


function move() {

	if (STATE == "on") {

		if (keyIsDown(87)) {

			if (MOVE_FORWARD) CAM_POS.add(CAM_DIR);
			
		} if (keyIsDown(68)) {

			CAM_DIR = rotateVector(CAM_DIR, 0.05);

		} if (keyIsDown(83)) {

			if (MOVE_BACKWARD) CAM_POS.sub(CAM_DIR);

		} if (keyIsDown(65)) {

			CAM_DIR = rotateVector(CAM_DIR, -0.05);

		} 

	}

}

function renderMaze() {

	if (MODE == "day") background(50, 130, 250);

	if (MODE == "night") background(10, 15, 20);

	camI = CAM_POS.x / BOX_SIZE;
	camJ = CAM_POS.y / BOX_SIZE;

	for (var i = 0; i < GRID.length; i++) {
		
	 	for (var j = 0; j < GRID[i].length; j++) {
  				
	 		if (camI - i > -3 && camI - i < 3 && camJ - j > -3 && camJ - j < 3) {

	 			GRID[i][j].draw();

	 		}
		
	 	}
	
	}

	beginShape();

	ambientMaterial(0, 150, 0);

	vertex(-4000, -1000);
	vertex(DIMENSIONS * BOX_SIZE, -1000);
	vertex(DIMENSIONS * BOX_SIZE, DIMENSIONS * BOX_SIZE);
	vertex(-4000, DIMENSIONS * BOX_SIZE);
	vertex(-4000, -1000);

	endShape(CLOSE);
	sphere(0);
	
	endShape(CLOSE);
	

	if (MODE == "day") {

		pointLight(255, 255, 255, -2 * BOX_SIZE, -2 * BOX_SIZE, 2000);
		pointLight(255, 255, 255, (BOX_SIZE + 2) * DIMENSIONS, -2 * BOX_SIZE, 2000);
		pointLight(255, 255, 255, -2 * BOX_SIZE, (BOX_SIZE + 2) * DIMENSIONS, 3000);
		pointLight(255, 255, 255, (BOX_SIZE + 2) * DIMENSIONS, (BOX_SIZE + 2) * DIMENSIONS, 2000);

		pointLight(255, 255, 255, DIMENSIONS * BOX_SIZE * 0.5,  DIMENSIONS * BOX_SIZE * 0.5, 2000);

		ambientLight(30, 30, 30);


	} else if (MODE == "night") {

		pointLight(90, 90, 90, CAM_POS.x, CAM_POS.y - 1000, CAM_POS.z * 4);

	}

}

function checkBorderForward() {

	var currentCell = cellFromPosition(CAM_POS.x, CAM_POS.y, GRID);
	var nextIndex = indexFromPosition(CAM_POS.x + CAM_DIR.x * WALL_BUFFER, CAM_POS.y + CAM_DIR.y * WALL_BUFFER, GRID);

	
	if (currentCell != null) {

		if (nextIndex[0] != currentCell.i || nextIndex[1] != currentCell.j) {

			if (nextIndex[0] == currentCell.i && nextIndex[1] == currentCell.j - 1) {

				if (currentCell.walls[0]) MOVE_FORWARD = false;
				else MOVE_FORWARD = true;

			} else if (nextIndex[0] == currentCell.i + 1 && nextIndex[1] == currentCell.j) {

				if (currentCell.walls[1]) MOVE_FORWARD = false;
				else MOVE_FORWARD = true;

			} else if (nextIndex[0] == currentCell.i && nextIndex[1] == currentCell.j + 1) {

				if (currentCell.walls[2]) MOVE_FORWARD = false;
				else MOVE_FORWARD = true;
				
			} else if (nextIndex[0] == currentCell.i - 1 && nextIndex[1] == currentCell.j) {

				if (currentCell.walls[3]) MOVE_FORWARD = false;
				else MOVE_FORWARD = true;

			} else MOVE_FORWARD = false;

		} else MOVE_FORWARD = true;

	}
}

function checkBorderBackward() {

	var currentCell = cellFromPosition(CAM_POS.x, CAM_POS.y, GRID);
	var nextIndex = indexFromPosition(CAM_POS.x - CAM_DIR.x * WALL_BUFFER, CAM_POS.y - CAM_DIR.y * WALL_BUFFER, GRID);

	if (currentCell != null) {

		if (nextIndex[0] != currentCell.i || nextIndex[1] != currentCell.j) {


			console.log([currentCell.i, currentCell.j] + " " + nextIndex);


			if (nextIndex[0] == currentCell.i && nextIndex[1] == currentCell.j - 1) {

				console.log("top");

				if (currentCell.walls[0]) MOVE_BACKWARD = false;
				else MOVE_BACKWARD = true;

			} else if (nextIndex[0] == currentCell.i + 1 && nextIndex[1] == currentCell.j) {

				console.log("right");

				if (currentCell.walls[1]) MOVE_BACKWARD = false;
				else MOVE_BACKWARD = true;

			} else if (nextIndex[0] == currentCell.i && nextIndex[1] == currentCell.j + 1) {

				console.log("bottom");

				if (currentCell.walls[2]) MOVE_BACKWARD = false;
				else MOVE_BACKWARD = true;
				
			} else if (nextIndex[0] == currentCell.i - 1 && nextIndex[1] == currentCell.j) {

				console.log("left");

				if (currentCell.walls[3]) MOVE_BACKWARD = false;
				else MOVE_BACKWARD = true;

			} else MOVE_BACKWARD = false;

		} else MOVE_BACKWARD = true;

	}
}



function setup() {

	createCanvas(window.innerWidth, window.innerHeight, WEBGL);
	frameRate(30);
	setAttributes('perPixelLighting', true);

	GRID = initMaze();	
	CAM_POS = createVector(BOX_SIZE * DIMENSIONS - BOX_SIZE/2, BOX_SIZE * DIMENSIONS - BOX_SIZE/2, 100);
	CAM_DIR = createVector(-10, -10, 0);

}

function draw() {
	
	if (keyIsPressed) move();
 
	camera(
		CAM_POS.x, 
		CAM_POS.y, 
		CAM_POS.z, 
		CAM_POS.x + CAM_DIR.x,  
		CAM_POS.y + CAM_DIR.y, 
		CAM_POS.z + CAM_DIR.z, 
		0, 
		0, 
		-1);

	checkBorderForward();
	checkBorderBackward();
	renderMaze();

	console.log(STATE);
	
}
