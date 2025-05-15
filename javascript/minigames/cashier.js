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
	currentProductId: -1,
	isTickEven: true,
};

let cashierImages = {
	scannerOff: null,
	scannerRed: null,
	scannerGreen: null,
	conveyor: null,
	cashregister: null,
};

const CASHIER_PRODUCT_PRICES = [
	{price: 4.90,   barcode: false}, //kaiser roll
	{price: 19.90,  barcode: false}, //banana
	{price: 99.90,  barcode: true}, //cereal box
	{price: 39.90,  barcode: true}, //sour cream
	{price: 29.90,  barcode: true}, //smoked ham
	{price: 29.90,  barcode: true}, //cheese
	{price: 299.90, barcode: true}, //meat
	{price: 29.90,  barcode: true}, //milk
	{price: 499.90, barcode: true}, //drill (Lidl moment)
	{price: 99.90,  barcode: true}, //chocolate
];
const CASHIER_PRODUCT_SIZE = 3;

class CashierProduct {
	image = null;
	name = "";
	price = -1;
	barcode = false;

	constructor(image, name, id) {
		this.image = image;
		this.name = name;
		this.price = CASHIER_PRODUCT_PRICES[id].price;
		this.barcode = CASHIER_PRODUCT_PRICES[id].barcode;
	}

	draw(x, y) {
		canvas.drawImage(
			this.image, x-CASHIER_PRODUCT_SIZE/2, y-CASHIER_PRODUCT_SIZE/2,
			CASHIER_PRODUCT_SIZE, CASHIER_PRODUCT_SIZE
		);
	}
}

let cashierProducts = [];

function minigameCashierReset() {

}

async function minigameCashierLoad() {
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

	//load products

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
	}

	let productCount = Math.trunc(Math.random()*5)+1;
	for(let i = 0; i < productCount; i++) {
		let product = cashierProducts[Math.trunc(Math.random()*cashierProducts.length)];
		cashierCounters.currentCustomerProducts.push(product);
	}
}

function renderCashierMinigame() {
	canvas.clear("#dddddd");

	//left column
	canvas.setColor("#bbbbbb").drawBox(0, 0, 33.3, 100);

	//cashier machine
	canvas.imageDest(cashierImages.cashregister, 60, 40, 30, canvas.convertXtoY(30));

	//cashier's stand 
	canvas.setColor("#808080").drawBox(50, 80, 30, 20);

	const SCANNER_X = 52;

	//scanner
	if(cashierCounters.currentProductId.barcode)
		canvas.imageDest(cashierImages.scannerGreen, SCANNER_X, 70, 10, 10);
	else {
		if(cashierCounters.isTickEven) canvas.imageDest(cashierImages.scannerOff, SCANNER_X, 70, 10, 10);
		else canvas.imageDest(cashierImages.scannerRed, SCANNER_X, 70, 10, 10);
	}

	//conveyor belt
	//place for 5 products

	let yc = 0;
	for(;yc < 100;) {
		canvas.imageDest(cashierImages.conveyor, 15, yc, 10, canvas.convertXtoY(10));
		yc += canvas.convertXtoY(10);
	}

	//products - max 5

	yc = 90;
	for(let i = 0; i < cashierCounters.currentCustomerProducts.length && i < 5 && yc >= 10; i++) {
		cashierCounters.currentCustomerProducts[i].draw(15, yc);
		yc -= canvas.convertXtoY(10);
	}

	//ui bar - draw last
	canvas.setColor("#ffffff").drawBox(0, 0, 100, 10);
	canvas.setColor("#000080").setSmallFontSize().setFontWeight("normal");
	
	canvas.textS(getTranslation(144)+": "+cashierCounters.products, 5, 7);
	canvas.textS(getTranslation(145)+": "+cashierCounters.customers, 30, 7);
	
	let minutes = Math.trunc(Math.trunc(cashierCounters.time/10)/60);
	let seconds = Math.trunc(Math.trunc(cashierCounters.time/10)%60);
	let timeStr = (minutes != 0) ? String(minutes)+":"+String(seconds).padStart(2, "0") : String(seconds)+"s";
	canvas.textS(getTranslation(79)+": "+timeStr, 55, 7);
}

async function minigameCashierGame() {
	let endGamePromiseCompleted = false;

	let skipButton = ui.addVerySmallButton("skip", getTranslation(82), 50, 90, 30, 10, () => {
		ui.removeMoney(ui.getEarlyLeaveTimeMoney(cashierCounters.time/10));
		endGamePromiseCompleted = true;
	});
	document.getElementById("skip").setAttribute("disabled", "disabled");

	cashierMinigameNextCustomer(0);

	renderCashierMinigame();

	while(!endGamePromiseCompleted) {
		cashierCounters.time--;

		renderCashierMinigame();

		if(cashierCounters.currentCustomerProducts.length == 0) {
			cashierMinigameNextCustomer();
		}

		do {
			await new Promise((resolve) => {
				setTimeout(() => { resolve(); }, 100);
			});
		}
		while(ui.info.paused);

		cashierCounters.isTickEven = !cashierCounters.isTickEven;
	}

	ui.removeButton("skip");
}
async function minigameCashierSummary() {
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
