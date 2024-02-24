async function renderMainMenu() {
	let img = await loadImage("assets/photo/hnm/namesti.jpg");
	canvasImageD(img, 0, 0, canvas.width, canvas.height);

	//render text
	canvasSetColor("#000080");
	canvasSetFontSize(48);
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
	"load", "Load Game", canvasX(65), canvasY(30), canvasX(30), canvasY(15),
	(e) => { console.log("MM btn Load Game pressed"); loadGame(); }
	);
	addButton(
	"settings", "Settings", canvasX(65), canvasY(45), canvasX(30), canvasY(15),
	(e) => { console.log("MM btn Settings pressed"); renderSettings(); }
	);
	addButton(
	"credits", "Credits", canvasX(65), canvasY(60), canvasX(30), canvasY(15),
	(e) => { console.log("MM btn Credits pressed"); clearMainMenu(); renderCredits(); } 
	); //reloads window
	
	//audio buttons
	addButton(
		"audio", "Enable audio", canvasX(65), canvasY(75), canvasX(30), canvasY(15),
		(e) => { console.log("MM audio btn pressed"); restartTrack(0); toggleAudio(); }
	);
	
	//wait until PLAY button pressed
	await waiterEventFromElement(
		addButton(
		"play", "Play", canvasX(65), canvasY(15), canvasX(30), canvasY(15),
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

async function renderCharacterSelection() {
	
}
async function clearCharacterSelection() {

}

async function gameHandler() {
	canvasClear("purple");
	canvasTextS("Loading...", canvasX(10), canvasY(10));
	canvasSetFontSize(20);

	//load stuff
	canvasTextS("Music", canvasX(10), canvasY(15));
	await loadMusic(); //music
	canvasTextS("Music done", canvasX(10), canvasY(15));

	canvasTextS("Characters", canvasX(10), canvasY(20));
	await loadCharacters(); //characters
	canvasTextS("Characters done", canvasX(10), canvasY(20));

	canvasTextS("Translations", canvasX(10), canvasY(25));
	await loadTranslation(); //translations
	canvasTextS("Translations done", canvasX(10), canvasY(25));

	await renderMainMenu();

	clearMainMenu();

	await renderCharacterSelection();
}