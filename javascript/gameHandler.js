// MAIN MENU

function renderMainMenu() {
	canvas.background(mainMenuImage);

	//render text
	canvas.setLargeFontSize();
	canvas.setColor("#000080");
	canvas.setBorder("#ffffff");
	canvas.setFontWeight("bold");
	canvas.textAndBorderS(getTranslation(1), 5,  10);

	canvas.setColor("#ffffff");
	canvas.setSmallFontSize();
	canvas.setFontWeight("normal");
	//Date changes here!!!
	canvas.textM("Version 2.00, 15.7.2024\nCopyright (c) Martin/MegapolisPlayer, Jiri/KohoutGD, Petr/Vrtulka103", 3, 90);

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
	addButton(
		"load", getTranslation(4), 65, 35, 30, 10,
		(e) => { console.log("MM btn Load Game pressed"); loadGame(); }
	);
	addButton(
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
			document.getElementById("audio").innerHTML = ((settings.music_enabled == true) ? getTranslation(9) : getTranslation(8));
			
			renderMainMenu();
			showMainMenu();
		}
	);
	addButton(
		"credits", getTranslation(6), 65, 55, 30, 10,
		(e) => { console.log("MM btn Credits pressed"); clearMainMenu(); renderCredits(); } 
	); //reloads window
	
	//audio buttons
	addButton(
		"audio", getTranslation(8), 65, 65, 30, 10,
		(e) => { console.log("MM audio btn pressed"); musicRestart(0); audioToggle(e.target); musicPlay(0); }
	);
	
	let promises = [];

	promises.push(waiterEventFromElement(
		addButton(
		"play", getTranslation(2), 65, 15, 30, 10,
		(e) => { info.speedrun = false; console.log("MM btn Play pressed"); }
	), "click"));
	promises.push(waiterEventFromElement(
		addButton(
		"speedrun", getTranslation(3), 65, 25, 30, 10,
		(e) => { info.speedrun = true; console.log("MM btn Speedrun pressed"); } 
	), "click"));

	await Promise.any(promises);
}
function showMainMenu() {
	showButton("play");
	showButton("speedrun");
	showButton("load");
	showButton("settings");
	showButton("credits");
	showButton("audio");
}
function hideMainMenu() {
	hideButton("play");
	hideButton("speedrun");
	hideButton("load");
	hideButton("settings");
	hideButton("credits");
	hideButton("audio");
}
function clearMainMenu() {
	removeButton("play");
	removeButton("speedrun");
	removeButton("load");
	removeButton("settings");
	removeButton("credits");
	removeButton("audio");
}

// CHARACTER SELECTION

async function renderCharacterSelection() {
	canvas.background(mainMenuImage);

	//render text
	canvas.setLargeFontSize();
	canvas.setColor("#000080");
	canvas.setBorder("#ffffff");
	canvas.textAndBorderS(getTranslation(13), 5, 10);

	if(info.speedrun === true) {
		canvas.setFontSize(20);
		canvas.textAndBorderS(getTranslation(3)+" "+getTranslation(26), 10, 15);
	}


	//add buttons and render characters

	let promises = [];

	for(let i = 0; i < 4; i++) {
		canvas.image(players[i], 5 + i * 25, 50, canvas.characterSizeMultiplier);
		promises.push(
			waiterEventFromElement(
				addSmallButton(
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
		removeButton("select"+String(i));	
	}
}

// DISCLAIMER

function renderDisclaimer() {
	console.log("disclaimer");

	musicPlay(1);
	canvas.setBrightness(50);
	canvas.background(mainMenuImage);
	canvas.resetBrightness();

	canvas.setFontWeight("bold");
	canvas.setLargeFontSize();
	canvas.setColor("#800000");
	canvas.setBorder("#ffffff");
	canvas.textAndBorderS(getTranslation(43), 5, 10);

	canvas.setFontWeight("normal");
	canvas.setSmallFontSize();
	canvas.setColor("#ffffff");
	canvas.textM(wrapText(getTranslation(44), 80), 10, 20);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}

// CUTSCENE

async function renderCutscene() {
	console.log("cutscene");
	canvas.setBrightness(75);
	canvas.background(mainMenuImage);

	await canvas.fadeOut(5);
	if(!info.speedrun) {
		await cutsceneNews();
		await canvas.fadeOut();
	}
}

// GAME OVER SCREEN

async function gameOver(text) {
	canvas.animationBlocked = true;
	getAllInput().forEach((val) => { val.remove(); });

	musicPlay(1);
	canvas.clear("#000000");

	canvas.setColor("#800000");
	canvas.setFontWeight("bold");
	canvas.setLargeFontSize();
	canvas.textS(getTranslation(59), 10, 20);

	canvas.setColor("#ffffff");
	canvas.setFontWeight("normal");
	canvas.setSmallFontSize();
	canvas.textM(wrapText(text, 80), 10, 40);

	await waiterEventFromElement(
		addButton(
		"quit", getTranslation(12), 80, 90, 20, 10,
		(e) => { removeButton("quit"); }
	), "click");

	window.location.reload();
}

// GAME HANDLER

async function playHandler() {
	await renderCharacterSelection();
	clearCharacterSelection();

	await renderDisclaimer();
	await renderCutscene();

	timerBegin();

	await HNMHandler();
	await PrerovHandler();
	await NezamysliceHandler();
	await ProstejovHandler();
	await OlomoucHandler();
	await cutsceneStudenka();
	await StudenkaHandler();
	await OstravaHandler();
	timerEnd();
	await cutscenePoland();
	await renderCredits();
}

async function gameHandler() {
	canvas.loadingScreen("Loading..."); //no translations loaded yet
	//text only on first load
	canvas.textS("Translations", 10, 15);
	canvas.textS("Music", 10, 20);
	canvas.textS("SFX", 10, 25);
	canvas.textS("Voice", 10, 30);
	canvas.textS("Characters", 10, 35);
	canvas.textS("Maps", 10, 40);

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
	await loadArrows(); //arrows
	canvas.textS("Loading other images... done", 10, 45);

	document.querySelectorAll(".size_control_buttons").forEach((val) => {
		val.removeAttribute("disabled");
	});

	//Draw main menu

	await loadMainMenu();
	clearMainMenu();

	await loadPause(); //pause menu AFTER main menu, already when language is selected

	playHandler();
}
