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

const MAX_SPEED = 50;
const STATION_ARRIVE_SPEED = 20;

const STATION_TIME_TICKS = 2*8;

class Ticket {
	redStripeAmount = 2; //normally 2 red stripes, may be 1 or 3
	name = ""; //name and surname can mismatch
	validUntil = null; //valid until date - check for today!
	logoId = 0; //logo id - id 0 is correct, 1 and 2 are fakes
	watermarkId = 0; //watermark id - id 0 is correct, 1 and 2 are fakes
	wrongPaper = false; //is the paper *itself* fake?

	isFake = false; //is the ticket fake: calculate immediately for optimization's sake

	constructor(passenger, fake) {
		this.isFake = Math.trunc(Math.random()*2);

		if(this.isFake) {

		}
		else {
			this.name = passenger.name;
			this.validUntil = new Date(); //valid until 3 hours to 3 days in the future
		}
	}
};

class TicketPassenger {
	exitIn = 0;
	ticket = null;
	name = "";
	checked = false;

	constructor() {
		this.exitIn = Math.trunc(Math.random()*4+1); //1-5 stations
		this.name = getRandomName();
		this.checked = false;

		this.ticket = new Ticket(this, Math.trunc(Math.random()*2));
	}
};

let ticketCounters = {
	time: 1200,
	checked: 0,
	correct: 0,
	wrong: 0,
	fareEvaders: 0,
	fareEvadersFineTotal: 0,
	cycleUntilStation: 0,
	speed: 50, //TODO
	offset: 0,
	passedStation: false,
	stationTime: -1,
	passengers: [],
};

let ticketImages = {
	wagon: null,
	tunnel: null,
	station: null,
	station2: null,
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

	ticketImages.wagon = await loadImage("assets/minigames/ticket/wagon.png");
	ticketImages.tunnel = await loadImage("assets/minigames/ticket/tunnel.png");
	ticketImages.station = await loadImage("assets/minigames/ticket/borislavka.png");
	ticketImages.station2 = await loadImage("assets/minigames/ticket/mustek.png");
	
	if(
		ticketImages.wagon.naturalHeight != ticketImages.station.naturalHeight &&
		ticketImages.wagon.naturalHeight != ticketImages.tunnel.naturalHeight &&
		ticketImages.wagon.naturalHeight != ticketImages.station2.naturalHeight
	) {
		console.error("Image sizes do not match!");
		return;
	}
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

	//background and vehicle images should be same size
	let w = ticketImages.wagon.naturalWidth;
	let h = ticketImages.wagon.naturalHeight;
	let s = canvas.canvas.width/w;

	//draw background
	//2 images of background - movement

	if(ticketCounters.cycleUntilStation === 0 || ticketCounters.passedStation) {
		canvas.image(ticketImages.station, ticketCounters.offset, 100-(h/canvas.canvas.height*100)*s, s);
	}
	else {
		canvas.image(ticketImages.tunnel, ticketCounters.offset, 100-(h/canvas.canvas.height*100)*s, s);
	}

	//when arriving to station -> cycleUntil station smaller than 2
	//	-> extra image
	if(ticketCounters.cycleUntilStation === 1) {
		canvas.image(ticketImages.station, ticketCounters.offset-100, 100-(h/canvas.canvas.height*100)*s, s);
	}
	else {
		canvas.image(ticketImages.tunnel, ticketCounters.offset-100, 100-(h/canvas.canvas.height*100)*s, s);
	}

	//draw vehicle
	canvas.image(ticketImages.wagon, 0, 100-(h/canvas.canvas.height*100)*s, s);
}

async function minigameTicketsGame() {
	let endGamePromiseCompleted = false;

	let skipButton = ui.addVerySmallButton("skip", getTranslation(82), 50, 90, 30, 10, () => {
		ui.removeMoney(ui.getEarlyLeaveTimeMoney(ticketCounters.time/10));
		endGamePromiseCompleted = true;
	});
	document.getElementById("skip").setAttribute("disabled", "disabled");

	let moveInterval = window.setInterval(() => {

		if(ticketCounters.cycleUntilStation <= 2) {
			if(ticketCounters.cycleUntilStation <= 0) {
				if(ticketCounters.speed > 0.0) ticketCounters.speed -= 0.5;
				else ticketCounters.speed = 0;
			}
			else {
				if(ticketCounters.speed < STATION_ARRIVE_SPEED) ticketCounters.speed = STATION_ARRIVE_SPEED;
				else ticketCounters.speed -= 0.5;
			}
		}
		else if(ticketCounters.speed < MAX_SPEED) {
			ticketCounters.speed += 0.5;
		}
		else {
			ticketCounters.speed = MAX_SPEED;
		}

		ticketCounters.offset += ticketCounters.speed/8/10;

		if(ticketCounters.offset > 100) {
			ticketCounters.offset = 0;

			ticketCounters.cycleUntilStation--;
			console.log("Cycle until station: ", ticketCounters.cycleUntilStation);
			sfxPlayQuiet(13);
			ticketCounters.passedStation = false;
		}

		renderTicketMinigame();

		if(ticketCounters.cycleUntilStation === 0 && ticketCounters.speed <= 0 && ticketCounters.stationTime === -1) { 
			ticketCounters.passedStation = true;
			ticketCounters.stationTime = STATION_TIME_TICKS;
			console.log("Arrived In station - ", ticketCounters.stationTime);
		}
		else if(ticketCounters.stationTime === 0) {
			ticketCounters.stationTime = -1;
			ticketCounters.cycleUntilStation = Math.trunc(Math.random()*10+5); //5 to 15 cycles between stations
			console.log("Departing");
		}
		else if(ticketCounters.stationTime > 0) {
			ticketCounters.stationTime -= 1;
			console.log("In station - ", ticketCounters.stationTime);
		}
	}, 12.5);

	while(!endGamePromiseCompleted) {
		do {
			ticketCounters.time--;

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

	window.clearInterval(moveInterval);
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
