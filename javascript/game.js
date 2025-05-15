let mainMenuImage;

// MAIN MENU

function renderMainMenu() {
	canvas.background(mainMenuImage);

	//render text
	canvas.setLargeFontSize().setColor("#000080").setBorder("#ffffff").setFontWeight("bold");
	canvas.textAndBorderS(getTranslation(1), 5,  10);

	//render characters (all of them, for show)
	canvas.image(Player.images[0], 20, 50, canvas.characterSizeMultiplier);
	canvas.image(Player.images[1], 30, 50, canvas.characterSizeMultiplier);
	canvas.image(Player.images[2], 45, 50, canvas.characterSizeMultiplier);
	canvas.image(Player.images[3], 55, 50, canvas.characterSizeMultiplier);

	canvas.setColor("#ffffff").setSmallFontSize().setFontWeight("normal");
	//Date changes here!!!
	canvas.textM("Version 2.00, D.05.2025\nCopyright (c) Martin/MegapolisPlayer, Jiri/KohoutGD\nThis game does NOT in any way, shape or form support or reflect the views of the authors.", 3, 80);

}

async function loadMainMenu() {
	mainMenuImage = await loadImage("assets/photo/hnm/namesti.jpg");
	renderMainMenu();

	//play buttons
	ui.addButton(
		"load", getTranslation(4), 65, 35, 30, 10,
		() => { console.log("MM btn Load Game pressed"); loadGame(); }
	);
	ui.addButton(
		"settings", getTranslation(5), 65, 45, 30, 10,
		async () => {
			console.log("MM btn Settings pressed");
			hideMainMenu();
			await renderSettings();
			
			document.getElementById("play").innerHTML = getTranslation(2);
			document.getElementById("speedrun").innerHTML = getTranslation(3);
			document.getElementById("load").innerHTML = getTranslation(4);
			document.getElementById("settings").innerHTML = getTranslation(5);
			document.getElementById("credits").innerHTML = getTranslation(6);
			document.getElementById("audio").innerHTML = ((ui.settings.music_enabled == true) ? getTranslation(9) : getTranslation(8));
			
			renderMainMenu();
			showMainMenu();
		}
	);
	ui.addButton(
		"credits", getTranslation(6), 65, 55, 30, 10,
		() => { console.log("MM btn Credits pressed"); clearMainMenu(); renderCredits(); }
	); //reloads window
	
	//audio buttons
	ui.addButton(
		"audio", getTranslation(8), 65, 65, 30, 10,
		(e) => { console.log("MM audio btn pressed"); musicRestart(0); audioToggle(e.target); musicPlay(0); }
	);
	
	let promises = [];

	promises.push(waiterEventFromElement(
		ui.addButton(
		"play", getTranslation(2), 65, 15, 30, 10,
		() => { ui.info.speedrun = false; console.log("MM btn Play pressed"); }
	), "click"));
	promises.push(waiterEventFromElement(
		ui.addButton(
		"speedrun", getTranslation(3), 65, 25, 30, 10,
		() => { ui.info.speedrun = true; console.log("MM btn Speedrun pressed"); }
	), "click"));

	await Promise.any(promises);
}
function showMainMenu() {
	ui.showButton("play");
	ui.showButton("speedrun");
	ui.showButton("load");
	ui.showButton("settings");
	ui.showButton("credits");
	ui.showButton("audio");
}
function hideMainMenu() {
	ui.hideButton("play");
	ui.hideButton("speedrun");
	ui.hideButton("load");
	ui.hideButton("settings");
	ui.hideButton("credits");
	ui.hideButton("audio");
}
function clearMainMenu() {
	ui.removeButton("play");
	ui.removeButton("speedrun");
	ui.removeButton("load");
	ui.removeButton("settings");
	ui.removeButton("credits");
	ui.removeButton("audio");
}

// CHARACTER SELECTION

async function renderCharacterSelection() {
	canvas.background(mainMenuImage);

	//render text
	canvas.setLargeFontSize().setColor("#000080").setBorder("#ffffff");
	canvas.textAndBorderS(getTranslation(13), 5, 10);

	if(ui.info.speedrun === true) {
		canvas.setFontSize(20);
		canvas.textAndBorderS(getTranslation(3)+" "+getTranslation(26), 10, 15);
	}


	//add buttons and render characters

	let promises = [];

	for(let i = 0; i < 4; i++) {
		canvas.image(Player.images[i], 5 + i * 25, 50, canvas.characterSizeMultiplier);
		promises.push(
			waiterEventFromElement(
				ui.addSmallButton(
					"select"+String(i), getTranslation(14), 4 + i * 25, 90, 10, 10,
					() => { Player.selected = i; }
				), "click"
			)
		);
	}

	return Promise.any(promises);
}
async function clearCharacterSelection() {
	for(let i = 0; i < 4; i++) {
		ui.removeButton("select"+String(i));
	}
}

// DISCLAIMER

async function renderDisclaimer() {
	console.log("disclaimer");

	musicPlay(1);
	canvas.setBrightness(50).background(mainMenuImage).resetBrightness();

	canvas.setFontWeight("bold").setLargeFontSize().setColor("#800000").setBorder("#ffffff");
	canvas.textAndBorderS(getTranslation(43), 5, 10);

	canvas.setFontWeight("normal").setSmallFontSize().setColor("#ffffff");
	canvas.textM(wrapText(getTranslation(44), 80), 10, 20);

	await ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
	ui.clearArrows();
	return;
}

// CUTSCENE

async function renderCutscene() {
	console.log("cutscene");
	canvas.setBrightness(75);
	canvas.background(mainMenuImage);

	await canvas.fadeOut({ref:ui});
	if(!ui.info.speedrun) {
		await cutsceneNews();
		await canvas.fadeOut({ref:ui});
	}
}

// GAME OVER SCREEN

async function gameOver(text) {
	ui.clearAll();
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.UIanimationBlocked = true;

	musicPlay(1);
	canvas.clear("#000000");

	canvas.setColor("#800000").setFontWeight("bold").setLargeFontSize();
	canvas.textS(getTranslation(59), 10, 20);

	canvas.setColor("#ffffff").setFontWeight("normal").setSmallFontSize();
	canvas.textM(wrapText(text, 80), 10, 40);

	
	await waiterEventFromElement(
		ui.addButton(
		"quit", getTranslation(12), 80, 90, 20, 10,
		() => { ui.removeButton("quit"); }
	), "click");

	window.location.reload();
}

// GAME HANDLER

//city handler - stay DRY
async function cityHandler(imagePaths, locationId, musicId, entryDialogue, locationFunctions) {
	// HANDLER <-> LOCATIONS
	
	// handler is a loop, return NextLocation as variable
	// wait until any function returns, then run again
	// when returning: set next location value, return promise

	ui.info.location_major = locationId;
	ui.info.location_minor = 0;
	ui.info.location_minor_next = 0;

	canvas.loadingScreen();
	await loadMusic([musicId]);

	let images = await loadImages(imagePaths);

	//map
	if(!ui.info.speedrun) {
		musicPlay(1);
		await renderMap(ui.info.location_major);
		await canvas.fadeOut({ref:ui});
	}

	musicPlay(musicId); //start playing AFTER loading
	ui.animationBlocked = false;
	
	ui.enablePauseButton();
	canvas.background(images[ui.info.location_minor]);
	Player.set(70, 60, 2.5);

	if(!ui.info.speedrun) {
		for(let id of entryDialogue) {
			await ui.dialogueLine(id);
		}
	}	

	while(ui.info.location_minor_next != -1) {
		ui.info.location_minor = ui.info.location_minor_next;
		canvas.background(images[ui.info.location_minor]);

		for(let location = 0; location < locationFunctions.length; location++) {
			if(ui.info.location_minor == location) {
				await locationFunctions[location].call(images);
				break;
			}
		}

		await ui.renderWidgets();

		ui.clearArrows();

		if(ui.info.location_major != locationId) {
			ui.disablePauseButton();
			Player.hide();
			ui.animationBlocked = true;
			NPCManager.clear();
			break;
		}

		//cleanup code, moved here so doesnt get called on first entry to location

		if(ui.info.location_minor_next != ui.info.location_minor) {
			//only on new locations
			await canvas.fadeOut({ref:ui});
		}
		//clear NPCs when switching location
		NPCManager.clear();

		//check game over
		let randomGameOverValue = Math.trunc(Math.random()*ui.settings.random_loss_chance);
		console.log("Random game over", randomGameOverValue);
		switch(randomGameOverValue) {
			case(10):
				await gameOver(getTranslation(40));
				break;
			case(11):
				await gameOver(getTranslation(41));
				break;
			case(12):
				await gameOver(getTranslation(42));
				break;	
		}
	}
}

async function playHandler() {
	await renderCharacterSelection();
	clearCharacterSelection();

	await loadMusic([1]);
	await renderDisclaimer();
	await renderCutscene();

	if(!ui.info.speedrun) {
		//init pause shortcut; just in HNM
		window.addEventListener("keydown", (e) => {
			if(e.code === "Escape") {
				ui.pauseMenuToggle();
			}
		});
	}
	ui.beginTimer();

	await cityHandler(
		[
			"assets/photo/hnm/domov.png",
			"assets/photo/hnm/namesti.jpg",
			"assets/photo/hnm/nadrazi.jpg",
			"assets/photo/hnm/restaurace.jpg",
			"assets/photo/hnm/nastupiste.jpg",
			"assets/photo/hnm/propast.jpg"
		],
		0, 2,
		[49],
		[
			HNMDomov, 
			HNMNamesti, 
			HNMNadrazi,
			HNMRestaurace, 
			HNMNastupiste, 
			HNMPropast
		]
	);
	await cityHandler(
		[
			"assets/photo/prerov/nastupiste.jpg",
			"assets/photo/prerov/nadrazi.jpg",
			"assets/photo/prerov/namesti.jpg",
			"assets/photo/prerov/becva.jpg",
			"assets/photo/prerov/autobus.jpg"
		],
		1, 3,
		[170],
		[
			PrerovNastupiste,
			PrerovNadrazi,
			PrerovNamesti,
			PrerovBecva,
			PrerovAutobus
		]
	);
	await cityHandler(
		[
			"assets/photo/nezamyslice/nastupiste.jpg",
			"assets/photo/nezamyslice/nadrazi.jpg",
			"assets/photo/nezamyslice/podnik_venek.jpg",
			"assets/photo/nezamyslice/podnik_vnitrek.jpg"
		],
		2, 4,
		[0],
		[
			NezamysliceNastupiste, 
			NezamysliceNadrazi, 
			NezamyslicePodnikVenek,
			NezamyslicePodnikVnitrek
		]
	);
	await cityHandler(
		[
			"assets/photo/prostejov/nastupiste.jpg",
			"assets/photo/prostejov/nadrazi.jpg",
			"assets/photo/prostejov/namesti.jpg",
			"assets/photo/prostejov/cafe.jpg",
			"assets/photo/prostejov/obchod.jpg"
		],
		3, 5,
		[],
		[
			ProstejovNastupiste,
			ProstejovNadrazi,
			ProstejovNamesti,
			ProstejovCafe,
			ProstejovObchod,
		]
	);
	await cityHandler(
		[
			"assets/photo/olomouc/nastupiste.jpg",
			"assets/photo/olomouc/nadrazi.jpg",
			"assets/photo/olomouc/namesti.jpg",
			"assets/photo/olomouc/syrarna.jpg",
			"assets/photo/olomouc/restaurant.jpg",
			"assets/photo/olomouc/obchod_venek.jpg",
			"assets/photo/olomouc/obchod_vnitrek.jpg"
		],
		4, 6,
		[0],
		[
			OlomoucNastupiste, 
			OlomoucNadrazi,
			OlomoucNamesti,
			OlomoucSyrarna,
			OlomoucRestaurant,
			OlomoucObchodVenek,
			OlomoucObchodVnitrek
		]
	);
	await cutsceneStudenka();
	await cityHandler(
		[
			"assets/photo/studenka/prejezd.jpg",
			"assets/photo/studenka/nastupiste.jpg",
			"assets/photo/studenka/nadrazi.jpg",
			"assets/photo/studenka/prednadrazi.jpg",
			"assets/photo/studenka/namesti.jpg",
			"assets/photo/studenka/pole.jpg",
			"assets/photo/studenka/most.jpg",
		],
		5, 7,
		[],
		[
			StudenkaPrejezd,
			StudenkaNastupiste,
			StudenkaNadrazi,
			StudenkaPredNadrazi,
			StudenkaNamesti,
			StudenkaPole,
			StudenkaMost,
		]
	);
	await cityHandler(
		[
			"assets/photo/ostrava/nastupiste.jpg",
			"assets/photo/ostrava/nadrazi.jpg",
			"assets/photo/ostrava/nastupiste2.jpg",
		],
		6, 8,
		[],
		[
			OstravaNastupiste,
			OstravaNadrazi,
			OstravaNastupiste2,
		]
	);

	ui.endTimer();

	await cutscenePoland();
	await renderCredits();
}

async function gameHandler() {
	canvas.loadingScreen("Loading..."); //no translations loaded yet
	//text only on first load
	canvas.textS("Translations", 10, 15).textS("Music", 10, 20).textS("SFX", 10, 25).textS("Voice", 10, 30).textS("Characters", 10, 35).textS("Maps", 10, 40);

	await loadMusic([0, 1]); //music
	canvas.loadingItemDone(0);

	await loadSFX(); //sfx
	canvas.loadingItemDone(1);

	await NPCManager.load(); //characters
	canvas.loadingItemDone(2);
	
	await loadTranslation(); //translations
	canvas.loadingItemDone(3);

	await loadVoice(); //voice
	canvas.loadingItemDone(4);

	await loadMaps();
	canvas.textS("Maps done", 10, 40);

	canvas.textS("Loading other images...", 10, 45);
	ui.load(); //ui, arrows and dialogue
	canvas.textS("Loading other images... done", 10, 45);

	document.querySelectorAll(".size_control_buttons").forEach((val) => {
		val.removeAttribute("disabled");
	});

	//Draw main menu

	await loadMainMenu();
	clearMainMenu();

	ui.setupTranslations(); //setup things dependent on translation AFTER main menu

	await playHandler();
}