function minigameCashierReset() {

}

async function minigameCashierLoad() {

}
async function minigameCashierMenu() {

}
async function minigameCashierGame() {

}
async function minigameCashierSummary() {

}

async function minigameCashier() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameCashierLoad();
	await minigameCashierMenu();
	await minigameCashierGame();
	await minigameCashierSummary();
	minigameCashierReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
