function addMoney(amount) {
	info.money += amount;
}
function removeMoney(amount) {
	info.money -= amount;
}

function checkMoney() {
	//check for debt limit, money limit
}

function renderMoney() {
	canvasSetColor("#ffffff");
	canvasCircleBox(80, 0, 20, 10);
	if(info.money < 0) {
		canvasSetColor("#800000");
	}
	else if(info.money > info.currentTicketPrice) {
		canvasSetColor("#008000");
	}
	else {
		canvasSetColor("#000080");
	}
	canvasSetSmallFont();
	canvasTextS(getTranslation(51)+": "+String(info.money), 83, 7);
}