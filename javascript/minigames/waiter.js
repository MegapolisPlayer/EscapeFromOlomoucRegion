let waiterMinigameImages = [];
let waiterLoaded = false;
let waiterButtons = [];
let waiterTables = [];
let waiterTablePhases = {
	BASE: 0,
	ORDER: 1,
	ORDER_EXPIRE: 2,
	WAITING: 3,
	WAITING_EXPIRE: 4,
	LEFT: 5,
	GOOD: 6
}
let waiterCounters = {
	completed: 0,
	undelivered: 0,
	ignored: 0,
	time: 1500, //2 minutes 30
}

function minigameWaiterReset() {
	waiterMinigameImages = [];
	waiterLoaded = false;
	waiterButtons = [];
	waiterTables = [];
}

async function minigameWaiterLoad() {
	if(waiterLoaded) return;

	await loadMusic([10]);
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/belt.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablebase.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tableorder.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tableorder2.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablewaiting.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablewaiting2.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tabledone.png"));
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/tablegood.png"));
	waiterLoaded = true;
}

async function minigameWaiterMenu() {
	canvasClear("#aaaaaa");

	musicPlay(10);

	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetFontWeight("bold");

	canvasTextS(getTranslation(66), 10, 10);

	canvasSetSmallFont();
	canvasSetFontWeight("normal");

	canvasTextM(wrapText(getTranslation(67), 90), 5, 18);

	canvasImageSamesizeY(waiterMinigameImages[1], 5, 40, 10);
	canvasTextS(getTranslation(68), 15, 45);

	canvasImageSamesizeY(waiterMinigameImages[2], 5, 50, 10);
	canvasTextS(getTranslation(69), 15, 55);

	canvasImageSamesizeY(waiterMinigameImages[4], 5, 60, 10);
	canvasTextS(getTranslation(70), 15, 65);

	canvasImageSamesizeY(waiterMinigameImages[3], 5, 70, 10);
	canvasImageSamesizeY(waiterMinigameImages[5], 12, 70, 10);
	canvasTextS(getTranslation(71), 20, 75);

	canvasImageSamesizeY(waiterMinigameImages[7], 5, 80, 10);
	canvasTextS(getTranslation(72), 15, 85);

	canvasImageSamesizeY(waiterMinigameImages[6], 5, 90, 10);
	canvasTextS(getTranslation(73), 15, 95);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}

function renderWaiterCounter(value, y) {
	canvasSetColor("#ffffff");
	canvasBox(83, y - 7, 20, 10);
	canvasSetColor("#000080");
	canvasTextS(value, 85, y);
}

function renderWaiterTable(id) {
	canvasImageSamesizeY(waiterMinigameImages[waiterTables[id].phase + 1], 10+(Math.trunc(id/4)*10), 10+((id%4)*15), 10);
}

function waiterTableUpdate(id, newphase) {
	waiterTables[id].phase = newphase;
	waiterTables[id].ticks = 0;
	renderWaiterTable(id);
}

function waiterTableButtonCallback(e) {
	console.log("Table triggered, no ", e.target.custom_property_table_id);

	//find table

	//advance phases, add money
}

function renderWaiterMinigame() {
	canvasClear("#aaaaaa");

	canvasSetColor("#ffffff");
	canvasBox(80, 0, 20, 100);
	canvasSetColor("#000080");

	canvasTextS(getTranslation(74), 83, 7);
	canvasTextS(getTranslation(75), 83, 27);
	canvasTextS(getTranslation(76), 83, 47);
	canvasTextS(getTranslation(77), 83, 67);

	for(let i = 0; i < 8; i++) {
		canvasImageDest(waiterMinigameImages[0], 10+i*10, 90, 10, 10);
	}

	for(let i = 0; i < 16 + (settings.difficulty * 4); i++) {
		waiterTables.push({ id: i, phase: 0, ticks: 0 });
		waiterButtons.push(internal_setButton("table"+String(i), "", "draw_input_elem_arrow",
			canvasX(10+(Math.trunc(i/4)*10)), canvasY(10+((i%4)*15)), canvasY(10), canvasY(10), 
			waiterTableButtonCallback
		));
		waiterButtons[i].custom_property_table_id = i;
		renderWaiterTable(i);
	}

	//add other buttons
	waiterButtons.push(addSmallButton("pause", getTranslation(10), 80, 80, 20, 10, (e) => {}));
}

async function minigameWaiterGame() {
	renderWaiterMinigame();

	//variables
	let endGamePromiseCompleted = false;

	waiterButtons.push(addSmallButton("skip", getTranslation(78), 80, 90, 20, 10, (e) => {
		endGamePromiseCompleted = true;
	}));

	//main loop
	
	while(!endGamePromiseCompleted) {
		console.log("Waiter Game Tick!");

		//generate table IDs for table phase change (max.1 table change per tick)

		
		//config
		let nticks = 10;
		let longtime = 100;
		let shorttime = 50;
		//end of config		
		
		//advance random phases, only every N tick
		if(Math.random()<=(1/nticks)) {
			let rn = Math.trunc(Math.random()*(16 + (settings.difficulty * 4)));

			//advance random phases
			if(waiterTables[rn].phase == waiterTablePhases.BASE) {
				waiterTableUpdate(rn, waiterTablePhases.ORDER);
			}
		}

		for(let i = 0; i < 16 + (settings.difficulty * 4); i++) {
			waiterTables[i].ticks++;
			//advance time phases

			if(waiterTables[i].phase == waiterTablePhases.ORDER && waiterTables[i].ticks >= longtime) {
				waiterTableUpdate(i, waiterTablePhases.ORDER_EXPIRE);
			}
			if(waiterTables[i].phase == waiterTablePhases.ORDER_EXPIRE && waiterTables[i].ticks >= shorttime) {
				waiterTableUpdate(i, waiterTablePhases.LEFT);
			}



			if(waiterTables[i].phase == waiterTablePhases.LEFT && waiterTables[i].ticks >= longtime) {
				waiterTableUpdate(i, waiterTablePhases.BASE);
			}
		}

		//update counters
		waiterCounters.time--;

		//rerender them
		let minutes = Math.trunc((waiterCounters.time/10)/60);
		let seconds = Math.trunc((waiterCounters.time/10)%60);
		if(minutes != 0) renderWaiterCounter(String(minutes)+":"+String(seconds), 77);
		else renderWaiterCounter(String(seconds)+"s", 77);

		if(waiterCounters.time <= 0) {
			console.log("Time limit reached!");
			endGamePromiseCompleted = true;
			break;
		}

		await new Promise((resolve) => {
			setTimeout(() => { 
				resolve();
			}, 100);
		});  
	}
	
	waiterButtons.forEach((val) => {
		val.remove();
	});
}
async function minigameWaiterSummary() {
	canvasClear("#aaaaaa");

	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetFontWeight("bold");

	canvasTextS(getTranslation(60), 10, 10);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => { musicStop(); }));
}

async function minigameWaiter() {
	animationBlocked = true;

	minigameWaiterReset();
	await minigameWaiterLoad();
	await minigameWaiterMenu();
	await minigameWaiterGame();
	await minigameWaiterSummary();

	animationBlocked = false;
}