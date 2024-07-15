let pauseCanvas = undefined;
let pauseOldAnimationState = false;

function makePause() {
	pauseButton = internal_setButton("pause", "", "draw_input_elem_pause", 0, 0, canvas.getX(20), canvas.getY(10), () => {
		pauseMenuToggle();
	});
}
function deletePause() {
	pauseButton.remove();
}

function hidePause() {
	pauseButton.style.setProperty("display", "none");
	pauseHidden = true;
}
function showPause() {
	pauseButton.style.setProperty("display", "block");
	pauseHidden = false;
}

function renderPause() {
	if(info.speedrun) { return; }
	canvas.setFontWeight("normal");
	let temp = canvas.ctx.fillStyle;
	canvas.setColor("#ffffff");
	canvas.drawCircleBox(0, 0, 20, 10);
	canvas.imageSamesizeY((pauseAnimationState == true) ? pause2 : pause1, 1, 0, 10);
	canvas.setColor(pauseAnimationState ? "#00aaaa" : "#000080");
	canvas.setSmallFontSize();
	canvas.textS(getTranslation(10), 8, 7);
	canvas.ctx.fillStyle = temp;
}

function pauseMenuToggle() {
	if(info.speedrun) { return; }
	if(info.paused) {
		showAllInput();
		musicUnpause();
		console.log("Pause menu disabled!");
		info.paused = false;
		document.querySelectorAll(".pause_button").forEach((val) => {
			val.style.setProperty("display", "none");
		});
		pauseCanvasElement.style.setProperty("display", "none");
		canvas.animationBlocked = pauseOldAnimationState;
	}
	else {
		hideAllInput();
		musicPause();
		console.log("Pause menu enabled!");
		info.paused = true;
		document.querySelectorAll(".pause_button").forEach((val) => {
			val.style.setProperty("display", "inline");
		});
		pauseCanvasElement.style.setProperty("display", "inline");
		pauseOldAnimationState = canvas.animationBlocked;
		canvas.animationBlocked = true;
	}
}

async function loadPause() {
	pause1 = await loadImage("assets/arrow/pause.png");
	pause2 = await loadImage("assets/arrow/pause2.png");
	makePause();
	hidePause();

	//setup pause element

	pauseCanvasElement = document.createElement("canvas");
	pauseCanvasElement.id = "pause_menu";
	
	pauseCanvasElement.style.setProperty("display", "none");
	pauseCanvasElement.style.setProperty("position", "absolute");
	pauseCanvasElement.style.setProperty("top", canvas.canvas.height*0.1+"px");
	pauseCanvasElement.style.setProperty("left", canvas.canvas.width*0.1+"px");

	pauseCanvasElement.width = canvas.canvas.width*0.8;
	pauseCanvasElement.height = canvas.canvas.height*0.8;
	pauseCanvasElement.style.setProperty("width", pauseCanvasElement.width+"px");
	pauseCanvasElement.style.setProperty("height", pauseCanvasElement.height+"px");
	
	pauseContext = pauseCanvasElement.getContext("2d");
	pauseContext.width = pauseCanvasElement.width;
	pauseContext.height = pauseCanvasElement.height;
	pauseContext.lineWidth = 1;

	pauseCanvas = new CanvasImplementation(pauseCanvasElement, pauseContext);
	
	//setup bg

	pauseCanvas.setAlpha(0);
	pauseCanvas.ctx.fillstyle = "#aaaaaa";
	pauseCanvas.ctx.fillRect(0, 0, pauseCanvas.canvas.width, pauseCanvas.canvas.height);
	pauseCanvas.resetAlpha();

	pauseCanvas.setColor("#aaaaaa");
	pauseCanvas.drawRoundedBox(0, 0, 100, 100, 40);
	pauseCanvas.setColor("#000080");

	pauseCanvas.setLargeFontSize();
	pauseCanvas.setFontWeight("bold");
	pauseCanvas.textS(getTranslation(10), 10, 20);

	pauseCanvas.setSmallFontSize();
	pauseCanvas.setFontWeight("normal");
	pauseCanvas.textS(getTranslation(28), 10, 27);

	//add buttons

	//buttons:
	//load game, save game, toggle audio, quit game

	//also add title offset
	const CanvasOffsetX = parseInt(pauseCanvas.canvas.style.getPropertyValue("left"))+pauseCanvas.getX(10);
	const CanvasOffsetY = parseInt(pauseCanvas.canvas.style.getPropertyValue("top"))+pauseCanvas.getY(30);

	const ButtonSizeX = pauseCanvas.getX(40);
	const ButtonSizeY = pauseCanvas.getY(30);

	let Buttons = [];
	Buttons.push(internal_setButton("pause_loadgame", getTranslation(4), "pause_button draw_input_elem", 
	CanvasOffsetX, CanvasOffsetY, ButtonSizeX, ButtonSizeY, () => {

	}));
	Buttons.push(internal_setButton("pause_savegame", getTranslation(11), "pause_button draw_input_elem",
	CanvasOffsetX+ButtonSizeX, CanvasOffsetY, ButtonSizeX, ButtonSizeY, () => {
		
	}));
	Buttons.push(internal_setButton("pause_quitgame", getTranslation(12), "pause_button draw_input_elem",
	CanvasOffsetX, CanvasOffsetY+ButtonSizeY, ButtonSizeX, ButtonSizeY, () => {
		
	}));
	Buttons.push(internal_setButton("pause_audio", getTranslation(8), "pause_button draw_input_elem",
	CanvasOffsetX+ButtonSizeX, CanvasOffsetY+ButtonSizeY, ButtonSizeX, ButtonSizeY, () => {
		
	}));

	//add elements
	
	canvas.canvas.parentElement.appendChild(pauseCanvasElement);
	for(let i = 0; i < 4; i++) {
		Buttons[i].style.setProperty("display", "none");
		canvas.canvas.parentElement.appendChild(Buttons[i]);
	}
	
	pauseContext = pauseCanvasElement.getContext("2d");

	pauseInterval = window.setInterval(() => {
		if(canvas.animationBlocked || pauseHidden) return;

		renderPause();

		pauseAnimationState = !pauseAnimationState;
	}, 800);
	
	window.addEventListener("keydown", (e) => {
		if(e.code === "Escape") {
			pauseMenuToggle();
		}
	});
}
