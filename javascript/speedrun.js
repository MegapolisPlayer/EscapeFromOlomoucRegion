function timerBegin() {
	timeBegin = Date.now();
	timePlaying = 0;
	timerInterval = window.setInterval(() => {
		if(info.paused) { return; }
		timePlaying = Math.trunc((Date.now() - (timeBegin))/1000);
		renderSpeedrunMode();
	}, 900)
}

function timerEnd() {
	window.clearInterval(timerInterval);
}

function renderSpeedrunMode() {
	if(info.speedrun) {
		canvasSetColor("#ffffff");
		canvasRoundedBox(0, 0, 20, 20, 10);
		canvasSetColor("#000080");
		canvasSetSmallFont();
		canvasTextS(getTranslation(3), 3, 7);
		canvasTextS(timePlaying+"s", 3, 17);
	}
}