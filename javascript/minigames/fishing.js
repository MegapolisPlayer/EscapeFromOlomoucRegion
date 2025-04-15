let fishMinigameImages = [];
let fishLoaded = false;
let fishCounters = {
	caught: 0,
	boxes: 0,
	shoes: 0,
	tires: 0,
	time: 9000 //1 minute 30
};

const FISH_REWARD = 100;
const TIRE_REWARD = 20;
const SHOE_REWARD = 10;
const MAX_BOX_REWARD = 10;
const FISH_ROD_LENGTH = 5;
const FISH_ROD_MAX_LENGTH = 50;
let fishRodCurrentLength = FISH_ROD_LENGTH;

let ACTUAL_FISH_REWARD = -1;
let ACTUAL_TIRE_REWARD = -1;
let ACTUAL_SHOE_REWARD = -1;
let ACTUAL_MAX_BOX_REWARD = -1;

let fishRodAngle = 0;
let fishRodPositiveDirection = false;
const FISH_ANGLE_MAX = 75;
const FISH_ANGLE_SPEED = 1; //side to side
const FISH_MOVE_SPEED = 0.2; //extend, retract
let fishRodExtending = false;
let fishRodDirection = false;
let fishIdCaught = -1;

const FISH_OBJECT_TYPES = {
	UNKNOWN: 0,
	FISH: 1,
	FISH2: 2,
	BOX: 3,
	SHOE: 4,
	TIRE: 5,
};

const FISH_SIZE_X = 5;
let FISH_SIZE_Y = -1;

//AABB
function tooClose(cx1, cy1, cx2, cy2) {
	if(
		((cx1-(FISH_SIZE_X/2) <= cx2-(FISH_SIZE_X/2) && cx1+(FISH_SIZE_X/2) >= cx2-(FISH_SIZE_X/2)) ||
		(cx1-(FISH_SIZE_X/2) <= cx2+(FISH_SIZE_X/2) && cx1+(FISH_SIZE_X/2) >= cx2+(FISH_SIZE_X/2)))
		&&
		((cy1-(FISH_SIZE_Y/2) <= cy2-(FISH_SIZE_Y/2) && cy1+(FISH_SIZE_Y/2) >= cy2-(FISH_SIZE_Y/2)) ||
		(cy1-(FISH_SIZE_Y/2) <= cy2+(FISH_SIZE_Y/2) && cy1+(FISH_SIZE_Y/2) >= cy2+(FISH_SIZE_Y/2)))
	) { return true; }
	return false;
}
function tooCloseToAllFish(cx1, cy1) {
	for(let f of fishData) {
		if(tooClose(cx1, cy1, f.x, f.y)) return true;
	}
	return false;
}
function getWhichFishCollides(px, py) {
	for(let i = 0; i < fishData.length; i++) {
		let cx = fishData[i].x;
		let cy = fishData[i].y;
		if(
			(cx-(FISH_SIZE_X/2) <= px && cx+(FISH_SIZE_X/2) >= px) &&
			(cy-(FISH_SIZE_Y/2) <= py && cy+(FISH_SIZE_Y/2) >= py)
		) { return i; }
	}
	return -1;
}


class FishData {
	x = 0;
	y = 0;
	type = FISH_OBJECT_TYPES.UNKNOWN;
	animationState = false;
	handler = -1;
	rotation = 0;

	constructor(x, y, type) {
		this.x = x;
		this.y = y;
		this.type = type;
		this.handler = window.setInterval(async (inst) => {
			await new Promise((resolve) => window.setTimeout(() => { resolve(); }, Math.random()*500));
			inst.animationState = !inst.animationState;
		}, 500, this);
		this.rotation = Math.random()*20-10; //just a bit to not mess up collisions
	}

	draw() {
		canvas.ctx.translate(canvas.getX(this.x), canvas.getY(this.y));
		canvas.ctx.rotate(Math.PI/180*-this.rotation);
		switch(this.type) {
			case(FISH_OBJECT_TYPES.FISH):
				canvas.imageSamesizeX(fishMinigameImages[0+Number(this.animationState)], -(FISH_SIZE_X/2), -(FISH_SIZE_Y/2), FISH_SIZE_X);
				break;
			case(FISH_OBJECT_TYPES.FISH2):
				canvas.imageSamesizeX(fishMinigameImages[2+Number(this.animationState)], -(FISH_SIZE_X/2), -(FISH_SIZE_Y/2), FISH_SIZE_X);
				break;
			case(FISH_OBJECT_TYPES.BOX):
				canvas.imageSamesizeX(fishMinigameImages[4], -(FISH_SIZE_X/2), -(FISH_SIZE_Y/2), FISH_SIZE_X);
				break;
			case(FISH_OBJECT_TYPES.SHOE):
				canvas.imageSamesizeX(fishMinigameImages[5], -(FISH_SIZE_X/2), -(FISH_SIZE_Y/2), FISH_SIZE_X);
				break;
			case(FISH_OBJECT_TYPES.TIRE):
				canvas.imageSamesizeX(fishMinigameImages[6], -(FISH_SIZE_X/2), -(FISH_SIZE_Y/2), FISH_SIZE_X);
				break;
		}
		canvas.ctx.rotate(Math.PI/180*this.rotation);
		canvas.ctx.translate(-canvas.getX(this.x), -canvas.getY(this.y));
	}

	destroyHandler() {
		window.clearInterval(this.handler);
	}
}
let fishData = [];

function minigameFishReset() {
	fishMinigameImages = [];
	fishLoaded = false;
	fishCounters = {
		caught: 0,
		boxes: 0,
		shoes: 0,
		tires: 0,
		time: 9000 //1 minute 30
	};
	fishRodCurrentLength = FISH_ROD_LENGTH;
	ACTUAL_FISH_REWARD = -1;
	ACTUAL_TIRE_REWARD = -1;
	ACTUAL_SHOE_REWARD = -1;
	ACTUAL_MAX_BOX_REWARD = -1;
	fishRodAngle = 0;
	fishRodPositiveDirection = false;
	fishRodExtending = false;
	fishRodDirection = false;
	FISH_SIZE_Y = -1;
	for(let f of fishData) {
		f.destroyHandler();
	}
	fishData.length = 0;
	fishIdCaught = -1;
}

async function minigameFishLoad() {
	if(fishLoaded) return;

	ACTUAL_FISH_REWARD = Math.trunc(FISH_REWARD*ui.settings.diff_multiplier);
	ACTUAL_TIRE_REWARD = Math.trunc(TIRE_REWARD*ui.settings.diff_multiplier);
	ACTUAL_SHOE_REWARD = Math.trunc(SHOE_REWARD*ui.settings.diff_multiplier);
	ACTUAL_MAX_BOX_REWARD = Math.trunc(ACTUAL_MAX_BOX_REWARD*ui.settings.diff_multiplier);

	await loadMusic([11]);
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fish.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fish2.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fishb.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/fishb2.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/box.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/shoe.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/tire.png"));
	fishMinigameImages.push(await loadImage("assets/minigames/fish/hook.png"));
	fishLoaded = true;

	//behaves like constant
	FISH_SIZE_Y = canvas.convertXtoY(FISH_SIZE_X);

	Player.set(46, 10, 0.7);
}

async function minigameFishMenu() {
	pauseHidden = true;

	canvas.clear("#02b7db");

	musicPlay(11);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(90), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");
	
	canvas.textM(wrapText(getTranslation(91), 80), 5, 18);

	canvas.imageSamesizeY(fishMinigameImages[0], 5, 45, 10);
	canvas.imageSamesizeY(fishMinigameImages[2], 12, 45, 10);
	canvas.textS(getTranslation(92)+" "+ACTUAL_FISH_REWARD+" "+getTranslation(96), 20, 50);

	canvas.imageSamesizeY(fishMinigameImages[5], 5, 55, 10);
	canvas.textS(getTranslation(93)+" "+ACTUAL_SHOE_REWARD+" "+getTranslation(96), 15, 60);

	canvas.imageSamesizeY(fishMinigameImages[6], 5, 65, 10);
	canvas.textS(getTranslation(94)+" "+ACTUAL_TIRE_REWARD+" "+getTranslation(96), 15, 70);

	canvas.imageSamesizeY(fishMinigameImages[4], 5, 75, 10);
	canvas.textM(wrapText(getTranslation(95)+" "+ACTUAL_MAX_BOX_REWARD+" "+getTranslation(96), 70), 15, 80);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
}

function renderFishMinigame() {
	canvas.clear("#02b7db");

	Player.draw();

	//background
	canvas.setColor("#aa2000");
	canvas.drawBox(0, 20, 100, 5);
	canvas.setColor("#0209db");
	canvas.drawBox(0, 25, 100, 75);

	//le fish
	for(let f of fishData) {
		f.draw();
	}

	//hook
	canvas.setLineWidth(5).setLineColor("#000000").line(
		50, 10, 
		50 + Math.sin(Math.PI/180*fishRodAngle)*fishRodCurrentLength,
		10 + Math.cos(Math.PI/180*fishRodAngle)*canvas.convertXtoY(fishRodCurrentLength),
	);
	canvas.ctx.translate(canvas.getX(50), canvas.getY(10));
	canvas.ctx.rotate(-Math.PI/180*fishRodAngle); //rotation flipped
	canvas.imageSamesizeX(
		fishMinigameImages[7], -1, canvas.convertXtoY(fishRodCurrentLength)-1, 2
	);
	canvas.ctx.rotate(Math.PI/180*fishRodAngle);
	canvas.ctx.translate(-canvas.getX(50), -canvas.getY(10));

	//ui
	this.canvas.setColor("#ffffff");
	this.canvas.drawRoundedBox(0, 0, 15, 20, 10);
	this.canvas.setColor("#000080").setSmallFontSize();

	let minutes = Math.trunc(Math.trunc(fishCounters.time/100)/60);
	let seconds = Math.trunc(Math.trunc(fishCounters.time/100)%60);
	this.canvas.textS(getTranslation(79), 2, 7).textS(minutes+":"+seconds, 2, 17);
}

async function minigameFishGame() {
	let endGamePromiseCompleted = false;

	//setup
	for(let i = 0; i < 50; i++) {
		let x, y;
		do {
			x = 5+(Math.random()*90);
			y = 30+(Math.random()*65);
		}
		while(tooCloseToAllFish(x, y));
		fishData.push(new FishData(x, y, 1+Math.trunc(Math.random()*5)));
	}

	let f = (e) => {
		console.log("Function!");
		if(!fishRodExtending) {
			fishRodDirection = true;
		}
	};

	await new Promise((resolve) => {
		setTimeout(() => { resolve(); }, 100);
	});  
	document.getElementById("draw_contain").addEventListener('click', f);

	while(!endGamePromiseCompleted) {
		fishCounters.time--;

		if(!fishRodExtending) {
			fishRodAngle += ((fishRodPositiveDirection*2)-1) * FISH_ANGLE_SPEED;
			if(Math.abs(fishRodAngle) >= FISH_ANGLE_MAX) {
				fishRodPositiveDirection = !fishRodPositiveDirection;
			}
		}

		if(fishRodDirection) {
			console.log("Extending!");
			fishRodExtending = true;
			fishRodCurrentLength = Math.min(FISH_ROD_MAX_LENGTH, fishRodCurrentLength+FISH_MOVE_SPEED);
			
			let id = getWhichFishCollides(
				50 + Math.sin(Math.PI/180*fishRodAngle)*fishRodCurrentLength,
				10 + Math.cos(Math.PI/180*fishRodAngle)*canvas.convertXtoY(fishRodCurrentLength)
			);
			if(id != -1) {
				fishIdCaught = id;
			}

			if(fishRodCurrentLength == FISH_ROD_MAX_LENGTH || id != -1) fishRodDirection = false;
		}
		else {
			console.log("Retracting!");
			fishRodCurrentLength = Math.max(FISH_ROD_LENGTH, fishRodCurrentLength-FISH_MOVE_SPEED);
			if(fishRodCurrentLength == FISH_ROD_LENGTH) {
				fishRodExtending = false;
				if(fishIdCaught != -1) {
					fishData.splice(fishIdCaught, 1);
					fishIdCaught = -1;
				}
			}
			if(fishIdCaught != -1) {
				fishData[fishIdCaught].x = 50 + Math.sin(Math.PI/180*fishRodAngle)*fishRodCurrentLength;
				fishData[fishIdCaught].y = 10 + Math.cos(Math.PI/180*fishRodAngle)*canvas.convertXtoY(fishRodCurrentLength);
			}
		}

		renderFishMinigame();

		do {
			await new Promise((resolve) => {
				setTimeout(() => { resolve(); }, 10);
			});  
		}
		while(ui.info.paused);
	}

	document.getElementById("draw_contain").removeEventListener('click', f);
}
async function minigameFishSummary() {
	canvas.clear("#02b7db");

}

async function minigameFish() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameFishLoad();
	await minigameFishMenu();
	await minigameFishGame();
	await minigameFishSummary();
	minigameFishReset(); //clear intervals of le fish objects

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
