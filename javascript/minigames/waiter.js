let waiterMinigameImages = [];

async function minigameWaiterLoad() {
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/belt.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tableorder.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tableorder2.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablewaiting.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablewaiting2.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tabledone.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablegood.png"));
}

async function minigameWaiterMenu() {
	canvasClear("#aaaaaa");

	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetFontWeight("bold");

	canvasTextS(getTranslation(66), 10, 10);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}
async function minigameWaiterGame() {
	canvasClear("#aaaaaa");

	for(let i = 0; i < Math.trunc(canvas.width/waiterMinigameImages[0].width) + 1; i++) {
		canvasImagePart(waiterMinigameImages[0], i*10, 90, 10);
	}
}
async function minigameWaiterSummary() {
	canvasClear("#aaaaaa");

	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetFontWeight("bold");

	canvasTextS(getTranslation(60), 10, 10);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}

async function minigameWaiter() {
	animationBlocked = true;

	await minigameWaiterLoad();
	await minigameWaiterMenu();
	await minigameWaiterGame();
	await minigameWaiterSummary();

	animationBlocked = false;
}