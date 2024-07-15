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
	canvas.animationBlocked = true;

	await minigameFishLoad();
	await minigameFishMenu();
	await minigameFishGame();
	await minigameFishSummary();

	canvas.animationBlocked = false;
}
