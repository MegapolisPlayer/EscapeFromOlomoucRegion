let waiterMinigameImages = [];
let waiterLoaded = false;
let waiterButtons = [];
let waiterTables = [];
let waiterOrders = [];
let waiterTablePhases = {
	BASE: 0,
	ORDER: 1,
	ORDER_EXPIRE: 2,
	WAITING: 3,
	WAITING_EXPIRE: 4,
	LEFT: 5, //ignored order
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
	waiterOrders = [];
	waiterCounters.completed = 0;
	waiterCounters.undelivered = 0;
	waiterCounters.ignored = 0;
	waiterCounters.time = 1500;
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
	waiterMinigameImages.push(await loadImage("assets/minigames/waiter/order.png"));
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

	canvasTextM(wrapText(getTranslation(67)+" "+String(Math.trunc(10*settings.diff_multiplier))+" "+getTranslation(68)+" "+String(20)+" "+getTranslation(69), 90), 5, 18);

	canvasImageSamesizeY(waiterMinigameImages[1], 5, 40, 10);
	canvasTextS(getTranslation(70), 15, 45);

	canvasImageSamesizeY(waiterMinigameImages[2], 5, 50, 10);
	canvasTextS(getTranslation(71), 15, 55);

	canvasImageSamesizeY(waiterMinigameImages[4], 5, 60, 10);
	canvasTextS(getTranslation(72), 15, 65);

	canvasImageSamesizeY(waiterMinigameImages[3], 5, 70, 10);
	canvasImageSamesizeY(waiterMinigameImages[5], 12, 70, 10);
	canvasTextS(getTranslation(73), 20, 75);

	canvasImageSamesizeY(waiterMinigameImages[7], 5, 80, 10);
	canvasTextS(getTranslation(74), 15, 85);

	canvasImageSamesizeY(waiterMinigameImages[6], 5, 90, 10);
	canvasTextS(getTranslation(75), 15, 95);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}

function renderWaiterCounter(value, y) {
	canvasSetColor("#ffffff");
	canvasBox(83, y - 7, 20, 10);
	canvasSetColor("#000080");
	canvasTextS(value, 85, y);
}

function renderWaiterTable(id) {
	canvasSetColor("#aaaaaa");
	let x = 10+(Math.trunc(id/4)*10);
	let y = 10+((id%4)*15);
	canvasBoxSamesizeY(x, y, 10);
	canvasImageSamesizeY(waiterMinigameImages[waiterTables[id].phase + 1], x, y, 10);
	canvasSetColor("#000080");
	canvasTextS(id+1, x, y);
}

function waiterTableUpdate(id, newphase) {
	if(newphase == waiterTablePhases.LEFT) {
		sfxPlay(4);
	}
	else if(newphase == waiterTablePhases.GOOD) {
		sfxPlay(3);
	}
	waiterTables[id].phase = newphase;
	waiterTables[id].ticks = 0;
	renderWaiterTable(id);
}

function renderOrders() {
	let ConveyorIndex = 0;
	canvasSetColor("#000000");
	canvasBoxSamesizeY(0, 80, 20);
	while(true) {
		if(canvasX(canvasTransportYToX((ConveyorIndex+1)*20)) >= canvasX(80)) { break; }
		canvasImageSamesizeY(waiterMinigameImages[0], canvasTransportYToX(20*(ConveyorIndex+1)), 80, 20);
		if(ConveyorIndex < waiterOrders.length) {
			canvasImageSamesizeY(waiterMinigameImages[8], canvasTransportYToX(20*(ConveyorIndex+1)), 80, 20);
			canvasSetColor("#000000");
			canvasTextS(waiterOrders[ConveyorIndex]+1, canvasTransportYToX(20*(ConveyorIndex+1))+2, 92);
		}
		ConveyorIndex++;
	}
}

function waiterTableButtonCallback(e) {
	console.log("Table triggered, no ", e.target.custom_property_table_id);

	//find table

	if(waiterTables[e.target.custom_property_table_id].phase == waiterTablePhases.ORDER || waiterTables[e.target.custom_property_table_id].phase == waiterTablePhases.ORDER_EXPIRE) {
		waiterTableUpdate(e.target.custom_property_table_id, waiterTablePhases.WAITING);
		waiterOrders.push(e.target.custom_property_table_id);
	}	
	else if(waiterTables[e.target.custom_property_table_id].phase == waiterTablePhases.WAITING || waiterTables[e.target.custom_property_table_id].phase == waiterTablePhases.WAITING_EXPIRE) {
		waiterTableUpdate(e.target.custom_property_table_id, waiterTablePhases.GOOD);
		waiterOrders.splice(waiterOrders.indexOf(e.target.custom_property_table_id), 1);
		waiterCounters.completed++;
		info.money += 20;
		renderWaiterCounter(waiterCounters.completed, 17);
	}

	//advance phases, add money
}

function renderWaiterMinigame() {
	canvasClear("#aaaaaa");

	canvasSetColor("#ffffff");
	canvasBox(80, 0, 20, 100);
	canvasSetColor("#000080");

	canvasTextS(getTranslation(76), 83, 7);
	canvasTextS(0, 83, 17);
	canvasTextS(getTranslation(77), 83, 27);
	canvasTextS(0, 83, 37);
	canvasTextS(getTranslation(78), 83, 47);
	canvasTextS(0, 83, 57);
	canvasTextS(getTranslation(79), 83, 67);
	//time set immediately after

	renderOrders(); //also renders orders' conveyor belts

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

	waiterButtons.push(addVerySmallButton("skip", getTranslation(82), 80, 90, 20, 10, (e) => {
		info.money -= getEarlyLeaveTimeMoney(waiterCounters.time);
		endGamePromiseCompleted = true;
	}));
	document.getElementById("skip").setAttribute("disabled", "disabled");

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
			else if(waiterTables[i].phase == waiterTablePhases.ORDER_EXPIRE && waiterTables[i].ticks >= shorttime) {
				waiterTableUpdate(i, waiterTablePhases.LEFT);
				waiterCounters.ignored++;
				renderWaiterCounter(waiterCounters.ignored, 57);
			}
			else if(waiterTables[i].phase == waiterTablePhases.WAITING && waiterTables[i].ticks >= longtime) {
				waiterTableUpdate(i, waiterTablePhases.WAITING_EXPIRE);
			}
			else if(waiterTables[i].phase == waiterTablePhases.WAITING_EXPIRE && waiterTables[i].ticks >= shorttime) {
				waiterTableUpdate(i, waiterTablePhases.LEFT);
				waiterCounters.undelivered++;
				info.money -= Math.trunc(10*settings.diff_multiplier);
				renderWaiterCounter(waiterCounters.undelivered, 37);
			}
			else if(waiterTables[i].phase == waiterTablePhases.LEFT && waiterTables[i].ticks >= shorttime) {
				waiterTableUpdate(i, waiterTablePhases.BASE);
			}
			else if(waiterTables[i].phase == waiterTablePhases.GOOD && waiterTables[i].ticks >= shorttime) {
				waiterTableUpdate(i, waiterTablePhases.BASE);
			}
		}

		//render orders
		renderOrders();

		//update counters
		waiterCounters.time--;

		//rerender them
		let minutes = Math.trunc((waiterCounters.time/10)/60);
		let seconds = Math.trunc((waiterCounters.time/10)%60);
		if(minutes != 0) renderWaiterCounter(String(minutes)+":"+String(seconds).padStart(2, "0"), 77);
		else renderWaiterCounter(String(seconds)+"s", 77);

		let MoneyAmount = getEarlyLeaveTimeMoney(waiterCounters.time/10);
		if(info.money>=MoneyAmount) {
			document.getElementById("skip").removeAttribute("disabled");
			document.getElementById("skip").innerHTML = getTranslation(80)+" "+MoneyAmount;
		}
		else {
			document.getElementById("skip").setAttribute("disabled", "disabled");
			document.getElementById("skip").innerHTML = getTranslation(82)+"<br>"+MoneyAmount+" "+getTranslation(83)+", "+getTranslation(84)+" "+info.money;
		}

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

	canvasSetSmallFont();
	canvasSetFontWeight("normal");

	canvasTextS(getTranslation(76), 10, 20);

	canvasTextS(getTranslation(77), 10, 30);

	canvasTextS(getTranslation(78), 10, 40);


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