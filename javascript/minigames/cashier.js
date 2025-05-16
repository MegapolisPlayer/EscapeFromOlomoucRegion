function angleDelta(a1, a2) {
	let t = Math.abs(a2 - a1);
	if(t > 180) {
		return 360 - t;
	}
	else {
		return t;
	}
}

const CASHIER_REWARD_PRODUCT = 20;
const CASHIER_REWARD_CUSTOMER = 10;
let ACTUAL_CASHIER_REWARD_PRODUCT = -1;
let ACTUAL_CASHIER_REWARD_CUSTOMER = -1;

let cashierLoaded = false;
let cashierCounters = {
	time: 900,
	products: 0,
	customers: 0,
	currentCustomerProducts: [],
	isTickEven: true,
	rotation: 0,
	rotationSpeed: 0,
};

let cashierImages = {
	scannerOff: null,
	scannerRed: null,
	scannerGreen: null,
	conveyor: null,
	cashregister: null,
	bg: null
};

const CASHIER_PRODUCT_PRICES = [
	{imgname: "kaiser.png   ", price: 4.90,   barcode: false, bangle: -1}, //kaiser roll
	{imgname: "banana.png   ", price: 19.90,  barcode: false, bangle: -1}, //banana
	{imgname: "cereal.png   ", price: 99.90,  barcode: true,  bangle: 270}, //cereal box
	{imgname: "sourcream.png", price: 39.90,  barcode: true,  bangle: 0}, //sour cream
	{imgname: "smokedham.png", price: 29.90,  barcode: true,  bangle: 0}, //smoked ham
	{imgname: "cheese.png   ", price: 24.90,  barcode: true,  bangle: 0}, //cheese
	{imgname: "meat.png     ", price: 299.90, barcode: true,  bangle: 0}, //meat
	{imgname: "milk.png     ", price: 34.90,  barcode: true,  bangle: 90}, //milk
	{imgname: "drill.png    ", price: 499.90, barcode: true,  bangle: 0}, //drill (Lidl moment)
	{imgname: "chocolate.png", price: 99.90,  barcode: true,  bangle: 0}, //chocolate
];
const CASHIER_PRODUCT_SIZE = 10;

class CashierProduct {
	image = null;
	name = "";
	price = -1;
	barcode = false;
	bangle = 0;

	constructor(image, name, id) {
		this.image = image;
		this.name = name;
		this.price = CASHIER_PRODUCT_PRICES[id].price;
		this.barcode = CASHIER_PRODUCT_PRICES[id].barcode;
		this.bangle = CASHIER_PRODUCT_PRICES[id].bangle;
	}

	draw(x, y) {
		canvas.imageDest(
			this.image, x-CASHIER_PRODUCT_SIZE/2, y-canvas.convertXtoY(CASHIER_PRODUCT_SIZE/2),
			CASHIER_PRODUCT_SIZE, canvas.convertXtoY(CASHIER_PRODUCT_SIZE)
		);
	}
}

let cashierProducts = [];

function minigameCashierReset() {

}

async function minigameCashierLoad() {
	cashierCounters.rotation = Math.random()*359;

	if(cashierLoaded) return;

	ACTUAL_CASHIER_REWARD_PRODUCT = Math.trunc(CASHIER_REWARD_PRODUCT*(1.0/ui.settings.diff_multiplier));
	ACTUAL_CASHIER_REWARD_CUSTOMER = Math.trunc(CASHIER_REWARD_CUSTOMER*(1.0/ui.settings.diff_multiplier));

	await loadMusic([15]);

	//load images
	cashierImages.scannerOff = await loadImage("/assets/minigames/cashier/scanner.png");
	cashierImages.scannerRed = await loadImage("/assets/minigames/cashier/scanner_red.png");
	cashierImages.scannerGreen = await loadImage("/assets/minigames/cashier/scanner_green.png");
	cashierImages.conveyor = await loadImage("/assets/minigames/cashier/conveyor.png");
	cashierImages.cashregister = await loadImage("/assets/minigames/cashier/cashregister.png");
	cashierImages.bg = await loadImage("/assets/photo/prostejov/obchod.jpg");

	//load products
	for(let i = 0; i < CASHIER_PRODUCT_PRICES.length; i++) {
		let image = await loadImage("/assets/minigames/cashier/"+CASHIER_PRODUCT_PRICES[i].imgname);
		cashierProducts.push(new CashierProduct(image, getTranslation(148+i), i));
	}

	cashierLoaded = true;
}
async function minigameCashierMenu() {
	pauseHidden = true;

	canvas.clear("#dddddd");
	musicPlay(15);

	canvas.setLargeFontSize().setColor("#000080").setFontWeight("bold");
	canvas.textS(getTranslation(140), 10, 10);

	canvas.setSmallFontSize().setFontWeight("normal");
	canvas.textM(wrapText(getTranslation(141)+" "+ACTUAL_CASHIER_REWARD_PRODUCT+getTranslation(96)+" "+getTranslation(142)+" "+ACTUAL_CASHIER_REWARD_CUSTOMER+" "+getTranslation(96)+" "+getTranslation(143), 90), 5, 18);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
}

function cashierMinigameNextCustomer(id) {
	if(id != 0) {
		cashierCounters.customers++;
		ui.addMoney(ACTUAL_CASHIER_REWARD_CUSTOMER);
	}

	let productCount = Math.trunc(Math.random()*5)+1;
	for(let i = 0; i < productCount; i++) {
		let product = cashierProducts[Math.trunc(Math.random()*cashierProducts.length)];
		cashierCounters.currentCustomerProducts.push(product);
	}
}

function renderCashierMinigame() {
	//bg + overlay
	canvas.background(cashierImages.bg);
	canvas.setColor("#dddddd");
	canvas.setAlpha(0.8);
	canvas.drawBox(0, 0, 100, 100);
	canvas.resetAlpha();

	//left column
	canvas.setColor("#bbbbbb").drawBox(0, 0, 33.3, 100);

	//cashier machine
	canvas.imageDest(cashierImages.cashregister, 60, 40, 30, canvas.convertXtoY(30));

	//cashier's stand 
	canvas.setColor("#808080").drawBox(50, 80, 30, 20);

	const SCANNER_X = 52;

	//scanner
	if(cashierCounters.currentCustomerProducts[0].barcode)
		canvas.imageDest(cashierImages.scannerGreen, SCANNER_X, 70, 10, 10);
	else {
		if(cashierCounters.isTickEven) canvas.imageDest(cashierImages.scannerOff, SCANNER_X, 70, 10, 10);
		else canvas.imageDest(cashierImages.scannerRed, SCANNER_X, 70, 10, 10);
	}

	canvas.setColor("#000080").setVerySmallFontSize().setCenter().textS(cashierCounters.rotationSpeed+getTranslation(158), 65, 85).resetCenter();

	//conveyor belt
	//place for 5 products

	let yc = 0;
	for(;yc < 100;) {
		canvas.imageDest(cashierImages.conveyor, 15, yc, 10, canvas.convertXtoY(10));
		yc += canvas.convertXtoY(10);
	}

	//products - max 5

	yc = 90;
	for(let i = 1; i < cashierCounters.currentCustomerProducts.length && i < 5 && yc >= 10; i++) {
		cashierCounters.currentCustomerProducts[i].draw(20, yc);
		yc -= canvas.convertXtoY(10);
	}

	//rerender rotating object
	if(cashierCounters.currentCustomerProducts.length > 0) {
		canvas.ctx.save();

		canvas.ctx.translate(
			canvas.getX(57),
			canvas.getY(70)
		);
		canvas.ctx.rotate(cashierCounters.rotation * Math.PI / 180);

		cashierCounters.currentCustomerProducts[0].draw(0, 0);

		canvas.ctx.restore();
	}

	//ui bar - draw last
	canvas.setColor("#ffffff").drawBox(0, 0, 100, 10);
	canvas.setColor("#000080").setSmallFontSize().setFontWeight("normal");
	
	canvas.textS(getTranslation(144)+": "+cashierCounters.customers, 5, 7);
	canvas.textS(getTranslation(145)+": "+cashierCounters.products, 30, 7);
	
	let minutes = Math.trunc(Math.trunc(cashierCounters.time/10)/60);
	let seconds = Math.trunc(Math.trunc(cashierCounters.time/10)%60);
	let timeStr = (minutes != 0) ? String(minutes)+":"+String(seconds).padStart(2, "0") : String(seconds)+"s";
	canvas.textS(getTranslation(79)+": "+timeStr, 55, 7);
}

async function minigameCashierGame() {
	let endGamePromiseCompleted = false;

	let speedupButton = ui.addVerySmallButton("speedup", '+1'+getTranslation(158), 50, 80, 10, 5, () => {
		cashierCounters.rotationSpeed++;
	});
	let superSpeedupButton = ui.addVerySmallButton("superspeedup", '+5'+getTranslation(158), 50, 85, 10, 5, () => {
		cashierCounters.rotationSpeed += 5;
	});
	let slowdownButton = ui.addVerySmallButton("slowdown", '-1'+getTranslation(158), 70, 80, 10, 5, () => {
		cashierCounters.rotationSpeed--;
	});
	
	let superSlowdownButton = ui.addVerySmallButton("superslowdown", '-5'+getTranslation(158), 70, 85, 10, 5, () => {
		cashierCounters.rotationSpeed -= 5;
	});

	let mousePointEvent = null;
	let efpf = (e) => { 
		mousePointEvent = e;
	};
	document.addEventListener("mousemove", efpf, {passive: true});

	let skipButton = ui.addVerySmallButton("skip", getTranslation(82), 50, 90, 30, 10, () => {
		ui.removeMoney(ui.getEarlyLeaveTimeMoney(cashierCounters.time/10));
		endGamePromiseCompleted = true;
	});
	document.getElementById("skip").setAttribute("disabled", "disabled");

	let cashRegisterButton = ui.makeButton(
		"creg", "", "draw_input_elem_arrow",
		canvas.getX(60), canvas.getY(40),
		canvas.getX(30), canvas.getY(40), () => {
			if(!cashierCounters.currentCustomerProducts[0].barcode) {
				//remove first product
				cashierCounters.currentCustomerProducts.splice(0, 1);
			
				if(cashierCounters.currentCustomerProducts.length > 0) {
					do {
						cashierCounters.rotation = Math.random()*359;
					} while(angleDelta(
						cashierCounters.rotation, 
						cashierCounters.currentCustomerProducts[0].bangle
					) < 15);
				}
				else {
					cashierMinigameNextCustomer(1);
				}

				cashierCounters.products++;
				ui.addMoney(ACTUAL_CASHIER_REWARD_PRODUCT);
				//sound
				sfxPlay(3);
			}
			else {
				sfxPlay(4);
			}
	});

	let rotateInterval = window.setInterval(() => {
		cashierCounters.rotation += cashierCounters.rotationSpeed/8/10;
		if(cashierCounters.rotation >= 360) cashierCounters.rotation -= 360;

		renderCashierMinigame();
	}, 12.5);

	cashierMinigameNextCustomer(0);

	renderCashierMinigame();

	while(!endGamePromiseCompleted) {
		cashierCounters.time--;

		if(
			Math.abs(angleDelta(
				cashierCounters.rotation, 
				cashierCounters.currentCustomerProducts[0].bangle
			)) < 15 && Math.abs(cashierCounters.rotationSpeed) < 5) {
			//remove first product
			cashierCounters.currentCustomerProducts.splice(0, 1);
			
			if(cashierCounters.currentCustomerProducts.length > 0) {
				do {
					cashierCounters.rotation = Math.random()*359;
				} while(angleDelta(
					cashierCounters.rotation, 
					cashierCounters.currentCustomerProducts[0].bangle
				) < 15);
			}
			else {
				cashierMinigameNextCustomer(1);
			}

			cashierCounters.products++;
			ui.addMoney(ACTUAL_CASHIER_REWARD_PRODUCT);
			//sound
			sfxPlay(6);
		}

		if(ui.mouseDown !== 0) {
			let elem = document.elementFromPoint(mousePointEvent.clientX, mousePointEvent.clientY);
			if(elem.isEqualNode(speedupButton)) {
				cashierCounters.rotationSpeed++;
			}
			else if(elem.isEqualNode(slowdownButton)) {
				cashierCounters.rotationSpeed--;
			}
			else if(elem.isEqualNode(superSlowdownButton)) {
				cashierCounters.rotationSpeed -= 5;
			}
			else if(elem.isEqualNode(superSpeedupButton)) {
				cashierCounters.rotationSpeed += 5;
			}
			else {}
		}

		cashierCounters.isTickEven = !cashierCounters.isTickEven;

		if(cashierCounters.time <= 0) {
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
	ui.removeButton("speedup");
	ui.removeButton("slowdown");
	ui.removeButton("superslowdown");
	ui.removeButton("superspeedup");
	window.clearInterval(rotateInterval);
	document.removeEventListener("mousemove", efpf);
}
async function minigameCashierSummary() {
	canvas.clear("#dddddd").setLargeFontSize().setColor("#000080").setFontWeight("bold");

	canvas.textS(getTranslation(60), 10, 10);
	canvas.setSmallFontSize().setFontWeight("normal");

	canvas.textS(getTranslation(146)+": "+cashierCounters.customers, 10, 20);
	canvas.textS(getTranslation(147)+": "+cashierCounters.products, 10, 30);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {
		pauseHidden = false;
		musicPause();
	}));
}

async function minigameCashier() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	minigameCashierReset();
	await minigameCashierLoad();
	await minigameCashierMenu();
	await minigameCashierGame();
	await minigameCashierSummary();
	minigameCashierReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
