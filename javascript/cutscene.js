async function cutsceneTravel(price) {
	ui.animationBlocked = true;

	await ui.dialogueLine(175, " "+price+" CZK");
	await ui.dialogueLine(176);
	if(await ui.dialogueChoice()) {
		if(ui.info.money < price) {
			await ui.dialogueLine(179);
			ui.animationBlocked = false;
			return false;
		}
		else {
			//yes
			ui.info.money -= price*ui.settings.diff_multiplier;
			await ui.dialogueLine(177);
			//10% change some extra money is charged
			if(Math.random() > 0.9) {
				await ui.dialogueLine(180);
				//5% of price if available
				ui.info.money -= Math.min(price*0.05*ui.settings.diff_multiplier, ui.info.money);
			}

			await canvas.fadeOut({ref:ui});
			ui.animationBlocked = false;
			return true;
		}
	}
	else {
		//no
		await ui.dialogueLine(178);
		ui.animationBlocked = false;
		return false;
	}
}

async function cutsceneNews() {
	ui.animationBlocked = true;

	let bg = await loadImage("assets/cutscene/news.jpg");
	let lg = await loadImage("assets/cutscene/newsLogo.png");
	let cw = await loadImage("assets/cutscene/oneLogo.png");

	let skipPromise = { promise: new Promise(() => {}) };
	ui.addButton("skip", getTranslation(7), 80, 0, 20, 10, () => {
		skipPromise.promise = Promise.resolve();
	});

	canvas.background(bg);
	//tint for bg
	canvas.setColor("#000080");
	canvas.setAlpha(0.6);
	canvas.drawBox(0, 0, 100, 100);
	canvas.resetAlpha();

	musicPause();
	sfxPlayQuiet(10);

	//news box
	canvas.setColor("#800000");
	canvas.drawRoundedBox(5, 5, 50, 60, 10);
	canvas.setLargeFontSize();
	canvas.setColor("#ffffff");
	canvas.setBorder("#000080");
	canvas.textAndBorderS(getTranslation(45), 10, 60);
	canvas.setSmallFontSize();

	canvas.imageDest(lg, 7, 10, 46, 30);

	//anchor
	NPCManager.draw(NPCManager.types.NEWS, 80, 60, 3);

	//channel wordmark
	canvas.imageDest(cw, 5, 5, 10, 10);

	//text
	for(let i = 0; i < 3; i++) {
		canvas.setColor("#000080").imageEquivalent(steelImage, 0, 70, 100, 30).setColor("#ffffff");

		await Promise.race([Promise.all([playVoice(46+i), canvas.typewriterM(wrapText(getTranslation(46+i), 80), 10, 80, skipPromise)]), skipPromise.promise]);
		voiceStop();

		await Promise.race([waiterEventFromElement(document.getElementById("skip"), "click"), skipPromise.promise, ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}))]);
		ui.clearArrows();
	}

	sfxStop(10);
	ui.removeButton("skip");
}

async function cutsceneStudenka() {
	ui.animationBlocked = true;

	let bg = await loadImage("assets/cutscene/Bmz245.jpg");

	await dialogueLine();	

	//TODO
	//fade to black
	//more dialogue
	//effect of blinking on tracks

	ui.animationBlocked = false;
}

async function cutscenePoland() {
	ui.animationBlocked = true;

	let bg = await loadImage("assets/cutscene/B10bmnouz.jpg");

	await dialogueLine();

	//TODO
	//some time
	//dialogue
	//track SFX
	//more dialogue
	//fade to black
	
	//credits called separately

	ui.animationBlocked = false;
}
