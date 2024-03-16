async function loadMaps() {
	mapBGImage = await loadImage("assets/map/mapbg.png");

	for(let i = 0; i < 7; i++) {
		mapImages.push(await loadImage("assets/map/"+String(i+1)+".png"));
	}
}

async function renderMap(day) {
	canvasBackground(mapBGImage);
	canvasImage(mapImages[day-1], 10, 10, (smallerWindowSize/mapImages[day-1].height)*0.8);

	canvasSetLargeFont();
	canvasSetColor("#ffffff");
	canvasSetFontWeight("bold");
	canvasTextS(getTranslation(50)+" "+String(day), 80, 20);

	canvasSetSmallFont();
	canvasSetFontWeight("normal");
	canvasTextS(getTranslation(52+day-1), 70, 30);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}
