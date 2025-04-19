function minigameCheesemakingReset() {

}

async function minigameCheesemakingLoad() {

}
async function minigameCheesemakingMenu() {

}
async function minigameCheesemakingGame() {

}
async function minigameCheesemakingSummary() {

}

async function minigameCheesemaking() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameCheesemakingLoad();
	await minigameCheesemakingMenu();
	await minigameCheesemakingGame();
	await minigameCheesemakingSummary();
	minigameCheesemakingReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
