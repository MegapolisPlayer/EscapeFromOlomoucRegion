async function renderMainMenu() {
	let img = await loadImage("assets/photo/hnm/namesti.jpg");
	canvasImage(img, 0, 0, canvas.width, canvas.height);

	canvasSetColor("#000080");
	canvasTextS("Escape from the Olomouc Region", canvasX(5), canvasY(10));
	canvasSetColor("#ffffff");
	canvasTextBorderS("Escape from the Olomouc Region", canvasX(5), canvasY(10));

	addButton("play", "Play", canvasX(65), canvasY(25), canvasX(30), canvasY(20));
	addButton("settings", "Settings", canvasX(65), canvasY(45), canvasX(30), canvasY(20));
	addButton("credits", "Credits", canvasX(65), canvasY(65), canvasX(30), canvasY(20));
	
}
function clearMainMenu() {

}

function renderCharacterSelection() {

}
function clearCharacterSelection() {

}

function gameHandler() {
	renderMainMenu();
}