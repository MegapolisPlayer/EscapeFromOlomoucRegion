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

	canvasSetFontWeight(canvas, ctx, "normal");
	canvasSetColor(canvas, ctx, "#ffffff");
	canvasCircleBox(canvas, ctx, 80, 0, 20, 10);
	if(info.money < 0) {
		canvasSetColor(canvas, ctx, "#800000");
	}
	else if(info.money > info.currentTicketPrice) {
		canvasSetColor(canvas, ctx, "#008000");
	}
	else {
		canvasSetColor(canvas, ctx, "#000080");
	}
	canvasSetSmallFont(canvas, ctx);
	canvasTextS(canvas, ctx, getTranslation(51)+": "+String(info.money), 83, 7);
}

function getEarlyLeaveTimeMoney(time) {
	//100 gold + 100 per minute +  difficulty adjustment
	return 100+Math.trunc((Math.trunc(time/30)*settings.diff_multiplier*50));
}