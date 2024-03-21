async function renderSettings() {
	canvasBackground(mainMenuImage);
	canvasSetColor("#aaaaaa");
	canvasBox(5, 10, 90, 85);
	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetBorder("#ffffff");
	canvasTextAndBorderS(getTranslation(5), 5, 10);

	canvasSetSmallFont();
	canvasSetFontWeight("bold");

	//value text
	canvasTextS(getTranslation(19), 53, 20);
	canvasTextS(getTranslation(20), 53, 30);
	canvasTextS(getTranslation(21), 53, 40);

	//values
	canvasTextS(String(settings.random_loss_chance), 83, 20);
	canvasTextS(String(settings.diff_multiplier), 83, 30);
	canvasTextS(String(settings.debt_limit), 83, 40);

	//settings text
	canvasTextS(getTranslation(15), 10, 20);
	canvasTextS(getTranslation(22), 10, 30);
	canvasTextS(getTranslation(23), 10, 40);

	canvasTextS(getTranslation(24), 10, 80);
	canvasTextS(getTranslation(25), 10, 90);
	
	//note
	canvasSetFontWeight("normal");
	canvasTextM(wrapText(getTranslation(60), 80), 10, 50);
	canvasSetFontWeight("bold");

	//settings buttons
	addVerySmallButton("diff", getTranslation(17), 30, 15, 10, 5, () => {
		settings.difficulty++;
		if(settings.difficulty == 3) {
			settings.difficulty = 0;
		}

		switch(settings.difficulty) {
			case(0):
				settings.diff_multiplier = 0.8;
				settings.random_loss_chance = 10000;
				settings.debt_limit = -1000;
				document.getElementById("diff").innerHTML = getTranslation(16);
				break;
			case(1):
				settings.diff_multiplier = 1;
				settings.random_loss_chance = 5000;
				settings.debt_limit = -500;
				document.getElementById("diff").innerHTML = getTranslation(17);
				break;
			case(2):
				settings.diff_multiplier = 1.2;
				settings.random_loss_chance = 1000;
				settings.debt_limit = -100;
				document.getElementById("diff").innerHTML = getTranslation(18);
				break;
		}

		canvasSetColor("#aaaaaa");
		canvasBox(83, 10, 12, 35);
		canvasSetColor("#000080");
		canvasTextS(String(settings.random_loss_chance), 83, 20);
		canvasTextS(String(settings.diff_multiplier), 83, 30);
		canvasTextS(String(settings.debt_limit), 83, 40);
	});
	addVerySmallButton("lang", translationNames[translationSelected], 30, 25, 10, 5, () => {
		translationSelected++;
		if(translationSelected == translationNames.length) {
			translationSelected = 0;
		}
		document.getElementById("lang").innerHTML = translationNames[translationSelected];
	});
	addVerySmallButton("volup", "+", 30, 35, 5, 5, () => {
		if(settings.volume >= 0.95) { return; }
		settings.volume += 0.1;
		settings.volume = Number(Number(settings.volume).toFixed(1));
		audioVolume(settings.volume);
		document.getElementById("vol").innerHTML = settings.volume;
	});
	addVerySmallButton("vol", String(settings.volume), 35, 35, 10, 5, () => {
		settings.volume = 0.7;
		settings.volume = Number(Number(settings.volume).toFixed(1));
		audioVolume(settings.volume);
		document.getElementById("vol").innerHTML = settings.volume;
	});
	addVerySmallButton("voldn", "-", 45, 35, 5, 5, () => {
		if(settings.volume <= 0.05) { return; }
		settings.volume -= 0.1;
		settings.volume = Number(Number(settings.volume).toFixed(1));
		audioVolume(settings.volume);
		document.getElementById("vol").innerHTML = settings.volume;
	});
	addVerySmallButton("msfx", settings.music_enabled == true ? getTranslation(26) : getTranslation(27), 30, 75, 10, 5, () => {
		musicToggle(document.getElementById("msfx"));
		musicPlay(0);
	});
	addVerySmallButton("voice", settings.voice_enabled == true ? getTranslation(26) : getTranslation(27), 30, 85, 10, 5, () => {
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