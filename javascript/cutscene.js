async function cutsceneNews() {
	canvasClear("#000080");
	canvasSetColor("#800000");
	canvasRoundedBox(0, 0, 40, 15, 10);

	musicStop();
	sfxPlay(10);

	canvasSetLargeFont();
	canvasSetColor("#ffffff");
	canvasSetBorder("#000080");
	canvasTextAndBorderS(getTranslation(45), 5, 10);

	canvasSetSmallFont();

	for(let i = 0; i < 3; i++) {
		canvasSetColor("#000080");
		canvasBox(0, 70, 100, 30);
		canvasSetColor("#ffffff");
		canvasTextM(wrapText(getTranslationAndVoice(46+i), 80), 10, 80);

		await renderArrows([
			new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
		]);
	}

	sfxStop(10);
}