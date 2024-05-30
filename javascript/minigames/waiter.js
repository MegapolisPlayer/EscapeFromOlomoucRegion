//
// VARIABLES
//

let waiterMinigameImages = [];
let waiterLoaded = false;
let waiterButtons = []; //list of buttons of tables
let waiterTables = []; //list of tables
let waiterOrdersCooking = []; //orders still being made
let waiterOrders = []; //completed orders, array of ints
let waiterOrdersButtons = []; //buttons of orders
let waiterOrderSelected = -1; //selected order
let waiterTablePhases = {
	BASE: 0,
	ORDER: 1,
	ORDER_EXPIRE: 2,
	WAITING: 3,
	WAITING_EXPIRE: 4,
	LEFT: 5, //ignored order
	GOOD: 6
}; //enums
let waiterCounters = {
	completed: 0,
	undelivered: 0,
	ignored: 0,
	time: 1500, //2 minutes 30
}; //counters

//
//LOADING
//

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

//
// MENU
//

async function minigameWaiterMenu() {
	pauseHidden = true;

	canvasClear(canvas, ctx, "#aaaaaa");

	musicPlay(10);

	canvasSetLargeFont(canvas, ctx);
	canvasSetColor(canvas, ctx, "#000080");
	canvasSetFontWeight(canvas, ctx, "bold");

	canvasTextS(canvas, ctx, getTranslation(66), 10, 10);

	canvasSetSmallFont(canvas, ctx);
	canvasSetFontWeight(canvas, ctx, "normal");

	canvasTextM(canvas, ctx, wrapText(getTranslation(67)+" "+String(Math.trunc(10*settings.diff_multiplier))+" "+getTranslation(68)+" "+String(20)+" "+getTranslation(69), 90), 5, 18);

	canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[1], 5, 40, 10);
	canvasTextS(canvas, ctx, getTranslation(70), 15, 45);

	canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[2], 5, 50, 10);
	canvasTextS(canvas, ctx, getTranslation(71), 15, 55);

	canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[4], 5, 60, 10);
	canvasTextS(canvas, ctx, getTranslation(72), 15, 65);

	canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[3], 5, 70, 10);
	canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[5], 12, 70, 10);
	canvasTextS(canvas, ctx, getTranslation(73), 20, 75);

	canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[7], 5, 80, 10);
	canvasTextS(canvas, ctx, getTranslation(74), 15, 85);

	canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[6], 5, 90, 10);
	canvasTextS(canvas, ctx, getTranslation(75), 15, 95);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}

//
// UTILS
//

function renderWaiterCounter(value, y) {
	canvasSetColor(canvas, ctx, "#ffffff");
	canvasBox(canvas, ctx, 83, y - 7, 20, 10);
	canvasSetColor(canvas, ctx, "#000080");
	canvasTextS(canvas, ctx, value, 85, y);
}

function renderWaiterTable(id, highlight = false) {
	let x = 10+(Math.trunc(id/4)*10);
	let y = 10+((id%4)*15);
	if(highlight) {
		canvasSetColor(canvas, ctx, "#ffff00");
	}
	else {
		canvasSetColor(canvas, ctx, "#aaaaaa");
	}
	canvasBoxSamesizeY(canvas, ctx, x, y, 10);
	canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[waiterTables[id].phase + 1], x, y, 10);
	canvasSetColor(canvas, ctx, "#000080");
	canvasTextS(canvas, ctx, id+1, x, y);
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

function waiterTableButtonCallback(e) {
	console.log("Table triggered, no ", e.target.custom_property_table_id);
	
	//find table
	
	if(
		waiterTables[e.target.custom_property_table_id].phase == waiterTablePhases.ORDER ||
		waiterTables[e.target.custom_property_table_id].phase == waiterTablePhases.ORDER_EXPIRE
	) {
		waiterTableUpdate(e.target.custom_property_table_id, waiterTablePhases.WAITING);
		addOrder(e.target.custom_property_table_id);
	}	
	else if(
		(waiterTables[e.target.custom_property_table_id].phase == waiterTablePhases.WAITING ||
		waiterTables[e.target.custom_property_table_id].phase == waiterTablePhases.WAITING_EXPIRE) &&
		waiterOrderSelected == e.target.custom_property_table_id
	) {
		waiterTableUpdate(e.target.custom_property_table_id, waiterTablePhases.GOOD);
		removeOrder(e.target.custom_property_table_id);
		waiterCounters.completed++;
		info.money += 20;
		renderWaiterCounter(waiterCounters.completed, 17);
		//reset selection
		waiterOrderSelected = -1;
	}
	
	//advance phases, add money
}

//
// ORDERS
//

function addOrder(id) {
	waiterOrdersCooking.push({id: id, tocook: Math.trunc(25+(Math.random()*50)), cookingfor: 0});
}

function cookOrder(order) {
	if(order.cookingfor < order.tocook) {
		order.cookingfor++;
		return;
	}
	
	waiterOrders.push(order.id);

	sfxPlay(12);
	waiterOrdersButtons.push(
		internal_setButton(
			"order"+order.id, order.id+1, "draw_input_elem_arrow",
			canvasX(canvas, canvasTransposeYToX(canvas, (waiterOrders.length)*20)), canvasY(canvas, 80),
			canvasY(canvas, 20), canvasY(canvas, 20), ordersCallback
		)
	);
	if(canvasTransposeYToX(canvas, (waiterOrders.length)*20) >= 80) { 
		waiterOrdersButtons[waiterOrdersButtons.length - 1].style.setProperty("display", "none");
	}
	waiterOrdersButtons[waiterOrdersButtons.length - 1].custom_property_table_id = order.id;

	waiterOrdersCooking.splice(waiterOrdersCooking.map((val) => val.id).indexOf(order.id), 1);
} 

function removeOrder(id) {
	let OrderIdInArray = waiterOrders.indexOf(id);
	document.getElementById("order"+waiterOrders[OrderIdInArray]).remove();
	if(waiterOrders[OrderIdInArray] == waiterOrderSelected) {
		waiterOrderSelected = -1;
	}
	waiterOrders.splice(OrderIdInArray, 1);
	waiterOrdersButtons.splice(OrderIdInArray, 1);
}

function renderOrders() {
	let ConveyorIndex = 0;
	canvasSetColor(canvas, ctx, "#000000");
	canvasBoxSamesizeY(canvas, ctx, 0, 80, 20);

	canvasSetColor(canvas, ctx, "#ffffff");  
	canvasSetVerySmallFont(canvas, ctx);

	canvasTextS(canvas, ctx, getTranslation(85), canvasTransposeYToX(canvas, 5), 86);
	canvasTextS(canvas, ctx, getTranslation(86), canvasTransposeYToX(canvas, 5), 96);

	canvasSetSmallFont(canvas, ctx);
	canvasTextS(canvas, ctx, waiterOrdersCooking.length, canvasTransposeYToX(canvas, 5), 92);

	while(true) {
		canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[0], canvasTransposeYToX(canvas, 20*(ConveyorIndex+1)), 80, 20);
		if(canvasX(canvas, canvasTransposeYToX(canvas, (ConveyorIndex+1)*20)) >= canvasX(canvas, 80)) { break; }

		if(ConveyorIndex < waiterOrders.length) { 
			waiterOrdersButtons[ConveyorIndex].style.setProperty("display", "block");
			waiterOrdersButtons[ConveyorIndex].style.setProperty("left", canvasX(canvas, canvasTransposeYToX(canvas, (ConveyorIndex+1)*20))+"px");
			waiterOrdersButtons[ConveyorIndex].style.setProperty("top", canvasY(canvas, 80)+"px");
			waiterOrdersButtons[ConveyorIndex].style.setProperty("width", canvasY(canvas, 20)+"px");
			waiterOrdersButtons[ConveyorIndex].style.setProperty("height", canvasY(canvas, 20)+"px");
	
			if(waiterOrderSelected == waiterOrders[ConveyorIndex]) {
				canvasSetColor(canvas, ctx, "#ffff00");
				canvasSetAlpha(canvas, ctx, 0.5);
				canvasBoxSamesizeY(canvas, ctx, canvasTransposeYToX(canvas, 20*(ConveyorIndex+1)), 80, 20);
				canvasResetAlpha(canvas, ctx);
			}
			canvasImageSamesizeY(canvas, ctx, waiterMinigameImages[8], canvasTransposeYToX(canvas, 20*(ConveyorIndex+1)), 80, 20);
			canvasSetColor(canvas, ctx, "#000000");
			canvasTextS(canvas, ctx, waiterOrders[ConveyorIndex]+1, canvasTransposeYToX(canvas, 20*(ConveyorIndex+1))+2, 92);
		}

		ConveyorIndex++;
	}
}

function ordersCallback(event) {
	waiterOrderSelected = event.target.custom_property_table_id;
	renderWaiterTable(event.target.custom_property_table_id, true);
}

//
// MAIN
//

function renderWaiterMinigame() {
	canvasClear(canvas, ctx, "#aaaaaa");

	canvasSetColor(canvas, ctx, "#ffffff");
	canvasBox(canvas, ctx, 80, 0, 20, 100);
	canvasSetColor(canvas, ctx, "#000080");

	canvasTextS(canvas, ctx, getTranslation(76), 83, 7);
	canvasTextS(canvas, ctx, 0, 83, 17);
	canvasTextS(canvas, ctx, getTranslation(77), 83, 27);
	canvasTextS(canvas, ctx, 0, 83, 37);
	canvasTextS(canvas, ctx, getTranslation(78), 83, 47);
	canvasTextS(canvas, ctx, 0, 83, 57);
	canvasTextS(canvas, ctx, getTranslation(79), 83, 67);
	//time set immediately after

	renderOrders(); //also renders orders' conveyor belts

	for(let i = 0; i < 16 + (settings.difficulty * 4); i++) {
		waiterTables.push({ id: i, phase: 0, ticks: 0 });
		waiterButtons.push(internal_setButton("table"+String(i), "", "draw_input_elem_arrow",
			canvasX(canvas, 10+(Math.trunc(i/4)*10)), canvasY(canvas, 10+((i%4)*15)), canvasY(canvas, 10), canvasY(canvas, 10), 
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
		info.money -= getEarlyLeaveTimeMoney(waiterCounters.time/10);
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
				removeOrder(i);
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

		//update cooking status
		for(let order of waiterOrdersCooking) {
			cookOrder(order);
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
				pauseMenuToggle();
				resolve();
			}, 100);
		});  
	}
	
	waiterButtons.forEach((val) => {
		val.remove();
	});
}

//
// SUMMARY
//

async function minigameWaiterSummary() {
	canvasClear(canvas, ctx, "#aaaaaa");

	canvasSetLargeFont(canvas, ctx);
	canvasSetColor(canvas, ctx, "#000080");
	canvasSetFontWeight(canvas, ctx, "bold");

	canvasTextS(canvas, ctx, getTranslation(60), 10, 10);

	canvasSetSmallFont(canvas, ctx);
	canvasSetFontWeight(canvas, ctx, "normal");

	canvasTextS(canvas, ctx, getTranslation(76), 10, 20);

	canvasTextS(canvas, ctx, getTranslation(77), 10, 30);

	canvasTextS(canvas, ctx, getTranslation(78), 10, 40);
	
	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => { 
		pauseHidden = false;
		musicPause();
	}));
}

//
// MAIN GAME
//

async function minigameWaiter() {
	animationBlocked = true;

	minigameWaiterReset();
	await minigameWaiterLoad();
	await minigameWaiterMenu();
	await minigameWaiterGame();
	await minigameWaiterSummary();

	animationBlocked = false;
}