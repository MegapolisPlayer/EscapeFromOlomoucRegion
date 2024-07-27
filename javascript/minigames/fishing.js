let fishMinigameImages = [];

async function minigameFishLoad() {

}

async function minigameFishMenu() {
	pauseHidden = true;

	canvas.clear("#aaaaaa");

	musicPlay(10);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(66), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");

	canvas.textM(wrapText(getTranslation(67)+" "+String(Math.trunc(10*ui.settings.diff_multiplier))+" "+getTranslation(68)+" "+String(20)+" "+getTranslation(69), 90), 5, 18);

	/*
	canvas.imageSamesizeY(waiterMinigameImages[1], 5, 40, 10);
	canvas.textS(getTranslation(70), 15, 45);

	canvas.imageSamesizeY(waiterMinigameImages[2], 5, 50, 10);
	canvas.textS(getTranslation(71), 15, 55);

	canvas.imageSamesizeY(waiterMinigameImages[4], 5, 60, 10);
	canvas.textS(getTranslation(72), 15, 65);

	canvas.imageSamesizeY(waiterMinigameImages[3], 5, 70, 10);
	canvas.imageSamesizeY(waiterMinigameImages[5], 12, 70, 10);
	canvas.textS(getTranslation(73), 20, 75);

	canvas.imageSamesizeY(waiterMinigameImages[7], 5, 80, 10);
	canvas.textS(getTranslation(74), 15, 85);

	canvas.imageSamesizeY(waiterMinigameImages[6], 5, 90, 10);
	canvas.textS(getTranslation(75), 15, 95);
	*/

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
}

async function minigameFishGame() {
	
}
async function minigameFishSummary() {

}

async function minigameFish() {
	ui.animationBlocked = true;
	ui.disableWidgets();

	await minigameFishLoad();
	await minigameFishMenu();
	await minigameFishGame();
	await minigameFishSummary();

	ui.animationBlocked = false;
	ui.enableWidgets();
}
