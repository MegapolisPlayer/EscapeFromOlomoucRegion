function minigameDialectReset() {

}

async function minigameDialectLoad() {

}
async function minigameDialectMenu() {

}
async function minigameDialectGame() {

}
async function minigameDialectSummary() {

}

async function minigameDialect() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameDialectLoad();
	await minigameDialectMenu();
	await minigameDialectGame();
	await minigameDialectSummary();
	minigameDialectReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
