function initWebpage() {
	canvasInit();
	canvasOriginal();
	canvasClear("#ffffff");
	canvasSetColor("#ffffff");
	canvasSetBorder("#ffffff");
	canvasSetFont("Arial, FreeSans", String(fontSizeMultiplier*biggerWindowSize), "bold");

	//begin game
	gameHandler();
}

//canvas resize functions

function canvasResizeTo() {

}