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

let busCounters = {
	time: 1200,
	laneData: [],
	vehicles: [],
	passedVehicles: 0,
};

let busLoaded = false;

function minigameBusReset() {

}

function busRenderLanes() {

}
function busRenderTrafficArrows() {

}

async function minigameBusLoad() {

}

async function minigameBusMenu() {

}

async function minigameBusSetup() {

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
	await minigameBusSetup();
	await minigameBusGame();
	await minigameBusSummary();
	minigameBusReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
