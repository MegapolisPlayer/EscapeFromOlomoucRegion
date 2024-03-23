let waiterMinigameImages = [];
let waiterLoaded = false;
let waiterButtons = [];

async function minigameWaiterLoad() {
	if(waiterLoaded) return;

	await loadMusic([10]);
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/belt.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablebase.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tableorder.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tableorder2.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablewaiting.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablewaiting2.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tabledone.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablegood.png"));
	waiterLoaded = true;
}

async function minigameWaiterMenu() {
	canvasClear("#aaaaaa");

	musicPlay(10);

	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetFontWeight("bold");

	canvasTextS(getTranslation(66), 10, 10);

	canvasSetSmallFont();
	canvasSetFontWeight("normal");

	canvasTextM(wrapText(getTranslation(67), 90), 5, 18);

	canvasImageSamesizeY(waiterMinigameImages[1], 5, 40, 10);
	canvasTextS(getTranslation(68), 15, 45);

	canvasImageSamesizeY(waiterMinigameImages[2], 5, 50, 10);
	canvasTextS(getTranslation(69), 15, 55);

	canvasImageSamesizeY(waiterMinigameImages[4], 5, 60, 10);
	canvasTextS(getTranslation(70), 15, 65);

	canvasImageSamesizeY(waiterMinigameImages[3], 5, 70, 10);
	canvasImageSamesizeY(waiterMinigameImages[5], 12, 70, 10);
	canvasTextS(getTranslation(71), 20, 75);

	canvasImageSamesizeY(waiterMinigameImages[7], 5, 80, 10);
	canvasTextS(getTranslation(72), 15, 85);

	canvasImageSamesizeY(waiterMinigameImages[6], 5, 90, 10);
	canvasTextS(getTranslation(73), 15, 95);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}

function renderWaiterMinigame() {
	canvasClear("#aaaaaa");

	canvasSetColor("#ffffff");
	canvasBox(80, 0, 20, 100);
	canvasSetColor("#000080");

	canvasTextS(getTranslation(74), 83, 7);
	canvasTextS(getTranslation(75), 83, 27);
	canvasTextS(getTranslation(76), 83, 47);
	canvasTextS(getTranslation(77), 83, 67);

	waiterButtons.push(addSmallButton("pause", getTranslation(10), 80, 80, 20, 10, (e) => {}));

	for(let i = 0; i < 8; i++) {
		canvasImageDest(waiterMinigameImages[0], 10+i*10, 90, 10, 10);
	}

	for(let i = 0; i < 16; i++) {
		canvasImageSamesizeY(waiterMinigameImages[1], 10+(Math.trunc(i/4)*10), 10+((i%4)*15), 10);
	}
}

async function minigameWaiterGame() {
	renderWaiterMinigame();

	//promise

	waiterButtons.push(addSmallButton("skip", getTranslation(78), 80, 90, 20, 10, (e) => {}), "click");

	let endGamePromiseCompleted = false;
	let endGamePromise = Promise.any([
		new Promise((resolve) => {}),
		waiterEventFromElement(waiterButtons[waiterButtons.length - 1])
	]).then((v) => {
		endGamePromiseCompleted = true;
	});

	//main loop

	while(!endGamePromiseCompleted) {
		await Promise.any([new Promise((resolve) => {
			setTimeout(() => { resolve(); }, 100);
		}), endGamePromise]);
	}
	
	waiterButtons.forEach((val) => { 
		val.remove();
	});
}
async function minigameWaiterSummary() {
	canvasClear("#aaaaaa");

	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetFontWeight("bold");

	canvasTextS(getTranslation(60), 10, 10);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => { musicStop(); }));
}

async function minigameWaiter() {
	animationBlocked = true;

	await minigameWaiterLoad();
	await minigameWaiterMenu();
	await minigameWaiterGame();
	await minigameWaiterSummary();

	animationBlocked = false;
}