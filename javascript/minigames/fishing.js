let fishMinigameImages = [];
let fishLoaded = false;

function minigameFishReset() {

}

async function minigameFishLoad() {
	if(fishLoaded) return;

	await loadMusic([11]);
	//TODO rotate
	//TODO animations of fish
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fish.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fishB.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fish2.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fish2B.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/box.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/tyre.png"));
	//TODO player animation
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fisher.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fisher2.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/grass.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/hook.png"));
	//TODO rotate hook when fishing
	fishLoaded = true;
}

async function minigameFishMenu() {
	pauseHidden = true;

	canvas.clear("#aaaaaa");

	musicPlay(10);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(66), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");

	canvas.textM(wrapText(getTranslation(67)+" "+String(Math.trunc(10*ui.settings.diff_multiplier))+" "+getTranslation(68)+" "+String(20)+" "+getTranslation(69), 90), 5, 18);

	canvas.imageSamesizeY(fishMinigameImages[1], 5, 40, 10);
	canvas.textS(getTranslation(70), 15, 45);

	canvas.imageSamesizeY(fishMinigameImages[2], 5, 50, 10);
	canvas.textS(getTranslation(71), 15, 55);

	canvas.imageSamesizeY(fishMinigameImages[4], 5, 60, 10);
	canvas.textS(getTranslation(72), 15, 65);

	canvas.imageSamesizeY(fishMinigameImages[3], 5, 70, 10);
	canvas.imageSamesizeY(fishMinigameImages[5], 12, 70, 10);
	canvas.textS(getTranslation(73), 20, 75);

	canvas.imageSamesizeY(fishMinigameImages[7], 5, 80, 10);
	canvas.textS(getTranslation(74), 15, 85);

	canvas.imageSamesizeY(fishMinigameImages[6], 5, 90, 10);
	canvas.textS(getTranslation(75), 15, 95);

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
