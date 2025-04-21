// todo: port to mobile when making bench minigame

const BENCH_REWARD = 50;
let ACTUAL_BENCH_REWARD = 0;

let benchLoaded = false;
let benchCounters = {
	benchId: 0,
	time: 90*40,
	color: "#cccccc",

};
let benchDirt = [];

class BenchData {

}

const BENCH_DIRT_COLORS = ["#231705", "#3f3525", "#3f3e3d"];

function minigameBenchReset() {
	x = 0;
	y = 0;
	
}

async function minigameBenchLoad() {
	if(benchLoaded) return;

	await loadMusic([16]);

	//no images or player

	benchLoaded = true;
}

async function minigameBenchMenu() {
	pauseHidden = true;

	canvas.clear("#cccccc");
	musicPlay(11);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(0), 10, 10);
}

function renderBenchMinigame(bgcolor) {
	canvas.clear("#cccccc");

	canvas.drawBox(0, 0, 100, 20);

}

async function minigameBenchGame() {

	while(!endGamePromiseCompleted) {
		benchCounters.time--;

		do {
			await new Promise((resolve) => {
				setTimeout(() => { resolve(); }, 25);
			});  
		}
		while(ui.info.paused);
	}
}
async function minigameBenchSummary() {
	canvas.clear("#cccccc");
	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
}

async function minigameBench() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	minigameBenchReset(); //set values, anti tampering
	await minigameBenchLoad();
	await minigameBenchMenu();
	await minigameBenchGame();
	await minigameBenchSummary();
	minigameBenchReset(); //cleanup intervals

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
