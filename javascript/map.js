async function loadMaps() {
	woodImage = await loadImage("assets/map/woodbg.png");
	steelImage = await loadImage("assets/map/steelbg.png");

	for(let i = 0; i < 7; i++) {
		mapImages.push(await loadImage("assets/map/"+String(i+1)+".png"));
	}
}

async function renderMap(day) {
	canvasBackground(woodImage);
	canvasImage(mapImages[day-1], 10, 10, (smallerWindowSize/mapImages[day-1].height)*0.8);

	canvasSetLargeFont();
	canvasSetColor("#ffffff");
	canvasSetFontWeight("bold");
	canvasTextS(getTranslation(50)+" "+String(day), 80, 20);

	canvasSetSmallFont();
	canvasSetFontWeight("normal");

	let splitstring = getTranslation(52+day-1).split(" ");
	let string = splitstring[0]+"\n";
	//if array of size 1 (minimum) this for loop will not be called
	for(let i = 1; i < splitstring.length; i++) {
		string = string.concat(splitstring[i]+" ");
	}
	canvasTextM(string, 80, 30);

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, () => {}));
}
