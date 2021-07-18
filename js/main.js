(function() {
	let idleMonster;
	let wizardIdleAnim;

	// Canvas
	let loaderContext;
	let loaderCanvas;
	let loaderBackgroundCanvas;
	let loaderBackgroundCanvasContext;

	// Animation states
	let runLoader = true;
	let wizardIdleAnimRun = true;
	let wizardAttackAnimRun = false;
	let attackAnimationRun = false;
	let spinAttackAnimationRun = false;
	let walkAnimationRun = false;
	let tauntAnimationRun = false;

	// Images
	let dungeonTileSet2 = new Image();
	dungeonTileSet2.src = "assets/tiles/0x72_DungeonTilesetII_v1.3.1/0x72_DungeonTilesetII_v1.3.png";
	let wizardIdle = new Image();
	wizardIdle.src = "assets/images/Wizard Pack/Idle.png";
	let wizardAttack = new Image();
	wizardAttack.src = "assets/images/Wizard Pack/Attack1.png";
	let wizardSpeechBubble = new Image();
	wizardSpeechBubble.src = "assets/images/Wizard Pack/wizard_speech_bubble.png";
	let wallMid = new Image();
	wallMid.src = 'assets/tiles/wall_mid.png';
	let wallCornerRight = new Image();
	wallCornerRight.src = 'assets/tiles/wall_corner_right.png';
	let wallTopMid = new Image();
	wallTopMid.src = 'assets/tiles/wall_top_mid.png';
	let mainCharIdle = new Image();
	mainCharIdle.src = 'assets/images/mainChar/spr_Idle_strip.png';
	let mainCharWalking = new Image();
	mainCharWalking.src = 'assets/images/mainChar/spr_Walk_strip.png';
	let mainCharAttacking = new Image();
	mainCharAttacking.src = 'assets/images/mainChar/spr_Attack_strip.png';
	let mainCharTaunting = new Image();
	mainCharTaunting.src = 'assets/images/mainChar/spr_Taunt_strip.png';
	let mainCharSpinAttacking = new Image();
	mainCharSpinAttacking.src = 'assets/images/mainChar/spr_SpinAttack_strip.png';

	// room minimal sizes - max sizes are define on load and on resize
	// [width, height, leftTopPointX, leftTopPointY]
	let middleRoomRectMinSize = [18, 9];
	let middleRoomRectMaxSize = [];
	let topRoomRectMinSize = [18, 9];
	let topRoomRectMaxSize = [];
	let bottomRoomRectMinSize = [18, 9];
	let bottomRoomRectMaxSize = [];
	let leftRoomRectMinSize = [9, 18];
	let leftRoomRectMaxSize = [];
	let rightRoomRectMinSize = [9, 18];
	let rightRoomRectMaxSize = [];

    window.onload = function()
	{
		let floorImages = [];
		let floor_1_img = new Image();
		floor_1_img.src = 'assets/tiles/floor_1.png';
		floorImages.push(floor_1_img);
		var floor_2_img = new Image();
		floor_2_img.src = 'assets/tiles/floor_2.png';
		floorImages.push(floor_2_img);
		var floor_3_img = new Image();
		floor_3_img.src = 'assets/tiles/floor_3.png';
		floorImages.push(floor_3_img);
		var floor_4_img = new Image();
		floor_4_img.src = 'assets/tiles/floor_4.png';
		floorImages.push(floor_4_img);
		var floor_5_img = new Image();
		floor_5_img.src = 'assets/tiles/floor_5.png';
		floorImages.push(floor_5_img);
		var floor_6_img = new Image();
		floor_6_img.src = 'assets/tiles/floor_6.png';
		floorImages.push(floor_6_img);
		var floor_7_img = new Image();
		floor_7_img.src = 'assets/tiles/floor_7.png';
		floorImages.push(floor_7_img);
		var floor_8_img = new Image();
		floor_8_img.src = 'assets/tiles/floor_8.png';
		floorImages.push(floor_8_img);

		// define max room sizes
		middleRoomRectMaxSize[0] = Math.ceil(window.innerWidth / 5 / 16);
		middleRoomRectMaxSize[1] = Math.ceil(middleRoomRectMaxSize[0] / 2 / 16);
		topRoomRectMaxSize[0] = Math.ceil(window.innerWidth / 5 / 16);
		topRoomRectMaxSize[1] = Math.ceil(topRoomRectMaxSize[0] / 2 / 16);
		bottomRoomRectMaxSize[0] = Math.ceil(window.innerWidth / 5 / 16);
		bottomRoomRectMaxSize[1] = Math.ceil(bottomRoomRectMaxSize[0] / 2 / 16);
		leftRoomRectMaxSize[0] = Math.ceil(window.innerWidth / 5 / 16);
		leftRoomRectMaxSize[1] = Math.ceil(leftRoomRectMaxSize[0] / 2 / 16);
		rightRoomRectMaxSize[0] = Math.ceil(window.innerWidth / 5 / 16);
		rightRoomRectMaxSize[1] = Math.ceil(rightRoomRectMaxSize[0] / 2 / 16);

		// loader background canvas
		loaderBackgroundCanvas = document.querySelector(".loaderBackgroundCanvas");
		loaderBackgroundCanvasContext = loaderBackgroundCanvas.getContext('2d');
		loaderBackgroundCanvas.width = window.innerWidth;
		loaderBackgroundCanvas.height = window.innerHeight;

		// loading overlay tiles
		floor_1_img.onload = function() {
			let pattern = loaderBackgroundCanvasContext.createPattern(floor_1_img, 'repeat');
			loaderBackgroundCanvasContext.fillStyle = pattern;
			loaderBackgroundCanvasContext.fillRect(0, 0, loaderBackgroundCanvas.width, loaderBackgroundCanvas.height);
		};

		//loader canvas
		loaderCanvas = document.querySelector(".loader");
		loaderContext = loaderCanvas.getContext('2d');
		loaderCanvas.width = window.innerWidth;
		loaderCanvas.height = window.innerHeight;

		//main game background canvas
		backgroundCanvas = document.querySelector("#tilemapBackground");
		backgroundCanvasContext = backgroundCanvas.getContext('2d');
		backgroundCanvas.width = window.innerWidth;
		backgroundCanvas.height = window.innerHeight;

		//main game canvas
		mainCanvas = document.querySelector("#tilemapMainGame");
		mainCanvasContext = mainCanvas.getContext('2d');
		mainCanvas.width = window.innerWidth;
		mainCanvas.height = window.innerHeight;

		//create array with the floorset
		let columns = Math.ceil(window.innerWidth/16);
		let rows = Math.ceil(window.innerHeight/16);
		let tilemapMatrix = [];
		middleRoomRectMinSize[2] = Math.ceil(columns / 2 - middleRoomRectMinSize[0] / 2);
		middleRoomRectMinSize[3] = Math.ceil(rows / 2 - middleRoomRectMinSize[1] / 2);

		floorImages[floorImages.length-1].onload = function() {
			for(i=0; i < rows; i++) {
				tilemapMatrix[i] = [];
				for(j=0; j < columns; j++) {
					let randomNum = Math.random();
					// wall from left to right
					if (i == 7 && (j == 0 || j == 1 || j == 2 || j == 3 || j == 4)) {
						tilemapMatrix[i].push(wallMid);
						drawBackgroundOnImagesLoad(backgroundCanvasContext, wallMid, i, j);
						drawBackgroundOnImagesLoad(backgroundCanvasContext, wallTopMid, i-1, j);
					} // wall from top to bottom
					else if (j == 4 && (i == 0 || i == 1 || i == 2 || i == 3 || i == 4 || i == 5 || i == 6 || i == 7)) {
						tilemapMatrix[i].push(wallCornerRight);
						drawBackgroundOnImagesLoad(backgroundCanvasContext, wallCornerRight, i, j);
					} // draw the rooms
					else if ((j >= middleRoomRectMinSize[2] && j <= middleRoomRectMinSize[2] + middleRoomRectMinSize[0] && i == middleRoomRectMinSize[3])
						|| (i >= middleRoomRectMinSize[3] && i <= middleRoomRectMinSize[3] + middleRoomRectMinSize[1] && j == middleRoomRectMinSize[2])
						|| (j >= middleRoomRectMinSize[2] && j <= middleRoomRectMinSize[2] + middleRoomRectMinSize[0] && i == middleRoomRectMinSize[3] + middleRoomRectMinSize[1])
						|| (i >= middleRoomRectMinSize[3] && i <= middleRoomRectMinSize[3] + middleRoomRectMinSize[1] && j == middleRoomRectMinSize[2] + middleRoomRectMinSize[0])) {
						// middle/start room
						tilemapMatrix[i].push(wallMid);
						drawBackgroundOnImagesLoad(backgroundCanvasContext, wallMid, i, j);
						drawBackgroundOnImagesLoad(backgroundCanvasContext, wallTopMid, i - 1, j);
					} else {
						if (randomNum <= 0.9 && randomNum >= 0) {
							tilemapMatrix[i].push(floorImages[0]);
							drawBackgroundOnImagesLoad(backgroundCanvasContext, floorImages[0], i, j);
						} else {
							let randomTile = Math.floor(Math.random() * Math.floor(6) + 1);
							tilemapMatrix[i].push(floorImages[randomTile]);
							drawBackgroundOnImagesLoad(backgroundCanvasContext, floorImages[randomTile], i, j);
						}
					}
				}
			}
		}		

		idleMonster = new GameObject(dungeonTileSet2, 16, 364, 4*32, 36, 90, 4);

		mainCharacter = new GameObject(mainCharIdle, 0, 0, 2720, 96, 50, 16);

		wizardIdleAnim = new GameObject(wizardIdle, 0, 0, 1386, 190, 90, 6, 1, mainCanvas.height-190);

		wizardAttackAnim = new GameObject(wizardAttack, 0, 0, 1848, 190, 90, 8, 1, mainCanvas.height - 190);

		animateLoadWriting();
		loaderLoop();

		// EVENTS
		//Menu click
		document.querySelector(".swordBurgerMenu").addEventListener("click", function () {
			this.classList.toggle('open');
			document.querySelector(".navigation").classList.toggle('open');
			document.querySelector(".settings").classList.remove('open');
			document.querySelector(".gearSettings").classList.remove('open');
		});
		//Settings click
		document.querySelector(".gearSettings").addEventListener("click", function () {
			this.classList.toggle('open');
			document.querySelector(".settings").classList.toggle('open');
			document.querySelector(".navigation").classList.remove('open');
			document.querySelector(".swordBurgerMenu").classList.remove('open');
		});
		document.querySelector("#tilemapMainGame").addEventListener("click", function (event) {
			if(pointIsInClickableRectangle(wizardIdleAnim, event)) {
				wizardIdleAnimRun = false;
				wizardAttackAnimRun = true;
			}
		});
		// keybinding
		document.onkeydown = function (e) {
			switch (e.which) {
				case 37: // left
					walkAnimationRun = true;
					mainCharacter = new GameObject(mainCharWalking, 0, 0, 1360, 96, 50, 8, mainCharacter.canvasCoordinateX - 16, mainCharacter.canvasCoordinateY);
					break;

				case 38: // up
					walkAnimationRun = true;
					mainCharacter = new GameObject(mainCharWalking, 0, 0, 1360, 96, 50, 8, mainCharacter.canvasCoordinateX, mainCharacter.canvasCoordinateY - 16);
					break;

				case 39: // right
					walkAnimationRun = true;
					mainCharacter = new GameObject(mainCharWalking, 0, 0, 1360, 96, 50, 8, mainCharacter.canvasCoordinateX + 16, mainCharacter.canvasCoordinateY);
					break;

				case 40: // down
					walkAnimationRun = true;
					mainCharacter = new GameObject(mainCharWalking, 0, 0, 1360, 96, 50, 8, mainCharacter.canvasCoordinateX, mainCharacter.canvasCoordinateY + 16);
					break;

				case 65: // a - attack
					attackAnimationRun = true;
					mainCharacter = new GameObject(mainCharAttacking, 0, 0, 5100, 96, 50, 30, mainCharacter.canvasCoordinateX, mainCharacter.canvasCoordinateY);
					break;

				case 84: // t - taunt
					tauntAnimationRun = true;
					mainCharacter = new GameObject(mainCharTaunting, 0, 0, 3060, 96, 50, 18, mainCharacter.canvasCoordinateX, mainCharacter.canvasCoordinateY);
					break;

				case 83: // t - taunt
					spinAttackAnimationRun = true;
					mainCharacter = new GameObject(mainCharSpinAttacking, 0, 0, 5100, 96, 50, 30, mainCharacter.canvasCoordinateX, mainCharacter.canvasCoordinateY);
					break;

				default: return; // exit this handler for other keys
			}
			e.preventDefault();
		};
	};

	// Main Game Loop
	function mainLoop() {
		mainUpdate();
		mainDraw();

		if (wizardIdleAnimRun) {
			mainCanvasContext.drawImage(wizardSpeechBubble, 0, 0, 1071, 234, 20, mainCanvas.height - 190, 300, 50);
		}

		requestAnimationFrame(mainLoop);
	}
	function mainUpdate(){
		//main char
		mainCharacter.update();

		//wizard
		if (wizardIdleAnimRun){
			wizardIdleAnim.update();
		}
		if (wizardAttackAnimRun) {
			wizardAttackAnim.update();
		}
		
	}
	function mainDraw() {
		//main char
		mainCanvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		mainCharacter.draw(mainCanvasContext);
		//attack animation only once
		if (attackAnimationRun) {
			if (mainCharacter.frameIndex === 29) {
				attackAnimationRun = false;
				mainCharacter = new GameObject(mainCharIdle, 0, 0, 2720, 96, 50, 16, mainCharacter.canvasCoordinateX, mainCharacter.canvasCoordinateY);
			}
		}

		//walk animation only once
		if (walkAnimationRun) {
			if (mainCharacter.frameIndex === 7) {
				walkAnimationRun = false;
				mainCharacter = new GameObject(mainCharIdle, 0, 0, 2720, 96, 50, 16, mainCharacter.canvasCoordinateX, mainCharacter.canvasCoordinateY);
			}
		}

		//taunt animation only once
		if (tauntAnimationRun) {
			if (mainCharacter.frameIndex === 17) {
				tauntAnimationRun = false;
				mainCharacter = new GameObject(mainCharIdle, 0, 0, 2720, 96, 50, 16, mainCharacter.canvasCoordinateX, mainCharacter.canvasCoordinateY);
			}
		}

		//spin attack animation only once
		if (spinAttackAnimationRun) {
			if (mainCharacter.frameIndex === 29) {
				spinAttackAnimationRun = false;
				mainCharacter = new GameObject(mainCharIdle, 0, 0, 2720, 96, 50, 16, mainCharacter.canvasCoordinateX+32, mainCharacter.canvasCoordinateY);
			}
		}

		//wizard
		if (wizardIdleAnimRun) {
			wizardIdleAnim.draw(mainCanvasContext);
		}
		
		if (wizardAttackAnimRun) {
			wizardAttackAnim.draw(mainCanvasContext);
			if (wizardAttackAnim.frameIndex === 7) {
				wizardAttackAnimRun = false;
				window.location.href = '/index_classic.html';
			}
		}
	}

	//The Loader Loop
	function loaderLoop() {
		updateLoader();
		drawLoader();
		setTimeout(function () {
			runLoader = false;
		}, 2500);

		if (runLoader === true) {
			requestAnimationFrame(loaderLoop);
		} else {
			loaderCanvas.classList.add("fadeOut");
			loaderBackgroundCanvas.classList.add("fadeOut");
			
			mainLoop();
		}
	}
	function drawBackgroundOnImagesLoad(backgroundCanvasContext, floorImage, i, j) {
		backgroundCanvasContext.drawImage(floorImage, 0, 0, 16, 16, 16 * j, 16 * i, 16, 16);
	}
	let counter = 0;
	function animateLoadWriting() {
		let loadingWriting = document.querySelector(".loadWriting");
		let loaderWritingLetters = document.getElementsByClassName("letter");
		let loaderWritingChildCount = loadingWriting.childElementCount;

		setTimeout(function () {
			loaderWritingLetters[counter].classList.add("fadeInZoom");

			counter++;
			if (counter < loaderWritingChildCount) {
				animateLoadWriting();
			} else {
				setTimeout(function () {
					// Code, der erst nach 2 Sekunden ausgeführt wird
					loadingWriting.classList.add("fadeOut");
				}, 1200);
			}
		}, 2500 / (loaderWritingChildCount + 6));

	}

	//update function to update all the GameObjects
	function updateLoader() {
		idleMonster.update();
	}

	//draw method for drawing everything on loaderCanvas
	function drawLoader() {
		loaderContext.clearRect(0,0,loaderCanvas.width, loaderCanvas.height);
		idleMonster.draw(loaderContext);
	}

	//GameObject constructor
	function GameObject(spritesheet, x, y, width, height, timePerFrame, numberOfFrames, canvasCoordinateX = 0, canvasCoordinateY = 0) {
		this.spritesheet = spritesheet;             //the spritesheet image
		this.x = x;                                 //the x coordinate of the object
		this.y = y;                                 //the y coordinate of the object
		this.width = width;                         //width of spritesheet
		this.height = height;                       //height of spritesheet
		this.timePerFrame = timePerFrame;           //time in(ms) given to each frame
		this.numberOfFrames = numberOfFrames || 1;  //number of frames(sprites) in the spritesheet, default 1
		this.canvasCoordinateX = canvasCoordinateX;
		this.canvasCoordinateY = canvasCoordinateY;


		if(this.canvasCoordinateX === 0) {
			this.canvasCoordinateX = Math.round(loaderCanvas.width / 2 - this.width / this.numberOfFrames / 2);
		}

		if (canvasCoordinateY === 0) {
			this.canvasCoordinateY = Math.round(loaderCanvas.height / 2 - this.height / 2);
		}

		//current frame index pointer
		this.frameIndex = 0;

		//time the frame index was last updated
		this.lastUpdate = Date.now();

		//to update
		this.update = function() {
			if(Date.now() - this.lastUpdate >= this.timePerFrame) {
				this.frameIndex++;
				if(this.frameIndex >= this.numberOfFrames) {
					this.frameIndex = 0;
				}
				this.lastUpdate = Date.now();
			}
		}

		//to draw on the loaderCanvas, parameter is the context of the loaderCanvas to be drawn on
		this.draw = function(context) {
			context.drawImage(this.spritesheet,
							this.frameIndex*this.width/this.numberOfFrames + x,
							y,
							this.width/this.numberOfFrames,
							this.height,
							this.canvasCoordinateX,
							this.canvasCoordinateY,
							this.width/this.numberOfFrames,
							this.height);
		}
	}

	//check if point is in rectangle for click event
	function pointIsInClickableRectangle(clickableFigure, eventObject) {
		let width = clickableFigure.width / clickableFigure.numberOfFrames;
		let height = clickableFigure.height;
		let centerPoint = [];
		centerPoint["x"] = clickableFigure.canvasCoordinateX + width / 2;
		centerPoint["y"] = clickableFigure.canvasCoordinateY + height / 2;

		if (eventObject.clientX > centerPoint["x"] - width &&
			eventObject.clientX < centerPoint["x"] + width &&
			eventObject.clientY > centerPoint["y"] - height &&
			eventObject.clientY < centerPoint["y"] + height) {
				//console.log('click in object');
				return true;
		} else {
			return false;
		}
	}
})();