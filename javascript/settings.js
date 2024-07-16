async function renderSettings() {
	canvas.background(mainMenuImage);
	canvas.setColor("#aaaaaa");
	canvas.drawBox( 5, 10, 90, 85);
	canvas.setLargeFontSize();
	canvas.setColor("#000080");
	canvas.setBorder("#ffffff");
	canvas.textAndBorderS(getTranslation(5), 5, 10);

	canvas.setSmallFontSize();
	canvas.setFontWeight("bold");

	//value text
	canvas.textS(getTranslation(19), 53, 20);
	canvas.textS(getTranslation(20), 53, 30);
	canvas.textS(getTranslation(21), 53, 40);

	//values
	canvas.textS(String(ui.settings.random_loss_chance), 83, 20);
	canvas.textS(String(ui.settings.diff_multiplier), 83, 30);
	canvas.textS(String(ui.settings.debt_limit), 83, 40);

	//ui.settings text
	canvas.textS(getTranslation(15), 10, 20);
	canvas.textS(getTranslation(22), 10, 30);
	canvas.textS(getTranslation(23), 10, 40);

	canvas.textS(getTranslation(24), 10, 80);
	canvas.textS(getTranslation(25), 10, 90);
	
	//note
	canvas.setFontWeight("normal");
	canvas.textM(wrapText(getTranslation(61), 80), 10, 50);
	canvas.setFontWeight("bold");

	//ui.settings buttons
	addVerySmallButton("diff", getTranslation(17), 30, 15, 10, 5, () => {
		ui.settings.difficulty++;
		if(ui.settings.difficulty == 3) {
			ui.settings.difficulty = 0;
		}

		switch(ui.settings.difficulty) {
			case(0):
				ui.settings.diff_multiplier = 0.8;
				ui.settings.random_loss_chance = 10000;
				ui.settings.debt_limit = -1000;
				document.getElementById("diff").innerHTML = getTranslation(16);
				break;
			case(1):
				ui.settings.diff_multiplier = 1;
				ui.settings.random_loss_chance = 5000;
				ui.settings.debt_limit = -500;
				document.getElementById("diff").innerHTML = getTranslation(17);
				break;
			case(2):
				ui.settings.diff_multiplier = 1.2;
				ui.settings.random_loss_chance = 1000;
				ui.settings.debt_limit = -100;
				document.getElementById("diff").innerHTML = getTranslation(18);
				break;
		}

		canvas.setColor("#aaaaaa");
		canvas.drawBox( 83, 10, 12, 35);
		canvas.setColor("#000080");
		canvas.textS(String(ui.settings.random_loss_chance), 83, 20);
		canvas.textS(String(ui.settings.diff_multiplier), 83, 30);
		canvas.textS(String(ui.settings.debt_limit), 83, 40);
	});
	addVerySmallButton("lang", translationNames[translationSelected], 30, 25, 10, 5, () => {
		translationSelected++;
		if(translationSelected == translationNames.length) {
			translationSelected = 0;
		}
		document.getElementById("lang").innerHTML = translationNames[translationSelected];
	});
	addVerySmallButton("volup", "+", 30, 35, 5, 5, () => {
		if(ui.settings.volume >= 0.95) { return; }
		ui.settings.volume += 0.1;
		ui.settings.volume = Number(Number(ui.settings.volume).toFixed(1));
		audioVolume(ui.settings.volume);
		document.getElementById("vol").innerHTML = ui.settings.volume;
	});
	addVerySmallButton("vol", String(ui.settings.volume), 35, 35, 10, 5, () => {
		ui.settings.volume = 0.7;
		ui.settings.volume = Number(Number(ui.settings.volume).toFixed(1));
		audioVolume(ui.settings.volume);
		document.getElementById("vol").innerHTML = ui.settings.volume;
	});
	addVerySmallButton("voldn", "-", 45, 35, 5, 5, () => {
		if(ui.settings.volume <= 0.05) { return; }
		ui.settings.volume -= 0.1;
		ui.settings.volume = Number(Number(ui.settings.volume).toFixed(1));
		audioVolume(ui.settings.volume);
		document.getElementById("vol").innerHTML = ui.settings.volume;
	});
	addVerySmallButton("msfx", ui.settings.music_enabled == true ? getTranslation(26) : getTranslation(27), 30, 75, 10, 5, () => {
		musicToggle(document.getElementById("msfx"));
		musicPlay(0);
	});
	addVerySmallButton("voice", ui.settings.voice_enabled == true ? getTranslation(26) : getTranslation(27), 30, 85, 10, 5, () => {
		voiceToggle(document.getElementById("voice"));
	});

	return waiterEventFromElement(
		addButton(
		"back", getTranslation(38), 65, 85, 30, 10,
		(e) => { 
			removeButton("diff");
			removeButton("lang");
			removeButton("volup");
			removeButton("vol");
			removeButton("voldn");
			removeButton("msfx");
			removeButton("voice");
			removeButton("back");
		}
	), "click");
}
