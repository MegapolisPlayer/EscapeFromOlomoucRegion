// todo: port to mobile when making bench minigame

let benchMinigameImages = [];

function minigameBenchReset() {

}

async function minigameBenchLoad() {

}

async function minigameBenchMenu() {
	
}
async function minigameBenchGame() {
	
}
async function minigameBenchSummary() {
	
}

async function minigameBench() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameBenchLoad();
	await minigameBenchMenu();
	await minigameBenchGame();
	await minigameBenchSummary();
	minigameBenchReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
