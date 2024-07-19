function ArrowInfo(x, y, type, fn) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.fn = fn;
}

function SavedArrowInfo(id, x, y, type, fn) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.type = type;
	this.fn = fn;
}

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

	arrowImages = [];
	arrowImages2 = []; //second stage of animation
	arrowList = [];
	percentArrowSize = 10;
	arrowSize;
	arrowAnimationInterval;
	arrowAnimationState = false;
	arrowAnimationBlocked = false;

	timeBegin;
	timePlaying;
	timeInPauseMenu;
	timerInterval;

	animationBlocked = true;
	UIanimationInterval;
	UIanimationState = false;
	UIanimationBlocked = true;

	settings;
	info;
	achievements;

	moneyLimit = 2500; //no minigames allowed above 2500 (prevent stacking)

	arrowType = {
		LEFT: 0,
		RIGHT: 1,
		UP: 2,
		DOWN: 3,
		INFO: 4
	}

	makeButton(id, text, classname, x, y, sizex, sizey, fn) {
		let btn = document.createElement("button");
		btn.id = id;
		btn.innerHTML = text;
		btn.className = classname;
		btn.style.setProperty("width", sizex+"px");
		btn.style.setProperty("height", sizey+"px");
		btn.style.setProperty("left", x+"px");
		btn.style.setProperty("top", y+"px");
		btn.addEventListener("click", fn);
		btn.addEventListener("click", () => {
			if(this.settings.music_enabled) { sfxPlay(0); }
		})
		document.getElementById("draw_contain").appendChild(btn);
		return btn;
	}

	addButton(id, text, x, y, sizex, sizey, fn) {
		return this.makeButton(id, text, "draw_input_elem", canvas.getX(x), canvas.getY(y), canvas.getX(sizex), canvas.getY(sizey), fn);
	}
	addSmallButton(id, text, x, y, sizex, sizey, fn) {
		return this.makeButton(id, text, "draw_input_elem_small", canvas.getX(x), canvas.getY(y), canvas.getX(sizex), canvas.getY(sizey), fn);
	}
	addVerySmallButton(id, text, x, y, sizex, sizey, fn) {
		return this.makeButton(id, text, "draw_input_elem_vsmall", canvas.getX(x), canvas.getY(y), canvas.getX(sizex), canvas.getY(sizey), fn);
	}
	removeButton(id) {
		document.getElementById(id).remove();
	}
	removeButtons(idarray) {
		idarray.forEach((val) => {
			document.getElementById(val).remove();
		})
	}
	showButton(id) {
		document.getElementById(id).style.setProperty("display", "block");
	}
	hideButton(id) {
		document.getElementById(id).style.setProperty("display", "none");
	}

	addArrow(id, x, y, type, fn, override_self_destruct = undefined) {
		this.canvas.ctx.drawImage(
			this.arrowImages[type],
			this.canvas.getX(x) - (this.arrowSize/2*this.canvas.getScaleX()),
			this.canvas.getY(y) - (this.arrowSize/2*this.canvas.getScaleY()),
			this.arrowSize*this.canvas.getScaleX(),
			this.arrowSize*this.canvas.getScaleX()
		);
		this.arrowList.push(new SavedArrowInfo(id, x, y, type, fn));

		let element = ui.makeButton(
			id, "", "draw_input_elem_arrow", this.canvas.getX(x) - (this.arrowSize/2*this.canvas.getScaleX()), this.canvas.getY(y) - (this.arrowSize/2*this.canvas.getScaleY()),
			this.arrowSize*this.canvas.getScaleX(), this.arrowSize*this.canvas.getScaleX(), fn
		);

		if(!override_self_destruct) {
			element.addEventListener("click", (event) => {
				this.removeArrow(event.target.id);
			});
		}

		return element;
	}
	removeArrow(id) {
		this.removeButton(id);
		for(let i = 0; i < this.arrowList.length; i++) {
			if(this.arrowList[i].id == id) {
				this.canvas.eraseBox(
					this.arrowList[i].x - (this.percentArrowSize/2),
					this.arrowList[i].y - this.canvas.convertXtoY(this.percentArrowSize/2),
					this.percentArrowSize, this.canvas.convertXtoY(this.percentArrowSize)
				);
				this.arrowList.splice(i, 1);
				console.log("Removed arrow no.", i);
			}
		}
	}
	clearArrows() {
		document.getElementById("draw_contain").querySelectorAll(".draw_input_elem_arrow").forEach((val) => {
			val.remove();
		});
		this.arrowList.length = 0;
		this.canvas.eraseCanvas();
		this.renderWidgets();
	}

	//takes in 1 ArrowInfo
	makeArrow(arrow) {
		let randomValue = String(Math.trunc(Math.random()*10000));
		return waiterEventFromElement(this.addArrow("renderArrow"+randomValue, arrow.x, arrow.y, arrow.type, () => { arrow.fn.call(); }), "click");
	}
	//takes in array of ArrowInfos
	makeArrows(arrows) {
		let tempPromises = [];
		for(let i = 0; i < arrows.length; i++) {
			tempPromises.push(waiterEventFromElement(this.addArrow("renderArrows"+String(i), arrows[i].x, arrows[i].y, arrows[i].type, () => { arrows[i].fn.call(); }), "click"));
		}
		return Promise.any(tempPromises);
	}

	getAllInput() {
		return document.getElementById("draw_contain")
		.querySelectorAll(
			".draw_input_elem, .draw_input_elem_arrow, .draw_input_elem_small, .draw_input_elem_vsmall, .draw_input_elem_npc"
		);	 //no pause, it does not get deleted!
	}
	hideAllInput() {
		this.getAllInput().forEach((val) => {
			val.style.setProperty("display", "none");
		});
	}
	showAllInput() {
		this.getAllInput().forEach((val) => {
			val.style.setProperty("display", "block");
		});
	}

	async dialogueLine(idOfText) {
		if(this.info.speedrun) return new Promise((resolve) => { resolve(); });

		this.disableWidgets();
		console.log("Dialogue line");

		this.canvas.setColor("#ffffff").drawRoundedBox( 0, 80, 100, 20, 10);

		this.canvas.setSmallFontSize().setFontWeight("normal").setColor("#000000");
		await this.canvas.typewriterM(wrapText(getTranslationAndVoice(idOfText), 90), 5, 85);

		await this.makeArrow(new ArrowInfo(92, 92, this.arrowType.RIGHT, () => {}));

		this.canvas.eraseBox(0, 80, 100, 20);
		this.enableWidgets();
	}
	//returns true for yes and false for no
	async dialogueChoice() {
		if(this.info.speedrun) return true;

		this.disableWidgets();
		console.log("Dialogue choice");

		this.canvas.setColor("#ffffff").drawRoundedBox(0, 80, 100, 20, 10);

		//first draw then animate
		this.canvas.imageSamesizeY(this.dialogueImages[0], 20, 82, 18);
		this.canvas.imageSamesizeY(this.dialogueImages[2], 60, 82, 18);

		let YesPromise = waiterEventFromElement(ui.makeButton(
			"YesChoice", "", "draw_input_elem_arrow",
			this.canvas.getX(20), this.canvas.getY(80),
			this.canvas.getY(20), this.canvas.getY(20),
			() => {}
		), "click", true);
		let NoPromise = waiterEventFromElement(ui.makeButton(
			"NoChoice", "", "draw_input_elem_arrow",
			this.canvas.getX(60), this.canvas.getY(80),
			this.canvas.getY(20), this.canvas.getY(20),
			() => {}
		), "click", false);


		let dialogueAnimationState = false;
		let choiceInterval = window.setInterval(() => {
			if(dialogueAnimationState) {
				this.canvas.imageSamesizeY(this.dialogueImages[0], 20, 82, 18);
				this.canvas.imageSamesizeY(this.dialogueImages[2], 60, 82, 18);
			}
			else {
				this.canvas.imageSamesizeY(this.dialogueImages[1], 20, 82, 18);
				this.canvas.imageSamesizeY(this.dialogueImages[3], 60, 82, 18);
			}
			dialogueAnimationState = !dialogueAnimationState;
		}, 700, dialogueAnimationState);

		let returnValue = await Promise.any([YesPromise, NoPromise]);

		window.clearInterval(choiceInterval);
		this.removeButtons(["YesChoice", "NoChoice"]);
		this.canvas.eraseBox(0, 80, 100, 20);
		this.enableWidgets();

		return returnValue;
	}

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
		if(this.info.speedrun) return;

		if(this.info.paused) {
			this.showAllInput();
			musicUnpause();
			console.log("Pause menu disabled!");
			this.info.paused = false;
			document.querySelectorAll(".pause_button").forEach((val) => {
				val.style.setProperty("display", "none");
			});
			this.pauseCanvasElement.style.setProperty("display", "none");
		}
		else {
			this.hideAllInput();
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
		this.canvas.eraseBox(0, 0, 20, 10);
		this.pauseButton.style.setProperty("display", "none");
	}
	enablePauseButton() {
		this.pauseButton.style.setProperty("display", "block");
	}

	renderPauseWidget() {
		let temp = this.canvas.ctx.fillStyle;

		this.canvas.setFontWeight("normal").setColor("#ffffff");
		this.canvas.drawCircleBox(0, 0, 20, 10).imageSamesizeY((this.UIanimationState == true) ? this.pause2 : this.pause1, 1, 0, 10);
		this.canvas.setColor(this.UIanimationState ? "#00aaaa" : "#000080").setSmallFontSize();
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
		this.canvas.setColor((this.UIanimationState == true) ? "#00aaaa" : "#000080").setSmallFontSize();
		this.canvas.textS(getTranslation(3), 2, 7).textS(this.timePlaying+"s", 2, 17);
	}

	renderWidgets() {
		if(this.UIanimationBlocked) return;

		if(this.info.speedrun) {
			this.renderSpeedrunWidget();
		}
		else {
			this.renderPauseWidget();
		}
		this.renderMoneyWidget();
	}

	enableWidgets() {
		this.renderWidgets();
		this.enablePauseButton();
		this.UIanimationBlocked = false;
	}
	disableWidgets() {
		this.canvas.eraseCanvas();
		this.disablePauseButton();
		this.UIanimationBlocked = true;
	}

	constructor() {
		this.element = document.getElementById("uicanvas");
		this.element.width = 1000;
		this.element.height = 500;
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

		this.arrowSize = this.canvas.getX(this.percentArrowSize);

		//
		// ANIMATIONS
		//

		this.UIanimationInterval = window.setInterval((instance) => {
			if(instance.UIanimationBlocked) return;
			instance.UIanimationState = !instance.UIanimationState;

			instance.renderWidgets();
		}, 700, this);

		this.arrowAnimationInterval = window.setInterval((instance) => {
			if(instance.arrowAnimationBlocked) return;
			//this interval always works - remove buttons to disable them
			instance.arrowAnimationState = !instance.arrowAnimationState;

			for(let i = 0; i < instance.arrowList.length; i++) {
				if(document.getElementById(instance.arrowList[i].id).style.getPropertyValue("display") === "none") continue;

				instance.canvas.ctx.drawImage(
					(instance.arrowAnimationState == false) ? instance.arrowImages2[instance.arrowList[i].type] : instance.arrowImages[instance.arrowList[i].type],
					instance.canvas.getX(instance.arrowList[i].x) - (instance.arrowSize/2*canvas.getScaleX()),
					instance.canvas.getY(instance.arrowList[i].y) - (instance.arrowSize/2*canvas.getScaleY()),
					instance.arrowSize*instance.canvas.getScaleX(), instance.arrowSize*instance.canvas.getScaleX()
				);
			}
		}, 700, this);

		//
		// PAUSE
		//

		this.pauseButton = this.makeButton("pausebutton", "", "draw_input_elem_pause", 0, 0, canvas.getX(20), canvas.getY(10), () => {
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
		this.pauseCanvas.setColor("#aaaaaa").drawRoundedBox(0, 0, 100, 100, 40);

		//add buttons

		//buttons:
		//load game, save game, toggle audio, quit game

		//also add title offset
		const CanvasOffsetX = parseInt(this.pauseCanvas.canvas.style.getPropertyValue("left"))+this.pauseCanvas.getX(10);
		const CanvasOffsetY = parseInt(this.pauseCanvas.canvas.style.getPropertyValue("top"))+this.pauseCanvas.getY(30);
		const ButtonSizeX = this.pauseCanvas.getX(40);
		const ButtonSizeY = this.pauseCanvas.getY(30);

		let Buttons = [];
		Buttons.push(this.makeButton("pause_loadgame", "", "pause_button",
										CanvasOffsetX, CanvasOffsetY, ButtonSizeX, ButtonSizeY, () => {})
		);
		Buttons.push(this.makeButton("pause_savegame", "", "pause_button",
										CanvasOffsetX+ButtonSizeX, CanvasOffsetY, ButtonSizeX, ButtonSizeY, () => {})
		);
		Buttons.push(this.makeButton("pause_quitgame", "", "pause_button",
										CanvasOffsetX, CanvasOffsetY+ButtonSizeY, ButtonSizeX, ButtonSizeY, () => { window.location.reload(); })
		);
		Buttons.push(this.makeButton("pause_audio", "", "pause_button",
										CanvasOffsetX+ButtonSizeX, CanvasOffsetY+ButtonSizeY, ButtonSizeX, ButtonSizeY, (e) => { audioToggle(e.target); })
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
		this.dialogueImages = await loadImages([
			"assets/dialogue/yes.png",
			"assets/dialogue/yes2.png",
			"assets/dialogue/no.png",
			"assets/dialogue/no2.png"
		]);
		this.arrowImages = await loadImages([
			"assets/arrow/left.png",
			"assets/arrow/right.png",
			"assets/arrow/top.png",
			"assets/arrow/bottom.png",
			"assets/arrow/info.png"
		]);
		this.arrowImages2 = await loadImages([
			"assets/arrow/left2.png",
			"assets/arrow/right2.png",
			"assets/arrow/top2.png",
			"assets/arrow/bottom2.png",
			"assets/arrow/info2.png"
		]);
	}

	setupTranslations() {
		//setup pause menu text
		document.getElementById("pause_loadgame").innerHTML = getTranslation(4);
		document.getElementById("pause_savegame").innerHTML = getTranslation(11);
		document.getElementById("pause_quitgame").innerHTML = getTranslation(12);
		document.getElementById("pause_audio").innerHTML = getTranslation(ui.settings.music_enabled ? 9 : 8);
		this.pauseCanvas.setColor("#000080").setLargeFontSize().setFontWeight("bold").textS(getTranslation(10), 10, 20);
		this.pauseCanvas.setSmallFontSize().setFontWeight("normal").textS(getTranslation(28), 10, 27);
	}
}

function waiterEventFromElement(element, event, resolvevalue = undefined) {
	//in promise: first arg resolve, then reject
	return new Promise((resolve) => {
		let listener;
		if(resolvevalue === undefined) {
			listener = () => { element.removeEventListener(event, listener); resolve(); }
		}
		else {
			listener = () => { element.removeEventListener(event, listener); resolve(resolvevalue); }
		}
		element.addEventListener(event, listener);
	})
}
