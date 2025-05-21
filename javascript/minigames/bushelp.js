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

class Lane {
	constructor() {

	}
};

class VehicleData {
	constructor() {
		
	}
};

let busCounters = {
	time: 1200,
	lanes: [], //array: N, S, E, W - each cardinal direction has a lane array
	vehicles: [], //objects with id and vehicle data
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
