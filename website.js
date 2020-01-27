console.log("hello from website.js");

$("#playButton")
.on("click", function() {

	var lighting = $("#lighting").val();
	console.log(lighting);

	var difficulty = $("#difficulty").val();
	console.log(difficulty);

	if (lighting == "day") {

		MODE = "day";

	} else {

		MODE = "night";

	}

	if (difficulty == "easy") {

		DIMENSIONS = 15;

	} else if (difficulty == "medium") {

		DIMENSIONS = 25;

	} else if (difficulty == "hard") {

		DIMENSIONS = 40;

	} else {

		DIMENSIONS = 50;

	}	

	GRID = initMaze();	
	CAM_POS = createVector(BOX_SIZE * DIMENSIONS - BOX_SIZE/2, BOX_SIZE * DIMENSIONS - BOX_SIZE/2, 100);
	CAM_DIR = createVector(-10, -10, 0);

});

$("body").on("keyup", function (event) {

	if (event.keyCode == 81) {

		$("#UI").toggle();

		if (STATE == "on") STATE = "off";
		else STATE = "on";

	}
});

