async function cutsceneNews() {
	animationBlocked = true;

	let bg = await loadImage("assets/cutscene/news.jpg");

	let skipPromise = { promise: new Promise((resolve) => {}) };
	addButton("skip", getTranslation(7), 80, 0, 20, 10, () => {
		skipPromise.promise = Promise.resolve();
	});

	canvasBackground(bg);
	canvasSetColor("#000080");
	canvasSetAlpha(0.5);
	canvasBox(0, 0, 100, 100);
	canvasResetAlpha();
	canvasSetColor("#800000");

	canvasRoundedBox(0, 0, 40, 15, 10);

	musicStop();
	sfxPlayQuiet(10);

	canvasSetLargeFont();
	canvasSetColor("#ffffff");
	canvasSetBorder("#000080");
	canvasTextAndBorderS(getTranslation(45), 5, 10);

	canvasSetSmallFont();

	for(let i = 0; i < 3; i++) {
		canvasSetColor("#000080");
		canvasImageEquivalent(steelImage, 0, 70, 100, 30);
		canvasSetColor("#ffffff");
		await canvasTypewriterM(wrapText(getTranslationAndVoice(46+i), 80), 10, 80, skipPromise);

		console.log(skipPromise);
		await Promise.any([waiterEventFromElement(document.getElementById("skip"), "click"), skipPromise.promise, renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}))]);
	}

	sfxStop(10);
	animationBlocked = false;
	clearArrows();
	removeButton("skip");
}

async function cutsceneStudenka() {
	animationBlocked = true;

	//dialogue here

	animationBlocked = false;
}

async function cutscenePoland() {
	animationBlocked = true;
	animationBlocked = false;
}