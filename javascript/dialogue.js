function dialogueBegin() {
	if(info.speedrun) return; //no dialogues in speedrun mode
	console.log("Dialogue started");
	dialogueEnabled = true;
}

async function dialogueNext(id) {
	if(info.speedrun) return new Promise((resolve) => { resolve(); });
	console.log("Dialogue next");

	canvasSetColor("#ffffff");
	canvasRoundedBox(0, 80, 100, 20, 10);

	canvasSetSmallFont();
	canvasSetFontWeight("normal");
	canvasSetColor("#000000");
	await canvasTypewriterM(wrapText(getTranslationAndVoice(id), 90), 5, 85);

	return renderArrow(new ArrowInfo(92, 92, arrowType.RIGHT, () => {}));
}

async function dialogueChoice() {
	if(info.speedrun) return new Promise((resolve) => { resolve(); });
	console.log("Dialogue choice");

	canvasSetColor("#ffffff");
	canvasRoundedBox(0, 80, 100, 20, 10);

	


	return renderArrow(new ArrowInfo(92, 92, arrowType.RIGHT, () => {}),);
}

function dialogueEnd() {
	if(info.speedrun) return;
	console.log("Dialogue ended");
	dialogueEnabled = false;
}