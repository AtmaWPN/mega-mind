// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 912;
canvas.height = 676;
document.body.appendChild(canvas);

var gamestate = "menu";

//all the colors
var c1 = "rgb(1, 0, 103)";
var c5 = "rgb(158, 0, 142)";
var c6 = "rgb(255, 229, 2)";
var c8 = "rgb(0, 255, 0)";
var c9 = "rgb(149, 0, 58)";
var c14 = "rgb(98 14 0)";
var c16 = "rgb(0 0 255)";
var c18 = "rgb(106 130 108)";
var c21 = "rgb(190 153 112)";
var c24 = "rgb(255 0 0)";
var c26 = "rgb(255 2 157)";
var c27 = "rgb(104 61 59)";
var c34 = "rgb(254 137 0)";
var c44 = "rgb(0 71 84)";
var c45 = "rgb(67 0 44)";
var c50 = "rgb(126 45 210)";
var c56 = "rgb(0 100 1)";
var c61 = "rgb(0 255 198)";
var c62 = "rgb(255 110 65)";
var c63 = "rgb(232 94 190)";
//not for guesses
var red = "rgb(255, 0, 0)";
var white = "rgb(255, 255, 255)";
var black = "rgb(0, 0, 0)";

// (size, guesslimit, guesslength): (64, 10, 6); (48, 14, 8); (32, 20, 12);
var size = 64;
var guesslimit = 10;

var cursorX = 0;
var cursorY = 0;
var optioncursor = 2;
var mouseX = 300;
var mouseY = 300;

var codecolors = [];
var colors = [];
var colorsmaster = [c1, c5, c6, c8, c9, c14, c16, c18, c21, c24, c26, c27, c34, c44, c45, c50, c56, c61, c62, c63];
var coloramount = 6;
var guesslength = 4;

var wait = false;

var guesscount = 0;
var guess = [];
var guesses = [];
var code = [];
var score = [];
var scores = [];
var approved = 0
var scoredloc = [];
var scoredcode = [];
var won = 0;

var i;
var j;

var keysDown = {};

var arrayClear = function (listID) {
	//
	if (listID == "guess") {
		guess = [];
		guess.length = guesslength;
		guess.fill(black);
	} else if (listID == "score") {
		score = [];
		score.length = guesslength;
		score.fill(black);
	}
};

var canvasClick = function (event) {
	mouseX = event.clientX - canvas.offsetLeft + document.body.scrollLeft;
	mouseY = event.clientY - canvas.offsetTop + document.body.scrollTop;
}

//sets a random code
var randomCode = function () {
	code = [];
	while (code.length < guesslength) {
		code[code.length] = codecolors[Math.floor(Math.random() * codecolors.length)]
	}
};

var colorSetup = function () {
  colors = [];
  codecolors = [];
	for (i = 0; i < coloramount; i++) {
		j = Math.floor(Math.random() * (colorsmaster.length - 1));
		codecolors[i] = colorsmaster[j];
		colors[i] = colorsmaster[j];
		colorsmaster.splice(j, 1);
	}
	
	colors.push(black);
};

//draws the background, color options, and some dev stuff for testing
var staticDisplay = function () {
    ctx.fillStyle = black;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
	for (i = 0; i < (colors.length - 1); i++) {
		ctx.fillStyle = colors[i];
		ctx.fillRect(Math.floor(size/16), Math.floor(size/16) + (i * size), size, size);
	}
	//reset button and back button
    ctx.fillStyle = white;
	ctx.font = "16px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
    ctx.fillRect(canvas.width - 70, canvas.height - 70, 66, 66);
    ctx.fillRect(canvas.width - 70, canvas.height - 140, 66, 66);
	ctx.fillStyle = black;
	ctx.fillText("RESET", canvas.width - 37, canvas.height - 32);
	ctx.fillText("BACK", canvas.width - 37, canvas.height - 102);
	//dev numbers (shifts text down for some reason)
	/*ctx.fillStyle = "rgb(255, 255, 255)";
	ctx.font = "12px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("guesses length = " + guesses.length, 450, 500);
	ctx.fillText(guesses[0], 450, 515);
	ctx.fillText("score: " + score, 450, 530);
	ctx.fillText("guess: " + guess, 450, 545);
	ctx.fillText(code, 450, 560);
	ctx.fillText(mouseX, 450, 575);
	ctx.fillText(mouseY, 450, 590);*/
};

//draws all past guesses
var drawGuesses = function () {
	for (i = 0; i < guesses.length; i++) {
		for (j = 0; j < guesses[i].length; j++) {
			ctx.fillStyle = guesses[i][j];
			ctx.fillRect(Math.floor(2 * size/16) + size + (j * size), Math.floor(size/16) + (i * size), size, size);
		}
	}
};

//draws the current guess
var drawGuess = function () {
	for (i = 0; i < guess.length; i++) {
		ctx.fillStyle = guess[i];
		ctx.fillRect(Math.floor(2 * size/16) + size + (i * size), Math.floor(size/16) + (guesscount * size), size, size);
	}
};

//this scores the guess
var check = function () {
	scoredloc = [];
	scoredcode = [];
	for (i = 0; i < guess.length; i++) {
		if (code[i] == guess[i]) {
			score[approved] = red;
			approved++;
			scoredcode[i] = 2;
		}
	}
	for (i = 0; i < guess.length; i++) {
		for (j = 0; j < guess.length; j++) {
			if (code[i] == guess[j] && scoredcode[i] != 2 && scoredcode[j] != 2 && scoredcode[i] != 1 && scoredloc[j] != 1) {
				score[approved] = white;
				approved++;
				scoredcode[i] = 1;
				scoredloc[j] = 1;
			}
		}
	}
	scores[scores.length] = score;
	if (score[score.length - 1] == red && score.length == guesslength) {
		won = 1;
	}
	score = [];
	arrayClear("score");
	approved = 0;
};

//draw all scores for all guesses
var drawScores = function () {
	for (i = 0; i < scores.length; i++) {
		for (j = 0; j < scores[i].length; j++) {
			ctx.fillStyle = scores[i][j];
			ctx.fillRect(Math.floor(4 * size/16) + ((guesslength + 1) * size) + (j * size), Math.floor(2 * size/16) + (i * size), Math.floor(size * 3 / 4), Math.floor(size * 3 / 4));
		}
	}
};

//check if the guess is full
var fullGuess = function () {
	for (i=0; i < guess.length; i++) {
		if(guess[i] == black) {
			i=69;
		}
	}
	if (i == guess.length && guess.length == guesslength) {
		return true;
	} else if (i == 69) {
		return false;	
	}
};

// Update game objects
var update = function () {
	if (38 in keysDown && cursorY >= 1 && wait == false) { // Player holding up
		cursorY--;
    wait = true;
	} else if (38 in keysDown && cursorY == 0 && wait == false) { // Player holding up
		cursorY = (colors.length - 1);
    wait = true;
  }
	if (40 in keysDown && cursorY <= (colors.length - 2) && wait == false) { // Player holding down
		cursorY++;
    wait = true;
	} else if (40 in keysDown && cursorY == (colors.length - 1) && wait == false) { // Player holding down
		cursorY = 0;
    wait = true;
  }
	if (37 in keysDown && cursorX >= 1 && wait == false) { // Player holding left
		cursorX--;
    wait = true;
	} else if (37 in keysDown && cursorX == 0 && wait == false) { // Player holding left
		cursorX = (guesslength - 1);
    wait = true;
  }
	if (39 in keysDown && cursorX <= (guesslength - 2) && wait == false) { // Player holding right
		cursorX++;
    wait = true;
	} else if (39 in keysDown && cursorX == (guesslength - 1) && wait == false) { // Player holding right
		cursorX = 0;
    wait = true;
  }
    if (13 in keysDown && cursorX <= (guesslength - 2) && wait == false) { // Player holding enter
		guess[cursorX] = colors[cursorY];
		cursorX++;
        wait = true;
	} else if (13 in keysDown && cursorX == (guesslength - 1) && wait == false) { // Player holding enter
		guess[cursorX] = colors[cursorY];
		cursorX = 0;
        wait = true;
  }
	if (32 in keysDown && wait == false && fullGuess() == true) { // Player holding space
		guesses[guesses.length] = guess;
		check();
    guess = [];
		arrayClear("guess");
		guesscount++;
    wait = true;
	}
};

//render game objects
var render = function () {
  staticDisplay();
	drawGuesses();
	drawGuess();
	if (guesscount < guesslimit && won == 0) {
		//up/down selection cursor
		ctx.strokeStyle = white;
		ctx.strokeRect(Math.floor(size/16), Math.floor(size/16) + (cursorY * size), size - 1, size - 1);
		ctx.strokeRect(Math.floor(size/16), Math.floor(size/16) + (cursorY * size), size, size);
		//left/right selection cursor
		ctx.strokeRect(Math.floor(2 * size/16) + size + (cursorX * size), Math.floor(size/16) + (guesscount * size), size - 1, size - 1);
		ctx.strokeRect(Math.floor(2 * size/16) + size + (cursorX * size), Math.floor(size/16) + (guesscount * size), size, size);
	}
	drawScores();
};

var menuDisplay = function () {
	ctx.fillStyle = black;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = white;
	ctx.font = "69px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	ctx.fillText("MASTERMIND", canvas.width / 2, 69);
	//hitbox testing rectangles
	/*ctx.fillRect((canvas.width / 2) - 58, (canvas.height / 2) - 18, 116, 36);
	ctx.fillRect((canvas.width / 2) - 80, (canvas.height / 2) + 30, 160, 36);
	ctx.fillStyle = black;*/
	ctx.font = "36px Helvetica";
	ctx.fillText("START", canvas.width / 2, canvas.height / 2 + 10);
	ctx.fillText("SETTINGS", canvas.width / 2, canvas.height / 2 + 60);
};

var menuUpdate = function () {
	if (mouseX > ((canvas.width / 2) - 58) && mouseX < ((canvas.width / 2) + 58) && mouseY > ((canvas.height / 2) - 18) && mouseY < ((canvas.height / 2) + 18)) {
		gamestate = "game";
		arrayClear("guess");
		arrayClear("score");
		colorSetup();
		randomCode();
	}
	if (mouseX > ((canvas.width / 2) - 92) && mouseX < ((canvas.width / 2) + 92) && mouseY > ((canvas.height / 2) + 30) && mouseY < ((canvas.height / 2) + 66)) {
		gamestate = "select";
		mouseX = 0;
		mouseY = 0;
	}
};

var menuRender = function () {
	//currently useless
};

var optionDisplay = function () {
	ctx.fillStyle = black;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = white;
	ctx.font = "69px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	//testing rectangle for back button hitbox
	//ctx.fillRect((canvas.width / 2) - 40, canvas.height - 130, 80, 30);
	//ctx.fillStyle = black;
	ctx.fillText("SETTINGS", canvas.width / 2, 69);
	ctx.font = "30px Helvetica";
	ctx.fillText("BACK", canvas.width / 2, canvas.height - 105);
};

var optionUpdate = function () {
	if (13 in keysDown && optioncursor == 2 && wait == false) {
		gamestate = "menu";
		if (guesslength > 8 || coloramount > 13) {
			size = 32;
			guesslimit = 22;
		} else if (guesslength > 6 || coloramount > 9) {
			size = 48;
			guesslimit = 14;
		} else {
			size = 64;
			guesslimit = 10;
		}
		wait = true;
	}
	if (mouseX > ((canvas.width / 2) - 40) && mouseX < ((canvas.width / 2) + 40) && mouseY > (canvas.height - 130) && mouseY < (canvas.height - 100)) {
		gamestate = "menu";
		if (guesslength > 8 || coloramount > 13) {
			size = 32;
			guesslimit = 22;
		} else if (guesslength > 6 || coloramount > 9) {
			size = 48;
			guesslimit = 14;
		} else {
			size = 64;
			guesslimit = 10;
		}
	}
	if (38 in keysDown && optioncursor >= 1 && wait == false) { // Player holding up
		optioncursor--;
    wait = true;
	} else if (38 in keysDown && optioncursor == 0 && wait == false) { // Player holding up
		optioncursor = 2;
    wait = true;
  }
	if (40 in keysDown && optioncursor <= 1 && wait == false) { // Player holding down
		optioncursor++;
    wait = true;
	} else if (40 in keysDown && optioncursor == 2 && wait == false) { // Player holding down
		optioncursor = 0;
    wait = true;
  }
//left right controls for colors
	if (37 in keysDown && optioncursor == 0 && coloramount > 2 && wait == false) { // Player holding left
		coloramount--;
    wait = true;
	} else if (37 in keysDown && optioncursor == 0 && coloramount == 2 && wait == false) { // Player holding left
		coloramount = 20;
    wait = true;
  }
	if (39 in keysDown && optioncursor == 0 && coloramount < 20 && wait == false) { // Player holding right
		coloramount++;
    wait = true;
	} else if (39 in keysDown && optioncursor == 0 && coloramount == 20 && wait == false) { // Player holding right
		coloramount = 2;
    wait = true;
  }
//left right controls for guesslength
	if (37 in keysDown && optioncursor == 1 && guesslength > 1 && wait == false) { // Player holding left
		guesslength--;
    wait = true;
	} else if (37 in keysDown && optioncursor == 1 && guesslength == 1 && wait == false) { // Player holding left
		guesslength = 12;
    wait = true;
  }
	if (39 in keysDown && optioncursor == 1 && guesslength < 12 && wait == false) { // Player holding right
		guesslength++;
    wait = true;
	} else if (39 in keysDown && optioncursor == 1 && guesslength == 12 && wait == false) { // Player holding right
		guesslength = 1;
    wait = true;
  }
};

var optionRender = function () {
	//selection rectangle
	ctx.strokeStyle = white;
	ctx.strokeRect(canvas.width / 2 - 160, 234 + (optioncursor * 156), 320, 32);
	ctx.font = "30px Helvetica";
	ctx.textAlign = "center";
	ctx.textBaseline = "center";
	ctx.fillText("COLORS: " + coloramount, canvas.width / 2, 260);
	ctx.fillText("GUESS LENGTH: " + guesslength, canvas.width / 2, canvas.height - 260);
};

var main = function () {
	if (gamestate == "menu") {
		menuDisplay();
		menuUpdate();
		menuRender();
	} else if (gamestate == "select") {
		optionDisplay();
		optionUpdate();
		optionRender();
	} else if (gamestate == "game") {
		staticDisplay();
		if (won == 0) {
			update();
		} else if (won == 1) {
			alert("You Won in " + guesscount + " guesses!");
			won = 2;
		}
		if (guesscount >= guesslimit && won == 0) {
			alert("You Lose!");
			won = 3;
		}
		//reset button
		if (mouseX >= (canvas.width - 70) && mouseY >= (canvas.height - 70)) {
			reset();
		}
		if (mouseX >= (canvas.width - 70) && mouseY >= (canvas.height - 140) && mouseY <= (canvas.height - 70)) {
			reset();
			gamestate = "menu";
		}
		render();
	}
	requestAnimationFrame(main);
};

var reset = function () {
	randomCode();
	cursorX = 0;
	cursorY = 0;
	mouseX = 0;
	mouseY = 0;
	guesscount = 0;
	arrayClear("guess");
	guesses = [];
	arrayClear("score");
	scores = [];
	won = 0;
	wait = false;
	keysDown = {};
	colorsmaster = [c1, c5, c6, c8, c9, c14, c16, c18, c21, c24, c26, c27, c34, c44, c45, c50, c56, c61, c62, c63];
};

// Handle keyboard controls I won't pretend I know what's going on here
addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
    wait = false;
}, false);

addEventListener("click", canvasClick, false);

main();
