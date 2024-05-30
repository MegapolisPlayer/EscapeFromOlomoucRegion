async function cutsceneNews() {
	animationBlocked = true;

	let bg = await loadImage("assets/cutscene/news.jpg");

	let skipPromise = { promise: new Promise((resolve) => {}) };
	addButton("skip", getTranslation(7), 80, 0, 20, 10, () => {
		skipPromise.promise = Promise.resolve();
	});

	canvasBackground(canvas, ctx, bg);
	canvasSetColor(canvas, ctx, "#000080");
	canvasSetAlpha(canvas, ctx, 0.5);
	canvasBox(canvas, ctx, 0, 0, 100, 100);
	canvasResetAlpha(canvas, ctx);

	canvasSetColor(canvas, ctx, "#800000");
	canvasRoundedBox(canvas, ctx, 0, 0, 40, 15, 10);

	musicPause();
	sfxPlayQuiet(10);

	canvasSetLargeFont(canvas, ctx);
	canvasSetColor(canvas, ctx, "#ffffff");
	canvasSetBorder(canvas, ctx, "#000080");
	canvasTextAndBorderS(canvas, ctx, getTranslation(45), 5, 10);

	canvasSetSmallFont(canvas, ctx);

	for(let i = 0; i < 3; i++) {
		canvasSetColor(canvas, ctx, "#000080");
		canvasImageEquivalent(canvas, ctx, steelImage, 0, 70, 100, 30);
		canvasSetColor(canvas, ctx, "#ffffff");
		await canvasTypewriterM(canvas, ctx, wrapText(getTranslationAndVoice(46+i), 80), 10, 80, skipPromise);

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