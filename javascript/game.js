var canvas; //we do actually need var here
var ui; //we do actually need var here
let mainMenuImage;

// MAIN MENU

function renderMainMenu() {
	canvas.background(mainMenuImage);

	//render text
	canvas.setLargeFontSize().setColor("#000080").setBorder("#ffffff").setFontWeight("bold");
	canvas.textAndBorderS(getTranslation(1), 5,  10);

	canvas.setColor("#ffffff").setSmallFontSize().setFontWeight("normal");
	//Date changes here!!!
	canvas.textM("Version 2.00, D.M.2024\nCopyright (c) Martin/MegapolisPlayer, Jiri/KohoutGD, Petr/Vrtulka103", 3, 90);

	//render characters (all of them, for show)
	canvas.image(players[0], 20, 50, canvas.characterSizeMultiplier);
	canvas.image(players[1], 30, 50, canvas.characterSizeMultiplier);
	canvas.image(players[2], 45, 50, canvas.characterSizeMultiplier);
	canvas.image(players[3], 55, 50, canvas.characterSizeMultiplier);
}

async function loadMainMenu() {
	mainMenuImage = await loadImage("assets/photo/hnm/namesti.jpg");
	renderMainMenu();

	//play buttons
	ui.addButton(
		"load", getTranslation(4), 65, 35, 30, 10,
		(e) => { console.log("MM btn Load Game pressed"); loadGame(); }
	);
	ui.addButton(
		"settings", getTranslation(5), 65, 45, 30, 10,
		async (e) => { 
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
		(e) => { console.log("MM btn Credits pressed"); clearMainMenu(); renderCredits(); } 
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
		(e) => { ui.info.speedrun = false; console.log("MM btn Play pressed"); }
	), "click"));
	promises.push(waiterEventFromElement(
		ui.addButton(
		"speedrun", getTranslation(3), 65, 25, 30, 10,
		(e) => { ui.info.speedrun = true; console.log("MM btn Speedrun pressed"); }
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
		canvas.image(players[i], 5 + i * 25, 50, canvas.characterSizeMultiplier);
		promises.push(
			waiterEventFromElement(
				ui.addSmallButton(
					"select"+String(i), getTranslation(14), 4 + i * 25, 90, 10, 10,
					(e) => { selectedPlayer = i; }
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
	ui.animationBlocked = true;
	ui.getAllInput().forEach((val) => { val.remove(); });

	musicPlay(1);
	canvas.clear("#000000");

	canvas.setColor("#800000").setFontWeight("bold").setLargeFontSize();
	canvas.textS(getTranslation(59), 10, 20);

	canvas.setColor("#ffffff").setFontWeight("normal").setSmallFontSize();
	canvas.textM(wrapText(text, 80), 10, 40);

	await waiterEventFromElement(
		ui.addButton(
		"quit", getTranslation(12), 80, 90, 20, 10,
		(e) => { ui.removeButton("quit"); }
	), "click");

	window.location.reload();
}

// GAME HANDLER

async function playHandler() {
	await renderCharacterSelection();
	clearCharacterSelection();

	await renderDisclaimer();
	await renderCutscene();

	ui.beginTimer();

	await HNMHandler();
	await PrerovHandler();
	await NezamysliceHandler();
	await ProstejovHandler();
	await OlomoucHandler();
	await cutsceneStudenka();
	await StudenkaHandler();
	await OstravaHandler();
	ui.endTimer();
	await cutscenePoland();
	await renderCredits();
}

async function gameHandler() {
	canvas = new CanvasImplementation();
	ui = new UIImplementation();

	canvas.loadingScreen("Loading..."); //no translations loaded yet
	//text only on first load
	canvas.textS("Translations", 10, 15).textS("Music", 10, 20).textS("SFX", 10, 25).textS("Voice", 10, 30).textS("Characters", 10, 35).textS("Maps", 10, 40);

	await loadMusic([0, 1]); //music
	canvas.loadingItemDone(0);

	await loadSFX(); //sfx
	canvas.loadingItemDone(1);

	await loadCharacters(); //characters
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
