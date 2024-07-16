class UIImplementation {
	element;
	context;
	canvas;

	pauseCanvasElement;
	pauseContext;
	pauseCanvas;
	pauseButton;

	dialogueImages = [];
	flag_dialogueEnabled = false;

	animationBlocked = true;
	animationInterval1;
	animationState1 = false;
	animationInterval2;
	animationState2 = false;

	timeBegin;
	timePlaying;
	timeInPauseMenu;
	timerInterval;

	settings;
	info;
	achievements;

	moneyLimit = 2500; //no minigames allowed above 2500 (prevent stacking)

	beginTimer() {
		this.timeBegin = Date.now();
		this.timePlaying = 0;
		this.timeInPauseMenu = 0;
		this.timerInterval = window.setInterval(() => {
			if(this.info.paused) {
				return;
			};
			this.timePlaying = Math.trunc(((Date.now() - this.timeBegin) - this.timeInPauseMenu)/1000);
		}, 900)
	}
	endTimer() {
		window.clearInterval(this.timerInterval);
	}

	addMoney() {
		this.info.money += amount;
	}
	removeMoney() {
		this.info.money -= amount;
	}

	getEarlyLeaveTimeMoney(time) {
		//100 gold + 100 per minute +  difficulty adjustment
		return 100+Math.trunc((Math.trunc(time/30)*this.settings.diff_multiplier*50));
	}

	async checkMoney() {
		//check for debt limit, money limit
		if(this.info.money <= this.settings.debt_limit) {
			await gameOver(getTranslation(40));
		}
	}

	pauseMenuToggle() {
		if(this.info.paused) {
			showAllInput();
			musicUnpause();
			console.log("Pause menu disabled!");
			this.info.paused = false;
			document.querySelectorAll(".pause_button").forEach((val) => {
				val.style.setProperty("display", "none");
			});
			this.pauseCanvasElement.style.setProperty("display", "none");
		}
		else {
			hideAllInput();
			musicPause();
			console.log("Pause menu enabled!");
			this.info.paused = true;
			document.querySelectorAll(".pause_button").forEach((val) => {
				val.style.setProperty("display", "inline");
			});
			this.pauseCanvasElement.style.setProperty("display", "inline");
		}
	}

	disablePauseButton() {
		this.pauseButton.style.setProperty("display", "none");
	}
	enablePauseButton() {
		this.pauseButton.style.setProperty("display", "block");
	}

	renderPauseWidget() {
		let temp = this.canvas.ctx.fillStyle;

		this.canvas.setFontWeight("normal").setColor("#ffffff");
		this.canvas.drawCircleBox(0, 0, 20, 10).imageSamesizeY((this.animationState1 == true) ? this.pause2 : this.pause1, 1, 0, 10);
		this.canvas.setColor(this.animationState1 ? "#00aaaa" : "#000080").setSmallFontSize();
		this.canvas.textS(getTranslation(10), 8, 7);

		this.canvas.ctx.fillStyle = temp;
	}
	async renderMoneyWidget() {
		await this.checkMoney(); //async: if fails check (game over) - stop the rendering cycle

		this.canvas.setFontWeight("normal").setColor("#ffffff");
		this.canvas.drawCircleBox(80, 0, 20, 10);
		if(this.info.money < 0) {
			this.canvas.setColor("#800000");
		}
		else if(this.info.money > this.info.currentTicketPrice) {
			this.canvas.setColor("#008000");
		}
		else {
			this.canvas.setColor("#000080");
		}
		this.canvas.setSmallFontSize();
		this.canvas.textS(getTranslation(51)+": "+String(this.info.money), 83, 7);
	}
	renderSpeedrunWidget() {
		this.canvas.setColor("#ffffff");
		this.canvas.drawRoundedBox( 0, 0, 15, 20, 10);
		this.canvas.setColor("#000080").setSmallFontSize();
		this.canvas.textS(getTranslation(3), 2, 7).textS(this.timePlaying+"s", 2, 17);
	}

	renderWidgets() {
		if(this.info.speedrun) {
			this.renderSpeedrunWidget();
		}
		else {
			this.renderPauseWidget();
		}
		this.renderMoneyWidget();
	}

	constructor() {
		this.element = document.getElementById("uicanvas");
		this.context = this.element.getContext("2d");

		this.canvas = new CanvasImplementation(this.element, this.context);

		//
		// FIELDS
		//

		this.settings = {
			//easy - 0, medium - 1, hard - 2
			difficulty: 1,
			//easy - 0.80, medium - 1, hard - 1.2: use for money
			diff_multiplier: 1,
			//easy - 10000, medium - 5000, hard - 1000
			random_loss_chance: 5000,
			//easy: -1000, medium: -500, hard: -100
			debt_limit: -500,
			//volume of music
			volume: 0.7,
			//music and sfx
			music_enabled: false,
			//voiceover enabled
			voice_enabled: false,
		};

		this.info = {
			money: 0,
			location_major: 0,
			location_minor: 0,
			location_minor_next: 0,
			speedrun: false,
			currentTicketPrice: 0,
			paused: false,
			pausedTime: 0,
		};

		this.achievements = {
			propast: false,
			speedrun: false,
		};

		//
		// ANIMATIONS
		//

		this.animationInterval1 = window.setInterval((instance) => {
			if(instance.animationBlocked) return;
			instance.animationState1 = !instance.animationState1;
			instance.renderWidgets();
		}, 700, this);
		this.animationInterval2 = window.setInterval((instance) => {
			if(instance.animationBlocked) return;
			instance.animationState2 = !instance.animationState2;

		}, 900, this);

		//
		// PAUSE
		//

		this.pauseButton = internal_setButton("pausebutton", "", "draw_input_elem_pause", 0, 0, canvas.getX(20), canvas.getY(10), () => {
			this.pauseMenuToggle();
		});
		this.disablePauseButton();

		//setup pause element

		this.pauseCanvasElement = document.getElementById("pausecanvas");

		this.pauseCanvasElement.style.setProperty("top", this.canvas.canvas.height*0.1+"px");
		this.pauseCanvasElement.style.setProperty("left", this.canvas.canvas.width*0.1+"px");
		this.pauseCanvasElement.width = this.canvas.canvas.width*0.8;
		this.pauseCanvasElement.height = this.canvas.canvas.height*0.8;
		this.pauseCanvasElement.style.setProperty("width", this.pauseCanvasElement.width+"px");
		this.pauseCanvasElement.style.setProperty("height", this.pauseCanvasElement.height+"px");
		this.pauseContext = this.pauseCanvasElement.getContext("2d");
		this.pauseContext.width = this.pauseCanvasElement.width;
		this.pauseContext.height = this.pauseCanvasElement.height;
		this.pauseContext.lineWidth = 1;

		this.pauseCanvas = new CanvasImplementation(this.pauseCanvasElement, this.pauseContext);

		//setup bg
		this.pauseCanvas.setColor("#aaaaaa").drawRoundedBox(0, 0, 100, 100, 40).setColor("#000080");
		this.pauseCanvas.setLargeFontSize().setFontWeight("bold").textS(getTranslation(10), 10, 20);
		this.pauseCanvas.setSmallFontSize().setFontWeight("normal").textS(getTranslation(28), 10, 27);

		//add buttons

		//buttons:
		//load game, save game, toggle audio, quit game

		//also add title offset
		const CanvasOffsetX = parseInt(this.pauseCanvas.canvas.style.getPropertyValue("left"))+this.pauseCanvas.getX(10);
		const CanvasOffsetY = parseInt(this.pauseCanvas.canvas.style.getPropertyValue("top"))+this.pauseCanvas.getY(30);
		const ButtonSizeX = this.pauseCanvas.getX(40);
		const ButtonSizeY = this.pauseCanvas.getY(30);

		let Buttons = [];
		Buttons.push(internal_setButton("pause_loadgame", getTranslation(4), "pause_button draw_input_elem",
										CanvasOffsetX, CanvasOffsetY, ButtonSizeX, ButtonSizeY, () => {})
		);
		Buttons.push(internal_setButton("pause_savegame", getTranslation(11), "pause_button draw_input_elem",
										CanvasOffsetX+ButtonSizeX, CanvasOffsetY, ButtonSizeX, ButtonSizeY, () => {})
		);
		Buttons.push(internal_setButton("pause_quitgame", getTranslation(12), "pause_button draw_input_elem",
										CanvasOffsetX, CanvasOffsetY+ButtonSizeY, ButtonSizeX, ButtonSizeY, () => {})
		);
		Buttons.push(internal_setButton("pause_audio", getTranslation(8), "pause_button draw_input_elem",
										CanvasOffsetX+ButtonSizeX, CanvasOffsetY+ButtonSizeY, ButtonSizeX, ButtonSizeY, () => {})
		);

		//add elements
		this.pauseCanvas.canvas.style.setProperty("display", "none");
		this.canvas.canvas.parentElement.appendChild(this.pauseCanvasElement);
		for(let i = 0; i < 4; i++) {
			Buttons[i].style.setProperty("display", "none");
			this.canvas.canvas.parentElement.appendChild(Buttons[i]);
		}

		this.pauseContext = this.pauseCanvasElement.getContext("2d");

		window.addEventListener("keydown", (e) => {
			if(e.code === "Escape") {
				this.pauseMenuToggle();
			}
		});
	}

	async load() {
		this.pause1 = await loadImage("assets/arrow/pause.png");
		this.pause2 = await loadImage("assets/arrow/pause2.png");
	}
}
