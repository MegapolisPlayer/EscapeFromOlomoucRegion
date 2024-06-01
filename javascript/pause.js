let pauseCanvasElement = undefined;
let pauseContext = undefined; // canvas context of pause menu canvas, avoid redrawing
let pauseOldAnimationState = false;

function makePause() {
	pauseButton = internal_setButton("pause", "", "draw_input_elem_pause", 0, 0, canvasX(canvas, 20), canvasY(canvas, 10), () => {
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
	canvasSetFontWeight(canvas, ctx, "normal");
	let temp = ctx.fillStyle;
	canvasSetColor(canvas, ctx, "#ffffff");
	canvasCircleBox(canvas, ctx, 0, 0, 20, 10);
	canvasImageSamesizeY(canvas, ctx, (pauseAnimationState == true) ? pause2 : pause1, 1, 0, 10);
	canvasSetColor(canvas, ctx, pauseAnimationState ? "#00aaaa" : "#000080");
	canvasSetSmallFont(canvas, ctx);
	canvasTextS(canvas, ctx, getTranslation(10), 8, 7);
	ctx.fillStyle = temp;
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
		animationBlocked = pauseOldAnimationState;
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
		pauseOldAnimationState = animationBlocked;
		animationBlocked = true;
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
	pauseCanvasElement.style.setProperty("top", canvas.height*0.1+"px");
	pauseCanvasElement.style.setProperty("left", canvas.width*0.1+"px");

	pauseCanvasElement.width = canvas.width*0.8;
	pauseCanvasElement.height = canvas.height*0.8;
	pauseCanvasElement.style.setProperty("width", pauseCanvasElement.width+"px");
	pauseCanvasElement.style.setProperty("height", pauseCanvasElement.height+"px");
	
	pauseContext = pauseCanvasElement.getContext("2d");
	pauseContext.width = pauseCanvasElement.width;
	pauseContext.height = pauseCanvasElement.height;
	pauseContext.lineWidth = 1;
	
	//setup bg

	canvasSetAlpha(pauseCanvasElement, pauseContext, 0);
	pauseContext.fillstyle = "#aaaaaa";
	pauseContext.fillRect(0, 0, pauseCanvasElement.width, pauseCanvasElement.height);
	canvasResetAlpha(pauseCanvasElement, pauseContext);

	canvasSetColor(pauseCanvasElement, pauseContext, "#aaaaaa");
	canvasRoundedBox(pauseCanvasElement, pauseContext, 0, 0, 100, 100, 40);
	canvasSetColor(pauseCanvasElement, pauseContext, "#000080");

	canvasSetLargeFont(pauseCanvasElement, pauseContext);
	canvasSetFontWeight(pauseCanvasElement, pauseContext, "bold");
	canvasTextS(pauseCanvasElement, pauseContext, getTranslation(10), 10, 20);

	canvasSetSmallFont(pauseCanvasElement, pauseContext);
	canvasSetFontWeight(pauseCanvasElement, pauseContext, "normal");
	canvasTextS(pauseCanvasElement, pauseContext, getTranslation(28), 10, 27);

	//add buttons

	//buttons:
	//load game, save game, toggle audio, quit game

	//also add title offset
	const CanvasOffsetX = parseInt(pauseCanvasElement.style.getPropertyValue("left"))+canvasX(pauseCanvasElement, 10);
	const CanvasOffsetY = parseInt(pauseCanvasElement.style.getPropertyValue("top"))+canvasY(pauseCanvasElement, 30);

	const ButtonSizeX = canvasX(pauseCanvasElement, 40);
	const ButtonSizeY = canvasY(pauseCanvasElement, 30);

	let Buttons = [];
	Buttons.push(internal_setButton("pause_loadgame", "test", "pause_button draw_input_elem", 
	CanvasOffsetX, CanvasOffsetY, ButtonSizeX, ButtonSizeY, () => {

	}));
	Buttons.push(internal_setButton("pause_savegame", "test", "pause_button draw_input_elem",
	CanvasOffsetX+ButtonSizeX, CanvasOffsetY, ButtonSizeX, ButtonSizeY, () => {
		
	}));
	Buttons.push(internal_setButton("pause_quitgame", "test", "pause_button draw_input_elem",
	CanvasOffsetX, CanvasOffsetY+ButtonSizeY, ButtonSizeX, ButtonSizeY, () => {
		
	}));
	Buttons.push(internal_setButton("pause_audio", "test", "pause_button draw_input_elem",
	CanvasOffsetX+ButtonSizeX, CanvasOffsetY+ButtonSizeY, ButtonSizeX, ButtonSizeY, () => {
		
	}));

	//add elements
	
	canvas.parentElement.appendChild(pauseCanvasElement);
	for(let i = 0; i < 4; i++) {
		Buttons[i].style.setProperty("display", "none");
		canvas.parentElement.appendChild(Buttons[i]);
	}
	
	pauseContext = pauseCanvasElement.getContext("2d");

	pauseInterval = window.setInterval(() => {
		if(animationBlocked || pauseHidden) return;

		renderPause();

		pauseAnimationState = !pauseAnimationState;
	}, 800);
	
	window.addEventListener("keydown", (e) => {
		if(e.code === "Escape") {
			pauseMenuToggle();
		}
	});
}