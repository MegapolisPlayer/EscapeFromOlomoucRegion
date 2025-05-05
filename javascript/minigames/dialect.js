let dialectLoaded = false;
let dialectCounters = {
	time: 900, //tick every 100ms / 10tps
	correct: 0,
	incorrect: 0,
	total: 0,
	buttonValues: [],
	correctId: 0,
	timeCountdown: 0,
	lastCorrect: false,
	lastCorrectId: 0,
};

let dialectValues = [];
let dialectNonValues = [];

const CORRECT_TRANSLATION_REWARD = 10;
const WRONG_TRANSLATION_REWARD = 5;
const TIMEOUT = 1; //in seconds

function minigameDialectReset() {
	dialectCounters = {
		time: 900,
		correct: 0,
		incorrect: 0,
		total: 0,
		buttonValues: [],
		correctId: 0,
		timeCountdown: 0,
		lastCorrect: false,
		lastCorrectId: 0,
	};
}

const DIALECT_TIMEOUT = 20; //2s

async function minigameDialectLoad() {
	if(dialectLoaded) return;

	await loadMusic([14]);

	let code = "";
	switch(translationSelected) {
		case(0):
			code = "EN";
			break;
		case(1):
			code = "CZ";
			break;
		case(2):	
			code = "DE";
			break;
		case(3):	
			code = "PL";
			break;
		case(4):
			code = "BA";
			break;
		default:
			break;
	}

	let reqd = new XMLHttpRequest();
	let reqn = new XMLHttpRequest();

	await Promise.all([
		new Promise((resolve) => {
			reqd.open("GET", "/assets/minigames/dialect/dialect"+code+".txt", true);
			reqd.onload = () => {
				if(reqd.status != 200) {
					console.error("Error loading dialect file: "+reqd.status);
				}
				dialectValues = reqd.response.replace('\r\n', '\n').split('\n').filter(v => v.length != 0);
				resolve();
			};
			reqd.send(null);
		}),
		new Promise((resolve) => {
			reqn.open("GET", "/assets/minigames/dialect/non"+code+".txt", true);
			reqn.onload = () => {
				if(reqn.status != 200) {
					console.error("Error loading dialect file: "+reqd.status);
				}
				dialectNonValues = reqn.response.replace('\r\n', '\n').split('\n').filter(v => v.length != 0);
				resolve();
			};
			reqn.send(null);
		}),
	]);

	if(dialectValues.length != dialectNonValues.length) {
		console.error("Dialect values and non values have different lengths!", 
			"Dialect values: "+dialectValues.length,
			"Non values: "+dialectNonValues.length
		);
	}
	console.log(
		"Dialect values: ", dialectValues,
		"Non values: ", dialectNonValues
	);

	dialectLoaded = true;
}
async function minigameDialectMenu() {
	pauseHidden = true;

	canvas.clear("#cccccc");
	musicPlay(14);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(113), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");

	canvas.textM(wrapText(getTranslation(114)+" "+CORRECT_TRANSLATION_REWARD+" "+getTranslation(96)+" "+getTranslation(115)+" "+WRONG_TRANSLATION_REWARD+" "+getTranslation(96), 80), 5, 18);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
}

function renderDialectMinigame() {
	if(dialectCounters.timeCountdown > 0) {
		if(dialectCounters.lastCorrect) canvas.clear("#00aa00");
		else canvas.clear("#aa0000");
	}
	else canvas.clear("#cccccc");

	canvas.setColor("#ffffff").drawBox(0, 0, 100, 10);
	canvas.setColor("#000080").setSmallFontSize().setFontWeight("normal");

	//ui bar

	canvas.textS(getTranslation(118)+": "+dialectCounters.correct, 10, 7);
	canvas.textS(getTranslation(119)+": "+dialectCounters.incorrect, 40, 7);

	//time
	let minutes = Math.trunc(Math.trunc(dialectCounters.time/10)/60);
	let seconds = Math.trunc(Math.trunc(dialectCounters.time/10)%60);
	let timeStr = (minutes != 0) ? String(minutes)+":"+String(seconds).padStart(2, "0") : String(seconds)+"s";
	canvas.textS(getTranslation(79)+": "+timeStr, 70, 7);

	//question
	canvas.setColor("#ffffff").drawRoundedBox(10, 15, 80, 20, 10);
	canvas.setColor("#000080").setFontWeight("bold").textM(wrapText(getTranslation(117)+" \""+String(dialectValues[dialectCounters.correctId])+"\"?", 60), 12, 22);

	if(dialectCounters.timeCountdown > 0) {
		if(dialectCounters.lastCorrect) canvas.setColor("#00aa00").textS(getTranslation(123)+" \""+String(dialectValues[dialectCounters.lastCorrectId])+"\" "+getTranslation(124)+String(dialectNonValues[dialectCounters.lastCorrectId]), 12, 32);
		else canvas.setColor("#aa0000").textS(getTranslation(123)+" \""+String(dialectValues[dialectCounters.lastCorrectId])+"\" "+getTranslation(124)+String(dialectNonValues[dialectCounters.lastCorrectId]), 12, 32);
	}
}

function dialectMinigameNext(buttonId) {
	//time penalty
	if(dialectCounters.timeCountdown != 0 && !dialectCounters.lastCorrect) return;

	//skip if first init (buttonid is 0)
	if(buttonId !== 0) {
		//check if correct
		if(dialectCounters.correctId === dialectCounters.buttonValues[buttonId-1]) {
			dialectCounters.correct++;
			dialectCounters.lastCorrect = true;
			sfxPlay(3);
		}
		else {
			dialectCounters.incorrect++;
			dialectCounters.lastCorrect = false;
			sfxPlay(4);

			document.getElementById("a1").setAttribute("disabled", "disabled");
			document.getElementById("a2").setAttribute("disabled", "disabled");
			document.getElementById("a3").setAttribute("disabled", "disabled");
			document.getElementById("a4").setAttribute("disabled", "disabled");
		}
		dialectCounters.total++;
		dialectCounters.lastCorrectId = dialectCounters.correctId;
		dialectCounters.timeCountdown = DIALECT_TIMEOUT;
	}
	
	//generate random values of button ids and pick one of them as correct
	dialectCounters.buttonValues.length = 0;
	let buttonWords = [];
	for(let i = 0; i < 4; i++) {
		let id;
		let word; //check by word - multiple ids may have same
		do {
			id = Math.trunc(Math.random()*dialectValues.length);
			word = dialectNonValues[id];
		}
		while(buttonWords.indexOf(word) != -1); //unique
		dialectCounters.buttonValues.push(id);
		buttonWords.push(dialectNonValues[id]);
	}
	let correctLocal = Math.trunc(Math.random()*dialectCounters.buttonValues.length);
	dialectCounters.correctId = dialectCounters.buttonValues[correctLocal];

	//set the buttons
	for(let i = 0; i < dialectCounters.buttonValues.length; i++) {
		document.getElementById("a"+String(i+1)).innerHTML = buttonWords[i];
	}

	//set the question
	renderDialectMinigame(dialectCounters.correctId);
}

async function minigameDialectGame() {
	let endGamePromiseCompleted = false;

	let skipButton = ui.addVerySmallButton("skip", getTranslation(82), 30, 85, 40, 15, () => {
		ui.removeMoney(ui.getEarlyLeaveTimeMoney(dialectCounters.time/10));
		endGamePromiseCompleted = true;
	});
	document.getElementById("skip").setAttribute("disabled", "disabled");

	//answer buttons
	ui.addButton("a1", "", 20, 40, 30, 20, () =>{});
	ui.addButton("a2", "", 50, 40, 30, 20, () =>{});
	ui.addButton("a3", "", 20, 60, 30, 20, () =>{});
	ui.addButton("a4", "", 50, 60, 30, 20, () =>{});

	//answer button click handlers
	document.getElementById("a1").onclick = () => { dialectMinigameNext(1); };
	document.getElementById("a2").onclick = () => { dialectMinigameNext(2); };
	document.getElementById("a3").onclick = () => { dialectMinigameNext(3); };
	document.getElementById("a4").onclick = () => { dialectMinigameNext(4); };

	dialectMinigameNext(0);

	//main loop

	while(!endGamePromiseCompleted) {
		dialectCounters.time--;

		renderDialectMinigame();
		
		if(dialectCounters.timeCountdown > 0)
			dialectCounters.timeCountdown--;
		else {
			//remove disabled attributes
			document.getElementById("a1").removeAttribute("disabled");
			document.getElementById("a2").removeAttribute("disabled");
			document.getElementById("a3").removeAttribute("disabled");
			document.getElementById("a4").removeAttribute("disabled");
		}
		
		let MoneyAmount = ui.getEarlyLeaveTimeMoney(fishCounters.time/40);
		if(ui.info.money>=MoneyAmount) {
			document.getElementById("skip").removeAttribute("disabled");
			document.getElementById("skip").innerHTML = getTranslation(80)+" "+MoneyAmount;
		}
		else {
			document.getElementById("skip").setAttribute("disabled", "disabled");
			document.getElementById("skip").innerHTML = getTranslation(82)+"<br>"+MoneyAmount+" "+getTranslation(83)+", "+getTranslation(84)+" "+ui.info.money;
		}		

		if(dialectCounters.time <= 0) {
			console.log("Time limit reached!");
			endGamePromiseCompleted = true;
			break;
		}

		do {
			await new Promise((resolve) => {
				setTimeout(() => { resolve(); }, 100);
			});
		}
		while(ui.info.paused);
	}

	ui.removeButton("skip");
	ui.removeButton("a1");
	ui.removeButton("a2");
	ui.removeButton("a3");
	ui.removeButton("a4");
}
async function minigameDialectSummary() {
	canvas.clear("#cccccc");
	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");

	canvas.textS(getTranslation(60), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");

	canvas.textS(getTranslation(117), 10, 20).textS(dialectCounters.correct, 80, 20);
	canvas.textS(getTranslation(118), 10, 30).textS(dialectCounters.incorrect, 80, 30);
	canvas.textS(getTranslation(119), 10, 40).textS(Math.trunc(dialectCounters.correct/dialectCounters.total*100), 80, 40);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {
		pauseHidden = false;
		musicPause();
	}));
}

async function minigameDialect() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameDialectLoad();
	await minigameDialectMenu();
	await minigameDialectGame();
	await minigameDialectSummary();
	minigameDialectReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
