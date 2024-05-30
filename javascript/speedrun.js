function timerBegin() {
	timeBegin = Date.now();
	timePlaying = 0;
	timeInPauseMenu = 0;
	timerInterval = window.setInterval(() => {
		if(info.paused || animationBlocked) {
			return;
		};
		timePlaying = Math.trunc(((Date.now() - timeBegin) - timeInPauseMenu)/1000);
		renderSpeedrunMode();
	}, 900)
}

function timerEnd() {
	window.clearInterval(timerInterval);
}

function renderSpeedrunMode() {
	if(info.speedrun) {
		canvasSetColor(canvas, ctx, "#ffffff");
		canvasRoundedBox(canvas, ctx, 0, 10, 15, 20, 10);
		canvasSetColor(canvas, ctx, "#000080");
		canvasSetSmallFont(canvas, ctx);
		canvasTextS(canvas, ctx, getTranslation(3), 2, 17);
		canvasTextS(canvas, ctx, timePlaying+"s", 2, 27);
	}
}

