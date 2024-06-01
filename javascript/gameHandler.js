// MAIN MENU

function renderMainMenu() {
	canvasBackground(canvas, ctx, mainMenuImage);

	//render text
	canvasSetLargeFont(canvas, ctx);
	canvasSetColor(canvas, ctx, "#000080");
	canvasSetBorder(canvas, ctx, "#ffffff");
	canvasSetFontWeight(canvas, ctx, "bold");
	canvasTextAndBorderS(canvas, ctx, getTranslation(1), 5,  10);

	canvasSetColor(canvas, ctx, "#ffffff");
	canvasSetSmallFont(canvas, ctx);
	canvasSetFontWeight(canvas, ctx, "normal");
	//Date changes here!!!
	canvasTextM(canvas, ctx, "Version 2.00, 2.6.2024\nCopyright (c) Martin/MegapolisPlayer, Jiri/KohoutGD, Petr/Vrtulka103", 3, 90);

	//render characters (all of them, for show)
	canvasImage(canvas, ctx, players[0], 20, 50, characterSizeMultiplier);
	canvasImage(canvas, ctx, players[1], 30, 50, characterSizeMultiplier);
	canvasImage(canvas, ctx, players[2], 45, 50, characterSizeMultiplier);
	canvasImage(canvas, ctx, players[3], 55, 50, characterSizeMultiplier);
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
	canvasBackground(canvas, ctx, mainMenuImage);

	//render text
	canvasSetLargeFont(canvas, ctx);
	canvasSetColor(canvas, ctx, "#000080");
	canvasSetBorder(canvas, ctx, "#ffffff");
	canvasTextAndBorderS(canvas, ctx, getTranslation(13), 5, 10);

	if(info.speedrun === true) {
		canvasSetFontSize(canvas, ctx, 20);
		canvasTextAndBorderS(canvas, ctx, getTranslation(3)+" "+getTranslation(26), 10, 15);
	}


	//add buttons and render characters

	let promises = [];

	for(let i = 0; i < 4; i++) {
		canvasImage(canvas, ctx, players[i], 5 + i * 25, 50, characterSizeMultiplier);
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
	canvasSetBrightness(canvas, ctx, 50);
	canvasBackground(canvas, ctx, mainMenuImage);
	canvasResetBrightness(canvas, ctx);

	canvasSetFontWeight(canvas, ctx, "bold");
	canvasSetLargeFont(canvas, ctx);
	canvasSetColor(canvas, ctx, "#800000");
	canvasSetBorder(canvas, ctx, "#ffffff");
	canvasTextAndBorderS(canvas, ctx, getTranslation(43), 5, 10);

	canvasSetFontWeight(canvas, ctx, "normal");
	canvasSetSmallFont(canvas, ctx);
	canvasSetColor(canvas, ctx, "#ffffff");
	canvasTextM(canvas, ctx, wrapText(getTranslation(44), 80), 10, 20);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}

// CUTSCENE

async function renderCutscene() {
	console.log("cutscene");
	canvasSetBrightness(canvas, ctx, 75);
	canvasBackground(canvas, ctx, mainMenuImage);

	await canvasFadeOut(canvas, ctx, 5);
	if(!info.speedrun) {
		await cutsceneNews();
		await canvasFadeOut(canvas, ctx, );
	}
}

// GAME OVER SCREEN

async function gameOver(text) {
	animationBlocked = true;
	getAllInput().forEach((val) => { val.remove(); });

	musicPlay(1);
	canvasClear(canvas, ctx, "#000000");

	canvasSetColor(canvas, ctx, "#800000");
	canvasSetFontWeight(canvas, ctx, "bold");
	canvasSetLargeFont(canvas, ctx);
	canvasTextS(canvas, ctx, getTranslation(59), 10, 20);

	canvasSetColor(canvas, ctx, "#ffffff");
	canvasSetFontWeight(canvas, ctx, "normal");
	canvasSetSmallFont(canvas, ctx);
	canvasTextM(canvas, ctx, wrapText(text, 80), 10, 40);

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
	canvasLoading(canvas, ctx, "Loading..."); //no translations yet
	//text only on first load
	canvasTextS(canvas, ctx, "Translations", 10, 15);
	canvasTextS(canvas, ctx, "Music", 10, 20);
	canvasTextS(canvas, ctx, "SFX", 10, 25);
	canvasTextS(canvas, ctx, "Voice", 10, 30);
	canvasTextS(canvas, ctx, "Characters", 10, 35);
	canvasTextS(canvas, ctx, "Maps", 10, 40);

	await loadMusic([0, 1]); //music
	canvasLoadingDone(canvas, ctx, 0);

	await loadSFX(); //sfx
	canvasLoadingDone(canvas, ctx, 1);

	await loadCharacters(); //characters
	canvasLoadingDone(canvas, ctx, 2);
	
	await loadTranslation(); //translations
	canvasLoadingDone(canvas, ctx, 3);

	await loadVoice(); //voice
	canvasLoadingDone(canvas, ctx, 4);

	await loadMaps();
	canvasTextS(canvas, ctx, "Maps done", 10, 40);

	canvasTextS(canvas, ctx, "Loading other images...", 10, 45);
	await loadArrows(); //arrows
	canvasTextS(canvas, ctx, "Loading other images... done", 10, 45);

	document.querySelectorAll(".size_control_buttons").forEach((val) => {
		val.removeAttribute("disabled");
	});

	//Draw main menu

	await loadMainMenu();
	clearMainMenu();

	await loadPause(); //pause menu AFTER main menu, already when language is selected

	playHandler();
}