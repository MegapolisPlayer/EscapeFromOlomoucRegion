

function timerBegin() {
	timeBegin = Date.now();
	timePlaying = 0;
	timeInPauseMenu = 0;
	timerInterval = window.setInterval(() => {
		if(info.paused || canvas.animationBlocked) {
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
		canvas.setColor("#ffffff");
		canvas.drawRoundedBox( 0, 0, 15, 20, 10);
		canvas.setColor("#000080");
		canvas.setSmallFontSize();
		canvas.textS(getTranslation(3), 2, 7);
		canvas.textS(timePlaying+"s", 2, 17);
	}
}

