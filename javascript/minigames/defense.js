
//simple tower defense game
//must be fairly neutral

//towers:
//knědlík cook?
//

//enemies:
//halušky?
//

let defenseCounters = {

};

function minigameDefenseReset() {

}

async function minigameDefenseLoad() {

}
async function minigameDefenseMenu() {

}
async function minigameDefenseGame() {

}
async function minigameDefenseSummary() {

}

async function minigameDefense() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameDefenseLoad();
	await minigameDefenseMenu();
	await minigameDefenseGame();
	await minigameDefenseSummary();
	minigameDefenseReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
