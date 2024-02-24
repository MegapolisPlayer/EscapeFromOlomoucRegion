// MAIN MENU

let mainMenuImage;

async function renderMainMenu() {
	mainMenuImage = await loadImage("assets/photo/hnm/namesti.jpg");
	canvasImageD(mainMenuImage, 0, 0, canvas.width, canvas.height);

	//render text
	canvasSetFontSize(48);
	canvasSetColor("#000080");
	canvasSetBorder("#ffffff");
	canvasTextBorderS("Escape from the Olomouc Region", canvasX(5), canvasY(10));
	canvasTextS("Escape from the Olomouc Region", canvasX(5), canvasY(10));

	canvasSetColor("#ffffff");
	canvasSetFontSize(20);
	canvasSetFontWeight("normal");
	canvasTextM("Version 2.00-build1, 24.2.2024\nCopyright (c) Martin/MegapolisPlayer, Jiri/KohoutGD, <insert more names here>", canvasX(3), canvasY(90));

	//render characters (all of them, for show)
	canvasImage(players[0], canvasX(20), canvasY(50), 0.15);
	canvasImage(players[1], canvasX(30), canvasY(50), 0.15);
	canvasImage(players[2], canvasX(45), canvasY(50), 0.15);
	canvasImage(players[3], canvasX(55), canvasY(55), 0.15);

	//play buttons
	addButton(
	"load", getTranslation(3), canvasX(65), canvasY(30), canvasX(30), canvasY(15),
	(e) => { console.log("MM btn Load Game pressed"); loadGame(); }
	);
	addButton(
	"settings", getTranslation(4), canvasX(65), canvasY(45), canvasX(30), canvasY(15),
	(e) => { console.log("MM btn Settings pressed"); renderSettings(); }
	);
	addButton(
	"credits", getTranslation(5), canvasX(65), canvasY(60), canvasX(30), canvasY(15),
	(e) => { console.log("MM btn Credits pressed"); clearMainMenu(); renderCredits(); } 
	); //reloads window
	
	//audio buttons
	addButton(
		"audio", getTranslation(7), canvasX(65), canvasY(75), canvasX(30), canvasY(15),
		(e) => { console.log("MM audio btn pressed"); musicRestart(0); audioToggle(e.target); musicPlay(0); }
	);
	
	//wait until PLAY button pressed
	await waiterEventFromElement(
		addButton(
		"play", getTranslation(2), canvasX(65), canvasY(15), canvasX(30), canvasY(15),
		(e) => {console.log("MM btn Play pressed"); }
	), "click");

}	
async function clearMainMenu() {
	removeButton("play");
	removeButton("load");
	removeButton("settings");
	removeButton("credits");

	removeButton("audio");
}

// CHARACTER SELECTION

async function renderCharacterSelection() {
	canvasImageD(mainMenuImage, 0, 0, canvas.width, canvas.height);

	//render text
	canvasSetFontSize(48);
	canvasSetColor("#000080");
	canvasSetBorder("#ffffff");
	canvasTextAndBorderS(getTranslation(12), canvasX(5), canvasY(10));

	//render characters (all of them, for show)
	canvasImage(players[0], canvasX(5), canvasY(50), 0.15);
	canvasImage(players[1], canvasX(30), canvasY(50), 0.15);
	canvasImage(players[2], canvasX(55), canvasY(50), 0.15);
	canvasImage(players[3], canvasX(80), canvasY(50), 0.15);

	//add buttons

	let promises = [];

	for(let i = 0; i < 4; i++) {
		promises.push(
			waiterEventFromElement(
			addSmallButton(
				"select"+String(i), getTranslation(13), canvasX(4 + i * 25), canvasY(90), canvasX(10), canvasY(10),
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

}
function clearDisclaimer() {

}

// BACKSTORY

function renderBackstory() {

}
function clearBackstory() {

}

// GAME HANDLER

async function gameHandler() {
	canvasLoading("Loading...");
	
	await loadMusic([0, 1]); //music
	canvasLoadingDone(0);

	await loadSFX(); //sfx
	canvasLoadingDone(1);

	await loadCharacters(); //characters
	canvasLoadingDone(2);
	
	await loadTranslation(); //translations
	canvasLoadingDone(3);

	await loadVoice(); //voice
	canvasLoadingDone(4);

	await renderMainMenu();

	clearMainMenu();

	await renderCharacterSelection();

	clearCharacterSelection();


}