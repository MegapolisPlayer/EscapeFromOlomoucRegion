let woodImage;
let steelImage;
let mapImages = [];

async function loadMaps() {
	woodImage = await loadImage("assets/map/woodbg.png");
	steelImage = await loadImage("assets/map/steelbg.png");

	for(let i = 0; i < 7; i++) {
		mapImages.push(await loadImage("assets/map/"+String(i+1)+".png"));
	}
}

async function renderMap(day) {
	ui.UIanimationBlocked = true;

	canvas.background(woodImage);
	canvas.image(mapImages[day], 10, 10, (canvas.smallerWindowSize/mapImages[day].height)*0.8);

	canvas.setLargeFontSize().setColor("#ffffff").setFontWeight("bold");
	canvas.textS(getTranslation(50)+" "+String(day), 80, 20);

	canvas.setSmallFontSize().setFontWeight("normal");

	let splitstring = getTranslation(52+day).split(" ");
	let string = splitstring[0]+"\n";
	//if array of size 1 (minimum) this for loop will not be called
	for(let i = 1; i < splitstring.length; i++) {
		string = string.concat(splitstring[i]+" ");
	}
	canvas.textM(string, 80, 30);

	await ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => {}));
	ui.clearArrows();
	ui.UIanimationBlocked = false;
}
