const BENCH_TOWEL_SIZE_X = 2;
const BENCH_TOWEL_SIZE_Y = 20;

const BENCH_REWARD = 80;
const BENCH_PARTIAL_REWARD = 30;
let ACTUAL_BENCH_REWARD = 0;
let ACTUAL_BENCH_PARTIAL_REWARD = 0;
const BENCH_PERCENTAGE_LIMIT = 80; //above this the partial reward is given

let benchLoaded = false;
let benchCounters = {
	benchId: 0,
	time: 90*40,
	color: "#cccccc",
	dirt: [],
	mousex: 0,
	mousey: 0,
};
const BENCH_TOTAL_DIRT = 2500;

//TODO add touch support
let benchIsTouch = false;

const BENCH_DIRT_COLORS = ["#231705", "#3f3525", "#3f3e3d"];
const BENCH_DIRT_SIZE = 1;

class DirtData { 
	x = 0;
	y = 0;
	color = "";

	constructor() {
		this.x = Math.random()*96+2;
		this.y = Math.random()*88+11;
		this.color = BENCH_DIRT_COLORS[Math.trunc(Math.random()*BENCH_DIRT_COLORS.length)];
	}

	draw() {
		canvas.setColor(this.color).drawBox(this.x-BENCH_DIRT_SIZE/2, this.y-BENCH_DIRT_SIZE/2, BENCH_DIRT_SIZE, canvas.convertXtoY(BENCH_DIRT_SIZE));
	}

	isTouchingTowel(bx, by) {
		if(
			this.x+BENCH_DIRT_SIZE/2 <= bx+BENCH_TOWEL_SIZE_X/2 &&
			this.x-BENCH_DIRT_SIZE/2 >= bx-BENCH_TOWEL_SIZE_X/2 &&
			this.y+BENCH_DIRT_SIZE/2 <= by+BENCH_TOWEL_SIZE_Y/2 &&
			this.y-BENCH_DIRT_SIZE/2 >= by-BENCH_TOWEL_SIZE_Y/2
		) { return true; }
		return false;
	}
}

function minigameBenchMouseUpdate(event) {
	let box = canvas.canvas.getBoundingClientRect();
	benchCounters.mousex = (event.clientX-box.x)/box.width*100;
	benchCounters.mousey = (event.clientY-box.y)/box.height*100;
}

function minigameBenchReset() {
	benchCounters = {
		benchId: 0,
		time: 90*40,
		color: "#cccccc",
		dirt: [],
		mousex: 0,
		mousey: 0,
	};
}

async function minigameBenchLoad() {
	benchIsTouch = window.matchMedia("(any-hover: none)").matches;

	if(benchLoaded) return;

	ACTUAL_BENCH_REWARD = Math.trunc(BENCH_REWARD*ui.settings.diff_multiplier);
	ACTUAL_BENCH_PARTIAL_REWARD = Math.trunc(BENCH_PARTIAL_REWARD*ui.settings.diff_multiplier);

	await loadMusic([16]);
	window.addEventListener("mousemove", minigameBenchMouseUpdate);

	//no images or player

	benchLoaded = true;
}

async function minigameBenchMenu() {
	pauseHidden = true;

	canvas.clear("#cccccc");
	musicPlay(11);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(133), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");

	canvas.textM(wrapText(getTranslation(134)+" "+ACTUAL_BENCH_REWARD+" "+getTranslation(96)+" "+getTranslation(135)+" "+ACTUAL_BENCH_PARTIAL_REWARD+" "+getTranslation(96), 80), 5, 18);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
}

function renderBenchMinigame() {
	canvas.clear(benchCounters.color);

	canvas.setColor("#ffffff").drawBox(0, 0, 100, 10).setColor("#000080").setSmallFontSize();
	canvas.textS(getTranslation(136)+" "+String(benchCounters.benchId+1), 10, 7);

	canvas.textS(getTranslation(137)+": "+String(benchCounters.percentage)+"%", 30, 7);

	let minutes = Math.trunc(Math.trunc(benchCounters.time/40)/60);
	let seconds = Math.trunc(Math.trunc(benchCounters.time/40)%60);
	let timeStr = (minutes != 0) ? String(minutes)+":"+String(seconds).padStart(2, "0") : String(seconds)+"s";
	canvas.textS(getTranslation(79)+": "+timeStr, 50, 7);

	for(let i = benchCounters.dirt.length-1; i >= 0; i--) {
		if(benchCounters.dirt[i].isTouchingTowel(benchCounters.mousex, benchCounters.mousey)) {
			benchCounters.dirt.splice(i,1);
		}
		else {
			benchCounters.dirt[i].draw();
		}
	}

	//draw our towel
	canvas.setColor("#ddcc00").drawBox(
		benchCounters.mousex-(BENCH_TOWEL_SIZE_X/2),
		benchCounters.mousey-(BENCH_TOWEL_SIZE_Y/2),
		BENCH_TOWEL_SIZE_X,
		BENCH_TOWEL_SIZE_Y
	);
}

async function minigameBenchGame() {
	for(let i = 0; i < BENCH_TOTAL_DIRT; i++) {
		benchCounters.dirt.push(new DirtData());
	}

	let endGamePromiseCompleted = false;
	let skipButton = ui.addVerySmallButton("skip", getTranslation(82), 80, 0, 20, 10, () => {
		ui.removeMoney(ui.getEarlyLeaveTimeMoney(benchCounters.time/40));
		endGamePromiseCompleted = true;
	});
	document.getElementById("skip").setAttribute("disabled", "disabled");

	let cleanInt = window.setInterval(() => {
		for(let i = benchCounters.dirt.length-1; i >= 0; i--) {
			if(benchCounters.dirt[i].isTouchingTowel(benchCounters.mousex, benchCounters.mousey)) {
				benchCounters.dirt.splice(i,1);
			}
		}
	}, 5);

	while(!endGamePromiseCompleted) {
		benchCounters.time--;

		benchCounters.percentage = 100-(benchCounters.dirt.length/BENCH_TOTAL_DIRT*100).toFixed(); 

		if(benchCounters.percentage > 99.7) {
			//go to next surface
			benchCounters.color = "rgba("+127+Math.random()*128+", "+127+Math.random()*128+", "+127+Math.random()*128+", 255)";
			for(let i = 0; i < BENCH_TOTAL_DIRT; i++) {
				benchCounters.dirt.push(new DirtData());
			}
			benchCounters.benchId++;
			benchCounters.percentage = 100;
			ui.addMoney(ACTUAL_BENCH_REWARD);
		}

		renderBenchMinigame();

		let MoneyAmount = ui.getEarlyLeaveTimeMoney(benchCounters.time/40);
		if(ui.info.money>=MoneyAmount) {
			document.getElementById("skip").removeAttribute("disabled");
			document.getElementById("skip").innerHTML = getTranslation(80)+" "+MoneyAmount;
		}
		else {
			document.getElementById("skip").setAttribute("disabled", "disabled");
			document.getElementById("skip").innerHTML = getTranslation(82)+"<br>"+MoneyAmount+" "+getTranslation(83)+", "+getTranslation(84)+" "+ui.info.money;
		}

		if(benchCounters.time <= 0) {
			console.log("Time limit reached!");
			endGamePromiseCompleted = true;
			break;
		}

		do {
			await new Promise((resolve) => {
				setTimeout(() => { resolve(); }, 25);
			});  
		}
		while(ui.info.paused);
	}

	window.clearInterval(cleanInt);

	if(benchCounters.percentage >= BENCH_PERCENTAGE_LIMIT) {
		ui.addMoney(ACTUAL_BENCH_PARTIAL_REWARD);
	}
}
async function minigameBenchSummary() {
	canvas.clear("#cccccc");
	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	
	canvas.textS(getTranslation(60), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");

	canvas.textS(getTranslation(138), 10, 20).textS(benchCounters.benchId, 80, 20);
	if(benchCounters.percentage >= BENCH_PERCENTAGE_LIMIT) {
		canvas.textS(getTranslation(139), 10, 30);
	}

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {
		pauseHidden = false;
		musicPause();
	}));
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
