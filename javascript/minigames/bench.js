// todo: port to mobile when making bench minigame

let benchMinigameImages = [];

async function minigameBenchLoad() {

}

async function minigameBenchMenu() {
	
}
async function minigameBenchGame() {
	
}
async function minigameBenchSummary() {
	
}

async function minigameFish() {
	animationBlocked = true;

	await minigameBenchLoad();
	await minigameBenchMenu();
	await minigameBenchGame();
	await minigameBenchSummary();

	animationBlocked = false;
}