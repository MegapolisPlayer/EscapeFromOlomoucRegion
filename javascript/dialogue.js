function dialogueBegin() {
	if(info.speedrun) return; //no dialogues in speedrun mode
	dialogueEnabled = true;
}

async function dialogueNext(id) {
	if(info.speedrun) return new Promise((resolve) => { resolve(); });

	canvasSetColor("#ffffff");
	canvasRoundedBox(0, 80, 100, 20, 10);

	canvasSetColor("#000000");
	canvasSetSmallFont();
	canvasSetFontWeight("normal");
	canvasTextM(wrapText(getTranslationAndVoice(id), 90), 5, 85);

	return renderArrows([
		new ArrowInfo(92, 92, arrowType.RIGHT, () => {}),
	]);
}

async function dialogueChoice() {
	if(info.speedrun) return new Promise((resolve) => { resolve(); });

	canvasSetColor("#ffffff");
	canvasRoundedBox(0, 80, 100, 20, 10);

	canvasSetColor("#000000");
	canvasSetSmallFont();

	return renderArrows([
		new ArrowInfo(92, 92, arrowType.RIGHT, () => {}),
	]);
}

function dialogueEnd() {
	if(info.speedrun) return;
	dialogueEnabled = false;
}