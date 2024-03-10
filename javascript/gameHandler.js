// MAIN MENU

function renderMainMenu() {
	canvasBackground(mainMenuImage);

	//render text
	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetBorder("#ffffff");
	canvasSetFontWeight("bold");
	canvasTextAndBorderS(getTranslation(1), 5, 10);

	canvasSetColor("#ffffff");
	canvasSetSmallFont();
	canvasSetFontWeight("normal");
	canvasTextM("Version 2.00-build1, 10.3.2024\nCopyright (c) Martin/MegapolisPlayer, Jiri/KohoutGD, <insert more names here>", (3), (90));

	//render characters (all of them, for show)
	canvasImage(players[0], 20, 50, characterSizeMultiplier);
	canvasImage(players[1], 30, 50, characterSizeMultiplier);
	canvasImage(players[2], 45, 50, characterSizeMultiplier);
	canvasImage(players[3], 55, 50, characterSizeMultiplier);
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
	canvasBackground(mainMenuImage);

	//render text
	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetBorder("#ffffff");
	canvasTextAndBorderS(getTranslation(13), 5, 10);

	if(info.speedrun === true) {
		canvasSetFontSize(20);
		canvasTextAndBorderS(getTranslation(3)+" "+getTranslation(26), 10, 15);
	}


	//add buttons and render characters

	let promises = [];

	for(let i = 0; i < 4; i++) {
		canvasImage(players[i], 5 + i * 25, 50, 0.15);
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
	canvasSetBrightness(50);
	canvasBackground(mainMenuImage);
	canvasResetBrightness();

	canvasSetFontWeight("bold");
	canvasSetLargeFont();
	canvasSetColor("#800000");
	canvasSetBorder("#ffffff");
	canvasTextAndBorderS(getTranslation(43), 5, 10);

	canvasSetFontWeight("normal");
	canvasSetSmallFont();
	canvasSetColor("#ffffff");
	canvasTextM(wrapText(getTranslation(44), canvas.width - canvasX(20)), 10, 20);

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
	]);
}

// BACKSTORY

function renderBackstory() {
	console.log("backstory");
	canvasSetBrightness(75);
	canvasBackground(mainMenuImage);
	canvasResetBrightness();

	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetBorder("#ffffff");
	canvasTextAndBorderS(getTranslation(45), 5, 10);

	canvasSetSmallFont();
	canvasSetColor("#ffffff");
	canvasTextM(wrapText(getTranslation(46), canvas.width - canvasX(20)), 10, 20);

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
	]);
}
// GAME HANDLER

async function playHandler() {
	await renderCharacterSelection();
	clearCharacterSelection();

	await renderDisclaimer();
	await renderBackstory();

	await HNMHandler();
	await PrerovHandler();
	await NezamysliceHandler();
	await ProstejovHandler();
	await OlomoucHandler();
	await StudenkaHandler();
	await OstravaHandler();
}

async function gameHandler() {
	canvasLoading("Loading..."); //no translations yet
	//text only on first load
	canvasTextS("Translations", 10, 15);
	canvasTextS("Music", 10, 20);
	canvasTextS("SFX", 10, 25);
	canvasTextS("Voice", 10, 30);
	canvasTextS("Characters", 10, 35);

	await loadMusic([0, 1]); //music
	canvasLoadingDone(0);

	await loadSFX(); //sfx
	canvasLoadingDone(1);

	await loadCharacters(); //characters
	canvasLoadingDone(2);
	setCharacterInterval(); //set animation interval
	
	await loadTranslation(); //translations
	canvasLoadingDone(3);

	await loadVoice(); //voice
	canvasLoadingDone(4);

	canvasTextS("Loading other images...", 10, 40);
	await loadArrows(); //arrows
	setArrowInterval(); //set interval
	canvasTextS("Loading other images... done", 10, 40);

	await loadMainMenu();
	clearMainMenu();

	playHandler();
}