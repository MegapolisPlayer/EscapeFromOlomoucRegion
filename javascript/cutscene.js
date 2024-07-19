async function cutsceneNews() {
	ui.animationBlocked = true;

	let bg = await loadImage("assets/cutscene/news.jpg");

	let skipPromise = { promise: new Promise((resolve) => {}) };
	ui.addButton("skip", getTranslation(7), 80, 0, 20, 10, () => {
		skipPromise.promise = Promise.resolve();
	});

	canvas.background(bg);
	canvas.setColor("#000080");
	canvas.setAlpha(0.5);
	canvas.drawBox(0, 0, 100, 100);
	canvas.resetAlpha();

	canvas.setColor("#800000");
	canvas.drawRoundedBox( 0, 0, 40, 15, 10);

	musicPause();
	sfxPlayQuiet(10);

	canvas.setLargeFontSize();
	canvas.setColor("#ffffff");
	canvas.setBorder("#000080");
	canvas.textAndBorderS(getTranslation(45), 5, 10);

	canvas.setSmallFontSize();

	for(let i = 0; i < 3; i++) {
		canvas.setColor("#000080").imageEquivalent(steelImage, 0, 70, 100, 30).setColor("#ffffff");

		await canvas.typewriterM(wrapText(getTranslationAndVoice(46+i), 80), 10, 80, skipPromise);

		console.log(skipPromise);
		await Promise.any([waiterEventFromElement(document.getElementById("skip"), "click"), skipPromise.promise, ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}))]);
		ui.clearArrows();
	}

	sfxStop(10);
	ui.removeButton("skip");
}

async function cutsceneStudenka() {
	ui.animationBlocked = true;

	//dialogue here

	ui.animationBlocked = false;
}

async function cutscenePoland() {
	ui.animationBlocked = true;
	ui.animationBlocked = false;
}
