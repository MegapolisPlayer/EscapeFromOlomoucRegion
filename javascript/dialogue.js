function dialogueBegin() {
	if(info.speedrun) return; //no dialogues in speedrun mode
	console.log("Dialogue started");
	dialogueEnabled = true;
}

async function dialogueNext(id) {
	if(info.speedrun) return new Promise((resolve) => { resolve(); });
	console.log("Dialogue next");

	canvasSetColor(canvas, ctx, "#ffffff");
	canvasRoundedBox(canvas, ctx, 0, 80, 100, 20, 10);

	canvasSetSmallFont(canvas, ctx);
	canvasSetFontWeight(canvas, ctx, "normal");
	canvasSetColor(canvas, ctx, "#000000");
	await canvasTypewriterM(canvas, ctx, wrapText(getTranslationAndVoice(id), 90), 5, 85);

	return renderArrow(new ArrowInfo(92, 92, arrowType.RIGHT, () => {}));
}

async function dialogueChoice() {
	if(info.speedrun) return new Promise((resolve) => { resolve(); });
	console.log("Dialogue choice");

	canvasSetColor(canvas, ctx, "#ffffff");
	canvasRoundedBox(canvas, ctx, 0, 80, 100, 20, 10);

	//TODO: add choice

	return renderArrow(new ArrowInfo(92, 92, arrowType.RIGHT, () => {}),);
}

function dialogueEnd() {
	if(info.speedrun) return;
	console.log("Dialogue ended");
	dialogueEnabled = false;
}