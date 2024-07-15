function dialogueBegin() {
	if(info.speedrun) return; //no dialogues in speedrun mode
	console.log("Dialogue started");
	dialogueEnabled = true;
}

async function dialogueNext(id) {
	if(info.speedrun) return new Promise((resolve) => { resolve(); });
	console.log("Dialogue next");

	canvas.setColor("#ffffff");
	canvas.drawRoundedBox( 0, 80, 100, 20, 10);

	canvas.setSmallFontSize();
	canvas.setFontWeight("normal");
	canvas.setColor("#000000");
	await canvas.typewriterM(wrapText(getTranslationAndVoice(id), 90), 5, 85);

	return renderArrow(new ArrowInfo(92, 92, arrowType.RIGHT, () => {}));
}

async function dialogueChoice() {
	if(info.speedrun) return new Promise((resolve) => { resolve(); });
	console.log("Dialogue choice");

	canvas.setColor("#ffffff");
	canvas.drawRoundedBox( 0, 80, 100, 20, 10);

	//TODO: add choice

	return renderArrow(new ArrowInfo(92, 92, arrowType.RIGHT, () => {}),);
}

function dialogueEnd() {
	if(info.speedrun) return;
	console.log("Dialogue ended");
	dialogueEnabled = false;
}
