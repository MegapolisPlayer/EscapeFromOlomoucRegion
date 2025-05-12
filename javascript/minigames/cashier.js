const CASHIER_REWARD_PRODUCT = 20;
let ACTUAL_CASHIER_REWARD_PRODUCT = -1;

let cashierLoaded = false;
let cashierCounters = {
	time: 900,
};

function minigameCashierReset() {

}

async function minigameCashierLoad() {
	if(cashierLoaded) return;

	ACTUAL_CASHIER_REWARD_PRODUCT = Math.trunc(CASHIER_REWARD_PRODUCT*(1.0/ui.settings.diff_multiplier));

	await loadMusic([15]);

	//load bg

	//load images

	//load data

	cashierLoaded = true;
}
async function minigameCashierMenu() {

}
async function minigameCashierGame() {

}
async function minigameCashierSummary() {
	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {
		pauseHidden = false;
		musicPause();
	}));
}

async function minigameCashier() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	minigameCashierReset();
	await minigameCashierLoad();
	await minigameCashierMenu();
	await minigameCashierGame();
	await minigameCashierSummary();
	minigameCashierReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
