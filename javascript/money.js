function addMoney(amount) {
	info.money += amount;
}
function removeMoney(amount) {
	info.money -= amount;
}

async function checkMoney() {
	//check for debt limit, money limit
	if(info.money <= settings.debt_limit) {
		await gameOver(getTranslation(40));
	}
}

async function renderMoney() {
	await checkMoney(); //async: if fails check (game over) - stop the rendering cycle

	canvas.setFontWeight("normal");
	canvas.setColor("#ffffff");
	canvas.drawCircleBox(80, 0, 20, 10);
	if(info.money < 0) {
		canvas.setColor("#800000");
	}
	else if(info.money > info.currentTicketPrice) {
		canvas.setColor("#008000");
	}
	else {
		canvas.setColor("#000080");
	}
	canvas.setSmallFontSize();
	canvas.textS(getTranslation(51)+": "+String(info.money), 83, 7);
}

function getEarlyLeaveTimeMoney(time) {
	//100 gold + 100 per minute +  difficulty adjustment
	return 100+Math.trunc((Math.trunc(time/30)*settings.diff_multiplier*50));
}
