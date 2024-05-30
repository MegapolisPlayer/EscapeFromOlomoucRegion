let pauseCanvasElement = undefined;
let pauseContext = undefined; // canvas context of pause menu canvas, avoid redrawing

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
	if(info.pause) {
		pauseMenuOff();
		showAllInput();
		musicUnpause();
		pauseCanvasElement.style.setProperty("display", "none");
	}
	else {
		pauseMenuOn();
		hideAllInput();
		musicPause();
		pauseCanvasElement.style.setProperty("display", "inline");
	}
	animationBlocked = info.pause;
}

function pauseMenuOn() {
	console.log("Pause menu enabled!");
	info.pause = true;
	document.querySelectorAll(".pause_button").forEach((val) => {
		val.style.setProperty("display", "block");
	});
}

function pauseMenuOff() {
	console.log("Pause menu disabled!");
	info.pause = false;
	document.querySelectorAll(".pause_button").forEach((val) => {
		val.style.setProperty("display", "none");
	});
}

async function loadPause() {
	pause1 = await loadImage("assets/arrow/pause.png");
	pause2 = await loadImage("assets/arrow/pause2.png");
	makePause();
	hidePause();

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
	
	canvasSetAlpha(pauseCanvasElement, pauseContext, 0);
	pauseContext.fillstyle = "#aaaaaa";
	pauseContext.fillRect(0, 0, pauseCanvasElement.width, pauseCanvasElement.height);
	canvasResetAlpha(pauseCanvasElement, pauseContext);

	canvasSetColor(pauseCanvasElement, pauseContext, "#aaaaaa");
	canvasRoundedBox(pauseCanvasElement, pauseContext, 5, 5, 90, 90, 40);
	canvasSetColor(pauseCanvasElement, pauseContext, "#000080");

	canvasSetLargeFont(pauseCanvasElement, pauseContext);
	canvasTextS(pauseCanvasElement, pauseContext, getTranslation(10), 10, 20);

	canvasSetSmallFont(pauseCanvasElement, pauseContext);
	canvasTextS(pauseCanvasElement, pauseContext, getTranslation(28), 10, 30);

	canvas.parentElement.appendChild(pauseCanvasElement);

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