function initWebpage() {
	canvasInit();
	canvasOriginal();
	canvasClear("#ffffff");
	canvasSetFont("Arial, FreeSans", String(fontSizeMultiplier*biggerWindowSize), "bold");

	//begin game
	gameHandler();
}

