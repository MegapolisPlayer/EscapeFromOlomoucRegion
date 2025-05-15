//minigame in Nezamyslice
//helper at station
//map game (direction)

let maphelpCounters = {
	time: 1200,
	correct: 0,
	incorrect: 0,
	currentCity: -1,
	lastCorrect: false,
	lastCorrectId: -1,
	timeCountdown: 0,
};

const CITY_RADIUS = 1;
const CITY_TIMEOUT = 30; //30s

const CITY_REWARD = 50;
let ACTUAL_CITY_REWARD = -1;
const CITY_LOSS = 20;
let ACTUAL_CITY_LOSS = -1;

let maphelpLoaded = false;

let maphelpImage = {
	element: null,
	elementSplit: null,
	imgWidth: 0,
	imgHeight: 0,
	imgScale: 0,
	imgLeft: 0,
	imgTop: 0,
};

let maphelpCities = [];

class MapCity {
	name = 0;
	button;
	canvasX;
	canvasY;
	id;

	constructor(name, x, y, left, top, imgx, imgy, imgs) {
		this.name = name;
		
		this.canvasX = left+((x/imgx)*(imgx*imgs/canvas.canvas.width*100));
		this.canvasY = top+((y/imgy)*(imgy*imgs/canvas.canvas.height*100));

		this.id = maphelpCities.length; //first constructed then pushed

		this.button = ui.makeButton("city"+String(this.id), "", "draw_input_elem_arrow",
		canvas.getX(this.canvasX-CITY_RADIUS), canvas.getY(this.canvasY-CITY_RADIUS),
		canvas.getX(CITY_RADIUS*2), canvas.getY(canvas.convertXtoY(CITY_RADIUS*2)),
		(e) => { maphelpMinigameNext(e); } //click handler
		);
	}

	//pass top left in canvas coords (0-100)
	//size of image in pixels
	draw() {
		//draw circle
		//offset + (percentage in image * image size in canvas)
		canvas.drawCircle(
			this.canvasX, this.canvasY,	CITY_RADIUS
		);
		//canvas.textS(this.name, this.canvasX+2, this.canvasY);
	}

	destroyHandler() {
		ui.removeButton(id);
	}
}

function minigameMaphelpReset() {
	maphelpCounters = {
		time: 1200,
		correct: 0,
		incorrect: 0,
		currentCity: -1,
		lastCorrect: false,
		lastCorrectId: -1,
		timeCountdown: 0,
	};
	for(let c of maphelpCities) {
		c.destroyHandler();
	}
	maphelpCities.length = 0;
}

async function minigameMaphelpLoad() {
	if(maphelpLoaded) return;

	ACTUAL_CITY_REWARD = Math.trunc(CITY_REWARD*(1.0/ui.settings.diff_multiplier));

	await loadMusic([13]);

	//load map
	let path = "/assets/minigames/maphelp/";
	switch(translationSelected) {
		case(0):
			path += "uk";
			break;
		case(1):
		case(4):
			//for bastina too
			path += "cesko";
			break;
		case(2):
			path += "deutschland";
			break;
		case(3):
			path += "polska";
			break;
	}

	maphelpImage.element = await loadImage(path+".png");

	maphelpImage.imgWidth = maphelpImage.element.naturalWidth;
	maphelpImage.imgHeight = maphelpImage.element.naturalHeight;

	//split image and draw side by side
	if(maphelpImage.imgHeight >= maphelpImage.imgWidth) {
		//TODO
	}

	maphelpImage.imgScale = canvas.canvas.height*0.8/maphelpImage.imgHeight;
	maphelpImage.imgLeft = 50-(maphelpImage.imgWidth*maphelpImage.imgScale/canvas.canvas.width*100/2);
	maphelpImage.imgTop = 10;

	//load cities
	let t = new XMLHttpRequest();
	await new Promise((resolve) => {
		t.open("GET", path+".txt", true);
		t.onload = () => {
			if(t.status != 200) {
				console.error("Error loading location file: "+t.status);
			}
			let lines = t.response.replace('\r\n', '\n').split('\n').filter(v => v.length != 0);
			for(let l of lines) {
				let values = l.split(',');
				maphelpCities.push(
					new MapCity(
						values[0], Number(values[1]), Number(values[2]),
						maphelpImage.imgLeft, maphelpImage.imgTop,
						maphelpImage.imgWidth, maphelpImage.imgHeight,
						maphelpImage.imgScale
					)
				);
			}
			resolve();
		};
		t.send(null);
	});

	maphelpLoaded = true;

	console.log(maphelpCities);
}

async function minigameMaphelpMenu() {
	pauseHidden = true;

	canvas.clear("#00aa00");
	musicPlay(13);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(181), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");
	canvas.textM(wrapText(getTranslation(182)+" "+getTranslation(183)+" "+ACTUAL_CITY_REWARD+" "+getTranslation(96)+" "+getTranslation(183)+" "+ACTUAL_CITY_LOSS+" "+getTranslation(96), 90), 5, 18);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
}

function maphelpMinigameNext(event) {
	//time penalty
	if(maphelpCounters.timeCountdown != 0 && !maphelpCounters.lastCorrect) return;

	let cityId = null;

	//skip if first init (buttonid is 0)
	if(event !== 0) {
		cityId = Number(event.target.id.replace("city", "")); //get array id from button id

		//check if correct
		if(maphelpCounters.currentCity === cityId) {
			maphelpCounters.correct++;
			maphelpCounters.lastCorrect = true;
			sfxPlay(3);
			ui.addMoney(ACTUAL_CITY_REWARD);
		}
		else {
			maphelpCounters.incorrect++;
			maphelpCounters.lastCorrect = false;
			sfxPlay(4);
			ui.removeMoney(ACTUAL_CITY_LOSS);

			for(let c of maphelpCities) {
				c.button.setAttribute("disabled", "disabled");
			}
		}
		maphelpCounters.total++;
		maphelpCounters.lastCorrectId = maphelpCounters.currentCity;
		maphelpCounters.timeCountdown = CITY_TIMEOUT;

		//generate new city, different from old one
		do {
			maphelpCounters.currentCity = Math.trunc(Math.random()*maphelpCities.length);
		}
		while(maphelpCounters.currentCity === maphelpCounters.lastCorrectId);
	}
	else {
		//any city
		maphelpCounters.currentCity = Math.trunc(Math.random()*maphelpCities.length);
	}

	//rerender question
	renderMaphelpMinigame();
}

function renderMaphelpMinigame() {
	if(maphelpCounters.timeCountdown > 0) {
		if(maphelpCounters.lastCorrect) canvas.clear("#00ff00");
		else canvas.clear("#aa0000");
	}
	else canvas.clear("#00aa00");

	//ui bar
	canvas.setColor("#ffffff").drawBox(0, 0, 100, 10);
	canvas.setColor("#000080").setSmallFontSize().setFontWeight("normal");

	canvas.textS(getTranslation(188)+": "+maphelpCounters.correct, 5, 7);
	canvas.textS(getTranslation(189)+": "+maphelpCounters.incorrect, 30, 7);

	let minutes = Math.trunc(Math.trunc(maphelpCounters.time/10)/60);
	let seconds = Math.trunc(Math.trunc(maphelpCounters.time/10)%60);
	let timeStr = (minutes != 0) ? String(minutes)+":"+String(seconds).padStart(2, "0") : String(seconds)+"s";
	canvas.textS(getTranslation(79)+": "+timeStr, 55, 7);

	//lower ui bar
	canvas.setColor("#ffffff").drawBox(0, 90, 100, 10);

	canvas.setColor("#000080").textS(getTranslation(185)+" "+maphelpCities[maphelpCounters.currentCity].name+" "+getTranslation(186)+" "+getTranslation(187)+" "+maphelpCities[maphelpCounters.currentCity].name, 5, 97);

	//image

	canvas.image(maphelpImage.element, maphelpImage.imgLeft, maphelpImage.imgTop, maphelpImage.imgScale);

	//render cities

	for(let c of maphelpCities) {
		if(maphelpCounters.lastCorrectId === c.id) {
			canvas.setColor("#ffffff");
		}
		else {
			if(maphelpCounters.timeCountdown > 0) {
				if(!maphelpCounters.lastCorrect) canvas.setColor("#800000");
				else canvas.setColor("#006000");
			}
			else canvas.setColor("#000000");
		}
		c.draw();
	}
}

async function minigameMaphelpGame() {
	let endGamePromiseCompleted = false;

	let skipButton = ui.addVerySmallButton("skip", getTranslation(82), 80, 0, 20, 10, () => {
		ui.removeMoney(ui.getEarlyLeaveTimeMoney(maphelpCounters.time/10));
		endGamePromiseCompleted = true;
	});
	document.getElementById("skip").setAttribute("disabled", "disabled");

	maphelpMinigameNext(0);

	while(!endGamePromiseCompleted) {
		maphelpCounters.time--;

		renderMaphelpMinigame();

		if(maphelpCounters.timeCountdown > 0)
			maphelpCounters.timeCountdown--;
		else {
			//remove disabled attributes
			for(let c of maphelpCities) {
				document.getElementById(c.button.id).removeAttribute("disabled");
			}
		}

		let MoneyAmount = ui.getEarlyLeaveTimeMoney(maphelpCounters.time/10);
		if(ui.info.money>=MoneyAmount) {
			document.getElementById("skip").removeAttribute("disabled");
			document.getElementById("skip").innerHTML = getTranslation(80)+" "+MoneyAmount;
		}
		else {
			document.getElementById("skip").setAttribute("disabled", "disabled");
			document.getElementById("skip").innerHTML = getTranslation(82)+"<br>"+MoneyAmount+" "+getTranslation(83)+", "+getTranslation(84)+" "+ui.info.money;
		}		

		if(maphelpCounters.time <= 0) {
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
}

async function minigameMaphelpSummary() {
	canvas.clear("#00aa00");
	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");

	canvas.textS(getTranslation(60), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");

	canvas.textS(getTranslation(190), 10, 20).textS(maphelpCounters.correct, 80, 20);
	canvas.textS(getTranslation(191), 10, 30).textS(maphelpCounters.incorrect, 80, 30);
	canvas.textS(getTranslation(192), 10, 40).textS(Math.trunc(dialectCounters.correct/dialectCounters.total*100), 80, 40);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {
		pauseHidden = false;
		musicPause();
	}));
}

async function minigameMaphelp() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameMaphelpLoad();
	await minigameMaphelpMenu();
	await minigameMaphelpGame();
	await minigameMaphelpSummary();
	minigameMaphelpReset(); //cleanup call

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
