//minigame in Nezamyslice
//helper at station
//map game (direction)

//have map without name, put names of cities on it (and say direction)
//hard mode: map rotated (north not up)

function minigameMaphelpReset() {

}

async function minigameMaphelpLoad() {

}

async function minigameMaphelpMenu() {
	
}
async function minigameMaphelpGame() {
	
}
async function minigameMaphelpSummary() {
	
}

async function minigameMaphelp() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameMaphelpLoad();
	await minigameMaphelpMenu();
	await minigameMaphelpGame();
	await minigameMaphelpSummary();
	minigameMaphelpReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
