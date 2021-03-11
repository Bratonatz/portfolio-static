(function() {
	let idleMonster;
	let dungeonTileSet2 = new Image();
	dungeonTileSet2.src = "assets/tiles/0x72_DungeonTilesetII_v1.3.1/0x72_DungeonTilesetII_v1.3.png";
	let loaderContext;
	let loaderCanvas;
	let loaderBackgroundCanvas;
	let loaderBackgroundCanvasContext;
	let runLoader = true;
	
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

		//loader background canvas
		loaderBackgroundCanvas = document.querySelector(".loaderBackgroundCanvas");
		loaderBackgroundCanvasContext = loaderBackgroundCanvas.getContext('2d');
		loaderBackgroundCanvas.width = window.innerWidth;
		loaderBackgroundCanvas.height = window.innerHeight;

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

		floorImages[floorImages.length-1].onload = function() {
			for(i=0; i < rows; i++) {
				tilemapMatrix[i] = [];
				for(j=0; j < columns; j++) {
					let randomNum = Math.random();
					if(randomNum <= 0.9 && randomNum >= 0) {
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

		idleMonster = new GameObject(dungeonTileSet2, 16, 364, 4*32, 36, 90, 4);

		mainCharacter = new GameObject(dungeonTileSet2, 128, 100, 4 * 16, 28, 90, 4, Math.ceil(columns/2*16), Math.ceil(rows/16*16));

		animateLoadWriting();
		loaderLoop();

		// EVENTS
		document.querySelector(".swordBurgerMenu").addEventListener("click", function () {
			this.classList.toggle('open');
			document.querySelector(".navigation").classList.toggle('open');
			document.querySelector(".settings").classList.remove('open');
			document.querySelector(".gearSettings").classList.remove('open');
		}); 
		document.querySelector(".gearSettings").addEventListener("click", function () {
			this.classList.toggle('open');
			document.querySelector(".settings").classList.toggle('open');
			document.querySelector(".navigation").classList.remove('open');
			document.querySelector(".swordBurgerMenu").classList.remove('open');
		}); 
	};

	function drawBackgroundOnImagesLoad(backgroundCanvasContext, floorImage, i, j) {
		backgroundCanvasContext.drawImage(floorImage,0,0,16,16,16*j,16*i,16,16);
	}

	// Main Game Loop
	function mainCharIdleLoop() {
		mainCharIdleUpdate();
		mainCharIdleDraw();
		requestAnimationFrame(mainCharIdleLoop);
	}
	function mainCharIdleUpdate(){
		mainCharacter.update();
	}
	function mainCharIdleDraw() {
		mainCanvasContext.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
		mainCharacter.draw(mainCanvasContext);
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
			mainCharIdleLoop();
		}
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

		if(canvasCoordinateX === 0) {
			canvasCoordinateX = Math.round(loaderCanvas.width / 2 - this.width / this.numberOfFrames);
		}

		if (canvasCoordinateY === 0) {
			canvasCoordinateY = Math.round(loaderCanvas.height / 2 - this.height);
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
							canvasCoordinateX,
							canvasCoordinateY,
							this.width/this.numberOfFrames,
							this.height);
		}
	}
})();