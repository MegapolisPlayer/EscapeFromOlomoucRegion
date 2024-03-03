function renderSpeedrunMode() {
	if(info.speedrun) {
		canvasSetColor("#ffffff");
		canvasRoundedBox(80, 10, 20, 20, 10);
		canvasSetColor("#000080");
		canvasSetSmallFont();
		canvasTextS(getTranslation(3), 83, 17);
		canvasTextS("//TODO: timer", 83, 27);
	}
}