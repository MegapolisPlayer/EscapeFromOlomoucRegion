let dialogueEnabled = false;
let dialogueImages = [];
let dialogueAnimationState = false;

function dialogueBegin() {
	if(ui.info.speedrun) return; //no dialogues in speedrun mode
	console.log("Dialogue started");
	dialogueEnabled = true;
}

async function dialogueNext(id) {
	if(ui.info.speedrun) return new Promise((resolve) => { resolve(); });
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
	if(ui.info.speedrun) return new Promise((resolve) => { resolve(); });
	console.log("Dialogue choice");

	canvas.setColor("#ffffff");
	canvas.drawRoundedBox(0, 80, 100, 20, 10);

	YesPromise = waiterEventFromElement(internal_setButton(
		"YesChoice", "", "draw_input_elem_arrow",
		canvas.getX(20), canvas.getY(80),
		canvas.getY(20), canvas.getY(20),
		() => {}
	), "click", true);
	NoPromise = waiterEventFromElement(internal_setButton(
		"NoChoice", "", "draw_input_elem_arrow",
		canvas.getX(60), canvas.getY(80),
		canvas.getY(20), canvas.getY(20),
		() => {}
	), "click", false);

	let choiceInterval = window.setInterval(() => {
		if(ui.animationBlocked) return;


		if(dialogueAnimationState) {
			canvas.imageSamesizeY(dialogueImages[0], 20, 82, 18);
			canvas.imageSamesizeY(dialogueImages[2], 60, 82, 18);
		}
		else {
			canvas.imageSamesizeY(dialogueImages[1], 20, 82, 18);
			canvas.imageSamesizeY(dialogueImages[3], 60, 82, 18);
		}

		dialogueAnimationState = !dialogueAnimationState;
	}, 700);

	let returnValue = await Promise.any([YesPromise, NoPromise]);

	window.clearInterval(choiceInterval);
	removeButtons(["YesChoice", "NoChoice"]);

	return returnValue;
}

function dialogueEnd() {
	if(ui.info.speedrun) return;
	console.log("Dialogue ended");
	dialogueEnabled = false;
}

async function loadDialogue() {
	dialogueImages = await loadImages([
		"assets/dialogue/yes.png",
		"assets/dialogue/yes2.png",
		"assets/dialogue/no.png",
		"assets/dialogue/no2.png"
	]);


}
