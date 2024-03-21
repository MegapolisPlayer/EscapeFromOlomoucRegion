function makePause() {
	pauseButton = internal_setButton("pause", "", "draw_input_elem_pause", 0, 0, canvasX(20), canvasY(10), () => {
		pauseMenuToggle();
	});
}
function deletePause() {
	pauseButton.remove();
}

function hidePause() {
	pauseButton.style.setProperty("display", "none");
}
function showPause() {
	pauseButton.style.setProperty("display", "block");
}

function renderPause() {
	ctx.save();
	canvasSetFontWeight("normal");
	canvasSetColor("#ffffff");
	canvasCircleBox(0, 0, 20, 10);
	canvasImageSamesizeY((pauseAnimationState == true) ? pause2 : pause1, 1, 0, 10);
	canvasSetColor(pauseAnimationState ? "#00aaaa" : "#000080");
	canvasSetSmallFont();
	canvasTextS(getTranslation(10), 8, 7);
	ctx.restore();
}

function pauseMenuToggle() {
	if(pauseEnabled) {
		pauseMenuOff();
	}
	else {
		pauseMenuOn();
	}
}

function pauseMenuOn() {
	console.log("Pause menu enabled!");
	pauseEnabled = true;
}

function pauseMenuOff() {
	console.log("Pause menu disabled!");
	pauseEnabled = false;
}

async function loadPause() {
	pause1 = await loadImage("assets/arrow/pause.png");
	pause2 = await loadImage("assets/arrow/pause2.png");
	makePause();
	hidePause();

	pauseInterval = window.setInterval(() => {
		if(animationBlocked) return;

		renderPause();

		pauseAnimationState = !pauseAnimationState;
	}, 800);
}