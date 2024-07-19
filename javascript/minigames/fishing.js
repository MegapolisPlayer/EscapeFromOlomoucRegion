let fishMinigameImages = [];

async function minigameFishLoad() {

}

async function minigameFishMenu() {
	
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
