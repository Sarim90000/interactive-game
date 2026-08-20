var gameChar_x;
var gameChar_y;
var floorPos_y;
var tree_x;
var isLeft = false;
var isRight = false;
var isFalling = false;
var isPlummeting = false;
var isGameFinished = false;
var collectables;
var gameComplete;
var cloud_x;
var mountain_x;
var canyons;
var cameraPosX;
var dollarSound;
var jumpSound;
var canyonFalling;
var gameScore;
var flagpole;
var leftBoundary = -700;
var lives;
var enemies;
var platforms;

function preload()
{
    soundFormats('mp3','wav');
    //load your sounds here
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
	//load your sounds here
	gameSound = loadSound('assets/gamesound.wav');
	gameSound.setVolume(0.1);
	//load your sounds here
	canyonFalling = loadSound('assets/canyonfalling.wav');
	canyonFalling.setVolume(0.1);
	//load your sounds here
	dollarSound = loadSound('assets/dollarsound.wav');
	dollarSound.setVolume(0.1);
	//load your sounds here
	gameComplete = loadSound('assets/gamecomplete.wav');
	gameComplete.setVolume(0.2);
	//load your sounds here
	lostlife = loadSound('assets/lostlife.wav');
	lostlife.setVolume(0.1);
}

function setup() {
	createCanvas(1024, 576);
	floorPos_y = height * 3 / 4;
	gameChar_x = width / 2;
	lives = 4
	startGame();
	gameChar_y = floorPos_y;
}
function startGame() {
    gameChar_x = width / 2;
    gameChar_y = floorPos_y;
    isPlummeting = false; 
    isLeft = false;
    isRight = false;
    isFalling = false;
    gameScore = 0;

	mountain_x = [100, 2000];
	tree_x = [550, 780, 900, 1800, 2000, 2300];
	cloud_x = [100, 500, 800, 2000, 2200, 2500];
	cameraPosX = 0;

	 canyons = [
		{ x_pos: 600, width: 120 },
		{ x_pos: 900, width: 125 },
		{ x_pos: 1400, width: 120 },
		{ x_pos: 2000, width: 130 },
		{ x_pos: 2400, width: 135 },
		{ x_pos: 2900, width: 140 }

	  ];
	collectables = [];
	for (var i = 0; i < 8; i++) {
		collectables.push({
			posX: round(random(-150, 2100)),
			posY: 300,
			isFound: false
		});
	}	
	
	flagpole = {
		x_pos: 3200,
		isReached: false
	};
	platforms =[];
	platforms.push(createPlatform(200,floorPos_y-100,150));
	platforms.push(createPlatform(900,floorPos_y -105,150));
	platforms.push(createPlatform(2000,floorPos_y -100,150));
	platforms.push(createPlatform(2800,floorPos_y -95,150));

	
	enemies = [];
	enemies.push(new Enemy(-100,floorPos_y-10,100))
	enemies.push(new Enemy(1150,floorPos_y-10,100))
	enemies.push(new Enemy(1750,floorPos_y-10,100))
	enemies.push(new Enemy(2700,floorPos_y-10,100))

}

function draw() {

	if (lives <= 0) {
	displayGameOver();
			return; 
		}	
	checkPlayerDie();
	background(100, 145, 200);
	noStroke();
	fill(0, 155, 0);
	rect(0, floorPos_y, width, height - floorPos_y);
    if (flagpole.isReached == false) {
        checkFlagpole();
    }
	if (isGameFinished) {
        displayGameFinished(); 
        return; 
    }
    if (gameChar_x >= flagpole.x_pos - 20 && gameChar_x <= flagpole.x_pos + 20 && gameScore < 8) {
        displayIncompleteMessage();
    }
    //moving camera
	cameraPosX = gameChar_x - width / 2
	push();
	translate(-cameraPosX, 0);
	
	//canyon
	for (var i = 0; i < canyons.length; i++) {    
		drawCanyon(canyons[i]);
		checkCanyon(canyons[i]);
	}
	if (isPlummeting == true) {
		gameChar_y += 12;
		 canyonFalling.play();
	}
	//Mountains
	drawMountains();
	//tree
	drawTrees();
	//cloud
	drawClouds();
	//collectable
	for (var i = 0; i < collectables.length; i++) {
		drawCollectable(collectables[i]);
		checkCollectable(collectables[i]);
	}
	//flagpole
	drawFlagpole();
	if (flagpole.isReached == false) {
		checkFlagpole();  
	}
	//drawing platforms
for (var i=0; i < platforms.length; i++)
	{
		platforms[i].draw();
	}
	//Enemies
	for(var i = 0; i < enemies.length; i++){
		enemies[i].draw();
		var isContact = enemies[i].checkContact(gameChar_x, gameChar_y);
		if(isContact){
			if(lives > 0){
				startGame();
				lostlife.play();
				break;
			}
		}
	}

	//Character
	if (isLeft && isFalling) {
		//character jumping-left 
		fill(255, 300, 130);    // head
		ellipse(gameChar_x, gameChar_y - 100 + 40, 14);// Moved head lower
		fill(0, 0, 0);// beanie
		arc(gameChar_x, gameChar_y - 105 + 40, 14, 20, PI, TWO_PI, CHORD);
		rect(gameChar_x - 7, gameChar_y - 105 + 40, 14, 3);
		fill(255);
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 103 + 43, 2);// pupil
		fill(204, 204, 204);// mouth
		ellipse(gameChar_x - 3, gameChar_y - 98 + 43, 4);
		stroke(100);
		noFill();
		arc(gameChar_x - 3, gameChar_y - 98 + 43, 5, 1, PI, TWO_PI);
		fill(220, 20, 60);// body
		rect(gameChar_x - 7, gameChar_y - 100 + 50, 14, 28);// Moved body lower
		rect(gameChar_x + 2, gameChar_y - 93 + 43, 5, 19);// Right arm
		rect(gameChar_x - 6, gameChar_y - 65 + 43, 7, 18);// Left leg
		rect(gameChar_x, gameChar_y - 65 + 43, 7, 18);// Right leg
		noStroke();
		fill(0);// shoes
		rect(gameChar_x - 6, gameChar_y - 47 + 43, 6, 4);
		rect(gameChar_x, gameChar_y - 47 + 43, 6, 4);

	}
	else if (isLeft) {
		//walking left 
		fill(255, 300, 130);// head
		ellipse(gameChar_x, gameChar_y - 100 + 40, 14);// Moved head lower
		fill(0, 0, 0);// beanie
		arc(gameChar_x, gameChar_y - 105 + 40, 14, 20, PI, TWO_PI, CHORD);
		rect(gameChar_x - 7, gameChar_y - 105 + 40, 14, 3);
		fill(255);
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 103 + 43, 2);// pupil
		fill(204, 204, 204);// mouth
		ellipse(gameChar_x - 3, gameChar_y - 98 + 43, 4);
		stroke(100);
		noFill();
		arc(gameChar_x - 3, gameChar_y - 98 + 43, 5, 1, PI, TWO_PI);
		fill(220, 20, 60);// body
		rect(gameChar_x - 7, gameChar_y - 100 + 50, 14, 28);// Moved body lower
		rect(gameChar_x + 2, gameChar_y - 93 + 43, 5, 19);// Right arm
		rect(gameChar_x - 6, gameChar_y - 65 + 43, 7, 18);// Left leg
		rect(gameChar_x, gameChar_y - 65 + 43, 7, 18);// Right leg
		noStroke();
		fill(0);// shoes
		rect(gameChar_x - 6, gameChar_y - 47 + 43, 6, 4);
		rect(gameChar_x, gameChar_y - 47 + 43, 6, 4);

	}
	else if (isRight) {
		// walking right 
		fill(255, 300, 130);// head
		ellipse(gameChar_x, gameChar_y - 100 + 40, 14);// Moved head lower
		fill(0, 0, 0);// beanie
		arc(gameChar_x, gameChar_y - 105 + 40, 14, 20, PI, TWO_PI, CHORD);
		rect(gameChar_x - 7, gameChar_y - 105 + 40, 14, 3);
		fill(255);
		fill(0);
		// pupil
		ellipse(gameChar_x + 3, gameChar_y - 103 + 43, 2);
		fill(204, 204, 204);// mouth
		ellipse(gameChar_x + 2, gameChar_y - 98 + 43, 4);
		stroke(100);
		noFill();
		arc(gameChar_x + 2, gameChar_y - 98 + 43, 4, 1, PI, TWO_PI);
		fill(220, 20, 60);// body
		rect(gameChar_x - 7, gameChar_y - 100 + 50, 14, 28);//body lower
		rect(gameChar_x - 6, gameChar_y - 93 + 43, 5, 19);// Left arm
		rect(gameChar_x - 6, gameChar_y - 65 + 43, 7, 18);// Left leg
		rect(gameChar_x, gameChar_y - 65 + 43, 7, 18);// Right leg
		noStroke();
		fill(0);// shoes
		rect(gameChar_x - 6, gameChar_y - 47 + 43, 6, 4);// Left shoe
		rect(gameChar_x, gameChar_y - 47 + 43, 6, 4);// Right shoe
	}
	else if (isFalling || isPlummeting) {
		//jumping facing forwards
		fill(255, 300, 130);// head
		ellipse(gameChar_x, gameChar_y - 100 + 40, 14);// Moved head lower
		fill(0, 0, 0);// beanie
		arc(gameChar_x, gameChar_y - 105 + 40, 14, 20, PI, TWO_PI, CHORD);
		rect(gameChar_x - 7, gameChar_y - 105 + 40, 14, 3);
		fill(255);
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 103 + 43, 2);// pupil
		ellipse(gameChar_x + 3, gameChar_y - 103 + 43, 2);
		fill(204, 204, 204);// mouth
		ellipse(gameChar_x, gameChar_y - 98 + 43, 4);
		stroke(100);
		noFill();
		arc(gameChar_x, gameChar_y - 98 + 43, 5, 1, PI, TWO_PI);
		fill(220, 20, 60);// body
		rect(gameChar_x - 7, gameChar_y - 100 + 50, 14, 28);// Moved body lower
		rect(gameChar_x - 11, gameChar_y - 93 + 43, 5, 19);// Left arm
		rect(gameChar_x + 6, gameChar_y - 93 + 43, 5, 19);// Right arm
		rect(gameChar_x - 6, gameChar_y - 65 + 43, 7, 18);// Left leg
		rect(gameChar_x, gameChar_y - 65 + 43, 7, 18);// Right leg
		noStroke();
		fill(0);// shoes
		rect(gameChar_x - 6, gameChar_y - 47 + 43, 6, 4);
		rect(gameChar_x, gameChar_y - 47 + 43, 6, 4);
	}
	else {
		// standing front facing 
		fill(255, 300, 130);    // head
		ellipse(gameChar_x, gameChar_y - 100 + 40, 14);// Moved head lower
		fill(0, 0, 0);// beanie
		arc(gameChar_x, gameChar_y - 105 + 40, 14, 20, PI, TWO_PI, CHORD);
		rect(gameChar_x - 7, gameChar_y - 105 + 40, 14, 3);
		fill(255);
		fill(0);
		ellipse(gameChar_x - 3, gameChar_y - 103 + 43, 2);// pupil
		ellipse(gameChar_x + 3, gameChar_y - 103 + 43, 2);
		fill(204, 204, 204);// mouth
		ellipse(gameChar_x, gameChar_y - 98 + 43, 4);
		stroke(100);
		noFill();
		arc(gameChar_x, gameChar_y - 98 + 43, 5, 1, PI, TWO_PI);
		fill(220, 20, 60);// body
		rect(gameChar_x - 7, gameChar_y - 100 + 50, 14, 28);// Moved body lower
		rect(gameChar_x - 11, gameChar_y - 93 + 43, 5, 19);// Left arm
		rect(gameChar_x + 6, gameChar_y - 93 + 43, 5, 19); // Right arm
		rect(gameChar_x - 6, gameChar_y - 65 + 43, 7, 18);// Left leg
		rect(gameChar_x, gameChar_y - 65 + 43, 7, 18);// Right leg
		fill(0);             // shoes
		rect(gameChar_x - 6, gameChar_y - 47 + 43, 6, 4);// Left shoe
		rect(gameChar_x, gameChar_y - 47 + 43, 6, 4);// Right shoe
	}
	pop();
	//drawing lives
	drawLives();
if (gameScore <=8) {
		fill(0,255);
		text("DOLLARS COLLECTED:-" + gameScore + "/8 collectables", 10, 20);
	}
	if (isLeft == true && gameChar_x > leftBoundary) { 
        gameChar_x -= 4;
    }
	if (isRight == true) {
		gameChar_x += 4
	}
	if (!isPlummeting) { 
		if (gameChar_y < floorPos_y) {
			var isContact = false;
			for (var i = 0; i < platforms.length; i++) {
				if (platforms[i].checkContact(gameChar_x, gameChar_y)) {
					isContact = true;
					break;
				}
			}	
			if (isContact) {
				isFalling = false; 
			} else {
				gameChar_y += 2; 
				isFalling = true;
			}
		} else {
			isFalling = false; 
			gameChar_y = floorPos_y; 
		}
	}
}	
function keyPressed() {
    console.log("keyPressed: " + key);
    console.log("keyPressed: " + keyCode);
    if (isPlummeting == false) {
        if (keyCode == 65 && gameChar_x > leftBoundary) { // Check left boundary
            isLeft = true;
        }
        if (keyCode == 68) {
            isRight = true;
        }
        if (keyCode == 87 && gameChar_y == floorPos_y) {
            gameChar_y -= 130;
            isFalling = true;
            jumpSound.play();
            gameSound.play();
        }
    }
}
function keyReleased() {
	console.log("keyReleased: " + key);
	console.log("keyReleased: " + keyCode);
	if (keyCode == 65) {
		isLeft = false;
	}
	if (keyCode == 68) {
		isRight = false;
	}
}
function drawMountains() {
	for (var i = 0; i < mountain_x.length; i++) {
		stroke(80, 60, 60);
		fill(90, 75, 65);
		triangle(mountain_x[i], floorPos_y, mountain_x[i] - 190, floorPos_y - 342, mountain_x[i] - 340, floorPos_y);
		triangle(mountain_x[i] - 340, floorPos_y, mountain_x[i] - 340, floorPos_y - 342, mountain_x[i] - 220, floorPos_y);
		triangle(mountain_x[i] - 240, floorPos_y, mountain_x[i] - 40, floorPos_y - 132, mountain_x[i] + 260, floorPos_y);
		triangle(mountain_x[i] - 40, floorPos_y, mountain_x[i] + 110, floorPos_y - 292, mountain_x[i] + 210, floorPos_y);
		triangle(mountain_x[i] + 360, floorPos_y, mountain_x[i] + 260, floorPos_y - 352, mountain_x[i] + 110, floorPos_y);
		triangle(mountain_x[i] + 260, floorPos_y, mountain_x[i] + 460, floorPos_y - 352, mountain_x[i] + 660, floorPos_y);
		triangle(mountain_x[i] + 236, floorPos_y, mountain_x[i] + 340, floorPos_y - 232, mountain_x[i] + 460, floorPos_y);
		triangle(mountain_x[i] + 1184, floorPos_y, mountain_x[i] + 620, floorPos_y - 332, mountain_x[i] + 260, floorPos_y);
	}
}
function drawTrees() {
	for (var i = 0; i < tree_x.length; i++) {
		fill(165, 42, 42)
		rect(tree_x[i], floorPos_y - 75, 30, 75)
		fill(34, 139, 34)
		triangle(tree_x[i] + 12, floorPos_y - 130, tree_x[i] + 76, floorPos_y - 60, tree_x[i] - 43, floorPos_y - 60)
	}
}
function drawClouds() {
	for (var i = 0; i < cloud_x.length; i++) {
		fill(255);
		stroke(155);
		ellipse(cloud_x[i] - 40, floorPos_y - 370, 90, 83);
		noStroke();
		ellipse(cloud_x[i], floorPos_y - 330, 90, 83);
		ellipse(cloud_x[i] - 80, floorPos_y - 330, 90, 83);
	}
}
function drawCollectable(t_collectable) {
	if (t_collectable.isFound == false) {
		fill(180, 240, 240);
		textSize(25);
		text("$", t_collectable.posX, t_collectable.posY);
	}
}

function checkCollectable(t_collectable) {
    if (!t_collectable.isFound && dist(gameChar_x, gameChar_y, t_collectable.posX, t_collectable.posY) < 50) {
        t_collectable.isFound = true;
        gameScore += 1;  
		dollarSound.play();
    }
}
function drawCanyon(canyon) {
    fill(100,155,255);
    noStroke();
    rect(canyon.x_pos, floorPos_y, canyon.width, height - floorPos_y); 
}

function checkCanyon(canyon) {
    if (
        gameChar_x >= canyon.x_pos && 
        gameChar_x <= canyon.x_pos + canyon.width && 
        gameChar_y >= floorPos_y 
    ) {
        if (!isPlummeting) {
            isPlummeting = true; 
            lives -= 1; 
        }
    }
}
function drawFlagpole() {
	if (flagpole.isReached) {
		fill(255, 0, 0);
		rect(flagpole.x_pos, floorPos_y - 150, 10, 150);  
		fill(0, 0, 255)
		triangle(flagpole.x_pos - 20, floorPos_y - 150,
			flagpole.x_pos + 20, floorPos_y - 150,
			flagpole.x_pos, floorPos_y - 180);
	} else {
		fill(0, 255, 0);  
		rect(flagpole.x_pos, floorPos_y - 150, 10, 150);  
		fill(255, 255, 0);
		triangle(flagpole.x_pos - 20, floorPos_y - 150,
			flagpole.x_pos + 20, floorPos_y - 150,
			flagpole.x_pos, floorPos_y - 180);
			
	}
}
function checkFlagpole() {
    if (gameChar_x >= flagpole.x_pos - 20 && gameChar_x <= flagpole.x_pos + 20) {
	      if (gameScore === 8) {
            flagpole.isReached = true; 
            gameComplete.play(); 
            isGameFinished = true; 
        } else {
            displayIncompleteMessage();
        }
    }
}
function displayIncompleteMessage() {
    fill(255, 0, 0); 
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Game Incomplete! Collect all collectables.", width / 2, height / 2 + 80);
}
function checkPlayerDie() {
    if (gameChar_y > height) { 
        if (!isPlummeting) {
            lives-= 1 
        }
        isPlummeting = true; 
        if (lives > 0) {
            startGame(); 
        }
    }
}
function displayGameFinished() {
    fill(0, 255, 0); 
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Finished!", width / 2, height / 2); 
}

function displayGameOver() {
	fill(255,0,0);
	textSize(32);
	textAlign(CENTER, CENTER);
	text("GAME OVER PRESS CTRL+R TO RESTART THE GAME", width / 2, height / 2); 
	
}

function drawLives() {
	fill(255, 0, 0);
	textSize(16);
	textAlign(LEFT, TOP);
	text("Lives: ", 35, 70);
	for (var i = 0; i < lives; i++) {
		fill(255, 0, 0);
		ellipse(100 + i * 20, 75, 10, 10); 
	}
}
function createPlatform(x, y, width) {var p = {
	x: x,
	y: y,
	width: width,
	draw: function(){
		fill (0,128,128);
		rect(this.x,this.y,this.width,25)
	},
	checkContact: function(gc_x, gc_y) {
		if (gc_x > this.x && gc_x < this.x + this.width) {
			var d = this.y - gc_y;
			if (d >= 0 && d < 5) { 
				return true;
			}
		}
		return false;
	}
}
return p;
}
function Enemy(x, y, range){
	this.x = x;
	this.y = y;
	this.range = range;

	this.currentX = x;
	this.inc = 1;
	
	this.update = function(){
		this.currentX += this.inc;
		if(this.currentX >= this.x + this.range)
		{
			this.inc = -1;
		}
		else if(this.currentX < this.x){
			this.inc = 1;
		}
	}
	this.draw = function() {
        this.update();
        fill(255, 0, 0); 
        ellipse(this.currentX, this.y - 20, 30, 40); 
        fill(255); 
        ellipse(this.currentX - 8, this.y - 25, 8, 8); 
        ellipse(this.currentX + 8, this.y - 25, 8, 8); 
        fill(0); 
        ellipse(this.currentX - 8, this.y - 25, 4, 4); 
        ellipse(this.currentX + 8, this.y - 25, 4, 4); 
    };

    this.checkContact = function(gc_x, gc_y) {
        var d = dist(gc_x, gc_y, this.currentX, this.y);
        if (d < 30) {
            lives -= 1;
            return true;
        }
        return false;
    };
}



