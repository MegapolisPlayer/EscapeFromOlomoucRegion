async function renderDialogue(id) {
	canvasSetColor("#ffffff");
	canvasSetBorder("#00aaaa");
	canvasRoundedBox(0, 80, 100, 20, 10);

	canvasTextM(getTranslationAndVoice(id));

	return renderArrows([
		new ArrowInfo(92, 92, arrowType.RIGHT, () => {}),
	]);
}