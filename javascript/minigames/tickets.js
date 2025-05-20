//TODO papers please-esque
//you have personal ID and ticket
//ticket from multiple parts - some may be fake or wrong

//generate custom rules on the fly

const CHECK_TICKET_REWARD = 20;
let ACTUAL_CHECK_TICKET_REWARD = -1;

const FARE_EVADER_REWARD = 100;
let ACTUAL_FARE_EVADER_REWARD = -1;

const REPEAT_CHECK_PENALTY = 20; //penalty for repeat checks
let ACTUAL_REPEAT_CHECK_PENALTY = -1;

const FARE_EVADER_FINE = 1500; //for final fare evader fine income

let ticketCounters = {
	time: 1200,
	checked: 0,
	correct: 0,
	wrong: 0,
	fareEvaders: 0,
	fareEvadersFineTotal: 0,
	cycleUntilStation: 0,
	speed: 0,
};

let ticketImages = {
	background: null,
	station: null,
	personM: null,
	personF: null,
	ticketBase: null,
	//TODO think of components
	ticketSeal: null,
	ticketSealFakes: [],
	ticketWatermark: null,
	ticketWatermarkFakes: [],
	ticketLogo: null,
	ticketLogoFakes: [],
};

//TODO make train move, after station (first is always station) speed up
//have 3 images, each switch is "cycle"
//amount of cycles until station - on change of cycle SFX 13

let ticketLoaded = false;

function minigameTicketsReset() {

}

async function minigameTicketsLoad() {
	if(ticketLoaded) { return; }

	ACTUAL_CHECK_TICKET_REWARD = Math.trunc(BENCH_REWARD*1.0/ui.settings.diff_multiplier);
	ACTUAL_FARE_EVADER_REWARD = Math.trunc(FARE_EVADER_REWARD*1.0/ui.settings.diff_multiplier);
	ACTUAL_REPEAT_CHECK_PENALTY = Math.trunc(REPEAT_CHECK_PENALTY*ui.settings.diff_multiplier);

	await loadMusic([12]);

	ticketImages.background = await loadImage("assets/minigames/ticket/wagon.png");
	ticketImages.station = await loadImage("assets/minigames/ticket/borislavka.png");
	
}

async function minigameTicketsMenu() {
	pauseHidden = true;

	canvas.clear("#404040");
	musicPlay(12);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(125), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");
	canvas.textM(wrapText(getTranslation(126), 90) /* TODO */ , 5, 18);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
}

function renderTicketMinigame() {
	canvas.clear("#ffffff");

	//draw train

	let w = ticketImages.background.naturalWidth;
	let h = ticketImages.background.naturalHeight;
	let s = canvas.canvas.height/h;

	canvas.image(ticketImages.background, canvas.canvas.width-w*s, 0, s);
}

async function minigameTicketsGame() {
	let endGamePromiseCompleted = false;

	let skipButton = ui.addVerySmallButton("skip", getTranslation(82), 50, 90, 30, 10, () => {
		ui.removeMoney(ui.getEarlyLeaveTimeMoney(ticketCounters.time/10));
		endGamePromiseCompleted = true;
	});
	document.getElementById("skip").setAttribute("disabled", "disabled");

	while(!endGamePromiseCompleted) {
		do {
			ticketCounters.time--;

			renderTicketMinigame();

			if(ticketCounters.time <= 0) {
				console.log("Time limit reached!");
				endGamePromiseCompleted = true;
				break;
			}

			await new Promise((resolve) => {
				setTimeout(() => { resolve(); }, 100);
			});
		}
		while(ui.info.paused);
	}

	ui.removeButton("skip");
}
async function minigameTicketsSummary() {

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
}

async function minigameTickets() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameTicketsLoad();
	await minigameTicketsMenu();
	await minigameTicketsGame();
	await minigameTicketsSummary();
	minigameTicketsReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
