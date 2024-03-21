async function cutsceneNews() {
	animationBlocked = true;

	let bg = await loadImage("assets/cutscene/news.jpg");

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
		canvasImageD(steelImage, 0, 70, 100, 30);
		canvasSetColor("#ffffff");
		await canvasTypewriterM(wrapText(getTranslationAndVoice(46+i), 80), 10, 80);

		await renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
	}

	sfxStop(10);
	animationBlocked = false;
}

async function cutsceneStudenka() {
	animationBlocked = true;
	animationBlocked = false;
}

async function cutscenePoland() {
	animationBlocked = true;
	animationBlocked = false;
}