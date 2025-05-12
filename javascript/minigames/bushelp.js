//design line 
//time limit
//smol simulation

//minimetro +/- metrodreamin?
//buildings, stations in radius
//residential -> industry
//            V    <->
//            -> shops

//cargodist - array of passengers with goal (specific shop)
//draw routes mode



function minigameBusReset() {

}

async function minigameBusLoad() {

}
async function minigameBusMenu() {

}
async function minigameBusGame() {

}
async function minigameBusSummary() {

}

async function minigameBus() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameBusLoad();
	await minigameBusMenu();
	await minigameBusGame();
	await minigameBusSummary();
	minigameBusReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
