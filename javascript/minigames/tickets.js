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

function addGrammarMistakes(name) {
	let canUseRandom = false;
	//change some letters
	return name.split('').map((v, i, a) => {
		if(Math.random() < 0.1 || !canUseRandom) {
			canUseRandom = true;
			switch(v) {
				case('p'): return 'b';
				case('b'): return 'p';
				case('t'): return 'd';
				case('d'): return 't';
				case('k'): return 'g';
				case('g'): return 'k';
				case('s'): return 'z';
				case('z'): return 's';
				case('f'): return 'v';
				case('v'): return 'f';
				case('h'): return 'g';
				case('m'): return 'n';
				case('n'): return 'm';
				default: 
					canUseRandom = false;
					return v;
			}
		}
		return v;
	}).join('');
}

class Ticket {
	redStripeAmount = 2; //normally 2 red stripes, may be 1 or 3
	name = ""; //name and surname can mismatch
	validUntil = null; //valid until date - check for today!
	logoId = 0; //logo id - id 0 is correct, 1 and 2 are fakes
	watermarkId = 0; //watermark id - id 0 is correct, 1 and 2 are fakes
	wrongPaper = false; //is the paper *itself* fake?

	isFake = false; //is the ticket fake: calculate immediately for optimization's sake

	constructor(passenger) {
		this.isFake = Math.trunc(Math.random()*2);
		this.name = passenger.name;

		if(this.isFake) {
			//6 possible fake components - 2 are always wrong

			let amountWrong = Math.trunc(Math.random()*4)+2; //2-6 wrong components
			let wrongComponents = [];

			for(let i = 0; i < amountWrong; i++) {
				let component;
				do component = Math.trunc(Math.random()*6);
				while(wrongComponents.includes(component));
				wrongComponents.push(component);
			}

			for(let c of wrongComponents) {
				switch(c) {
					case(0):
						this.redStripeAmount = Math.trunc(Math.random()*3)+1; //1-3 stripes
						break;
					case(1):
						this.name = addGrammarMistakes(passenger.name);
						break;
					case(2):
						this.validUntil = (Date.now()-1000*60*60*24*365)+Math.trunc(Math.random()*(1000*60*60*24*360)); //from last year
						break;
					case(3):
						this.logoId = Math.trunc(Math.random()*2)+1; //fake logos id 1,2
						break;
					case(4):
						this.watermarkId = Math.trunc(Math.random()*2)+1; //fake watermark id 1,2
						break;
					case(5):
						this.wrongPaper = Math.trunc(Math.random()*2) === 1; //wrong paper
						break;
				}
			}
		}
		else {
			let start = Date.now() + 1000*60*60*3; //3 hours in ms
			let end = start + Math.trunc(Math.random()*1000*60*60*69); //3+69 hours in ms
			this.validUntil = start + Math.random() * (end - start);  //valid until 3 hours to 3 days in the future
			this.logoId = 0;
			this.watermarkId = 0;
			this.wrongPaper = false;
		}
	}

	draw(xtop, ytop, xsize, ysize) {
		if(this.wrongPaper) {
			canvas.setColor("#999999").drawBox(xtop, ytop, xsize, ysize);
		}
		else {
			canvas.setColor("#ffffff").drawRoundedBox(xtop, ytop, xsize, ysize, 10);
		}

		//stripes
		for(let i = 0; i < this.redStripeAmount; i++) {
			canvas.setColor("#ff0000").drawBox(xtop+xsize*(0.7+i*0.1), ytop, xsize*0.05, ysize);
		}

		//logo
		canvas.imageDest(
			this.logoId === 0 ? ticketImages.ticketLogo : ticketImages.ticketLogoFakes[this.logoId-1], 
			xtop+xsize*0.1, ytop+ysize*0.1, xsize*0.4, ysize*0.4
		);
		//note
		canvas.setColor("#000000").setFontWeight("normal").setFontSize(ysize*0.5).textM(
			wrapText(getTranslation(197), xsize*0.4), xtop+xsize*0.5, ytop+ysize*0.3
		);

		//name
		canvas.setColor("#000000").setFontWeight("bold").setFontSize(ysize*0.4).textS(this.name, xtop+xsize*0.1, ytop+ysize*0.6);
		//valid until
		canvas.setColor("#000000").setFontWeight("normal").setFontSize(ysize*0.4).textS(getTranslation(159)+" "+new Date(this.validUntil).toDateString(), xtop+xsize*0.1, ytop+ysize*0.7);
	
		//watermark
		canvas.setAlpha(0.2).imageDest(
			this.watermarkId === 0 ? ticketImages.watermark : ticketImages.watermarkFakes[this.watermarkId-1],
			xtop+xsize*0.0, ytop+ysize*0.7, xsize*0.3, ysize*0.3
		).resetAlpha();
	}
};

class TicketPassenger {
	stationsRemaining = 0;
	ticket = null;
	name = "";
	checked = false;
	button = null;
	x = 0;
	y = 0;
	hidden = false;
	justEntered = false;

	constructor() {
		this.stationsRemaining = Math.trunc(Math.random()*2+1); //1-3 stations
		this.name = getRandomName();
		this.checked = false;
		this.justEntered = true;

		this.ticket = new Ticket(this, Math.trunc(Math.random()*2));
	}

	draw() {
		if(justEntered) {
			canvas.setColor("#000000");
		}
		else {
			canvas.setColor("#800000");
		}
		canvas.drawCircle(this.x, this.y, 5);
	}

	moveTo(x, y) {
		this.x = x;
		this.y = y;
	}
	hide() {
		this.hidden = true;
	}
	show() {
		this.hidden = false;
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
	speed: 50,
	offset: 0,
	passedStation: false,
	stationTime: -1,
	passengersAtStation: 0,
	passengers: [],
	generatedPassengers: false,
	vehiclePlaces: [],
	vehicleCapacity: -1,
};

let ticketImages = {
	wagon: null,
	tunnel: null,
	station: null,
	station2: null,
	personM: null,
	personF: null,
	ticketLogo: null,
	ticketLogoFakes: [],
	watermark: null,
	watermarkFakes: [],
};

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

	ticketImages.ticketLogo = await loadImage("assets/minigames/ticket/logo.png");
	for(let i = 0; i < 2; i++) {
		ticketImages.ticketLogoFakes.push(await loadImage("assets/minigames/ticket/logof"+Number(i+1)+".png"));
	}

	ticketImages.watermark = await loadImage("assets/minigames/ticket/watermark.png");
	for(let i = 0; i < 2; i++) {
		ticketImages.watermarkFakes.push(await loadImage("assets/minigames/ticket/watermarkf"+Number(i+1)+".png"));
	}

	let t = new XMLHttpRequest();
	await new Promise((resolve) => {
		t.open("GET", "assets/minigames/ticket/wagonLocations.txt", true);
		t.onload = () => {
			if(t.status != 200) {
				console.error("Error loading wagon,location file: "+t.status);
			}
			let lines = t.response.replace('\r\n', '\n').split('\n').filter(v => !(v.length === 0 || v[0] === "#"));
			for(let l of lines) {
				let values = l.split(' ').filter(v => v.length != 0).map(v => Number(v));
				ticketCounters.vehiclePlaces.push({
					empty: true,
					coords: values
				});
			}
			resolve();
		};
		t.send(null);
	});

	ticketCounters.vehicleCapacity = ticketCounters.vehiclePlaces.length;

}

async function minigameTicketsMenu() {
	pauseHidden = true;

	canvas.clear("#404040");
	musicPlay(12);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(125), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");
	canvas.textM(wrapText(
		getTranslation(126)+" "+ACTUAL_FARE_EVADER_REWARD+" "+getTranslation(127)+" "+ACTUAL_CHECK_TICKET_REWARD+" "+getTranslation(128)+" "+ACTUAL_REPEAT_CHECK_PENALTY+" "+getTranslation(129),
		90), 5, 18);

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

	//passengers
	for(let p of ticketCounters.passengers) {
		p.draw();
	}

	//ui bar
	canvas.setColor("#ffffff").drawBox(0, 0, 100, 10);
	canvas.setColor("#000080").setSmallFontSize().setFontWeight("normal");

	canvas.textS(getTranslation(130)+": "+ticketCounters.correct, 5, 7);
	canvas.textS(getTranslation(131)+": "+ticketCounters.wrong, 30, 7);

	let minutes = Math.trunc(Math.trunc(ticketCounters.time/10)/60);
	let seconds = Math.trunc(Math.trunc(ticketCounters.time/10)%60);
	let timeStr = (minutes != 0) ? String(minutes)+":"+String(seconds).padStart(2, "0") : String(seconds)+"s";
	canvas.textS(getTranslation(79)+": "+timeStr, 55, 7);
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
			if(!ticketCounters.generatedPassengers) {
				ticketCounters.generatedPassengers = true;
			}

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

			//new passengers
			passengersAtStation = Math.random()*(ticketCounters.vehicleCapacity-ticketCounters.passengers.length);

			//sum of new passengers at station and the ones leaving
			ticketCounters.stationTime = 
				ticketCounters.passengers.filter(v => v.stationsRemaining === 0).length+
				passengersAtStation
			;
			console.log("Arrived In station - ", ticketCounters.stationTime);

			for(let p of ticketCounters.passengers) {
				p.stationsRemaining--;
				p.justEntered = false;
				if(p.stationsRemaining === 0) {
					ticketCounters.passengers.splice(ticketCounters.passengers.indexOf(p), 1);
				}
			}
		}
		else if(ticketCounters.stationTime === 0) {
			ticketCounters.stationTime = -1;
			ticketCounters.cycleUntilStation = Math.trunc(Math.random()*10+5); //5 to 15 cycles between stations
			console.log("Departing");
		}
		else if(ticketCounters.stationTime > 0) {
			ticketCounters.stationTime -= 1;
			console.log("In station - ", ticketCounters.stationTime);

			//remove 1 who exits at station

			//generate new passenger
			ticketCounters.passengers.push(new TicketPassenger());
			ticketCounters.passengers[ticketCounters.passengers.length-1].moveTo(
				ticketCounters.vehiclePlaces[ticketCounters.passengers.length-1][0],
			);
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
	canvas.clear("#404040");
	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");

	canvas.textS(getTranslation(60), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");
	canvas.textS(getTranslation(130), 10, 20).textS(ticketCounters.correct, 80, 20);
	canvas.textS(getTranslation(131), 10, 30).textS(ticketCounters.wrong, 80, 30);
	canvas.textS(getTranslation(132), 10, 40).textS(ticketCounters.fareEvadersFineTotal, 80, 40);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
}

async function minigameTickets() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	minigameTicketsReset();
	await minigameTicketsLoad();
	await minigameTicketsMenu();
	await minigameTicketsGame();
	await minigameTicketsSummary();
	minigameTicketsReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
