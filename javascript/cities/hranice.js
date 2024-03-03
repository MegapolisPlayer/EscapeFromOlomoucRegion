let HNMimages = [];
let HNMnextLocation = 0;

async function HNMDomov() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasCharacter(70, 60, 2.5);
	renderMoney();
	renderSpeedrunMode();

	return renderArrows([new ArrowInfo(90, 80, arrowType.RIGHT, () => { HNMnextLocation = 1; })]);
}

async function HNMNamesti() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasCharacter(50, 60, 1);
	renderMoney();
	renderSpeedrunMode();
	
	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { HNMnextLocation = 0; }),
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { HNMnextLocation = 2; })
	]);
}

async function HNMNadrazi() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasCharacter(35, 60, 1.7);
	renderMoney();
	renderSpeedrunMode();

	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { HNMnextLocation = 1; }),
		new ArrowInfo(95, 75, arrowType.UP, () => { HNMnextLocation = 3; }),
		new ArrowInfo(85, 85, arrowType.DOWN, () => { HNMnextLocation = 4; })
	]);
}

async function HNMRestaurace() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasCharacter(70, 90, 2); //for player
	renderMoney();
	renderSpeedrunMode();
	
	return renderArrows([
		new ArrowInfo(90, 90, arrowType.DOWN, () => { HNMnextLocation = 2; }),
	]);
}

async function HNMNastupiste() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasCharacter(65, 70, 1.3);
	renderMoney();
	renderSpeedrunMode();

	return renderArrows([
		new ArrowInfo(50, 90, arrowType.DOWN, () => { HNMnextLocation = 2; }),
	]);
}

async function HNMHandler() {
	// HANDLER <-> DOMOV
	//             NAMESTI
	//             NADRAZI
	//             NASTUPISTE
	//             RESTAURACE
	
	// handler is a loop, return NextLocation as variable
	// wait until any function returns, then run again
	// when returning: set next location value, return promise
	
	console.log("HNM");

	info.location_major = 1;
	
	canvasLoading();
	await loadMusic([2]);
	HNMimages = await loadImages([
		"assets/photo/hnm/domov.png",
		"assets/photo/hnm/namesti.jpg",
		"assets/photo/hnm/nadrazi.jpg",
		"assets/photo/hnm/restaurace.jpg",
		"assets/photo/hnm/nastupiste.jpg"
	]);
	
	musicPlay(2); //start playing AFTER loading

	let HNMpromise;
	while(HNMnextLocation != -1) {
		info.location_minor = HNMnextLocation;

		switch(info.location_minor) {
			case(-1): break; //to next city
			case(0): HNMpromise = HNMDomov(); break;
			case(1): HNMpromise = HNMNamesti(); break;
			case(2): HNMpromise = HNMNadrazi(); break;
			case(3): HNMpromise = HNMRestaurace(); break;
			case(4): HNMpromise = HNMNastupiste(); break;
		}

		//we wait until any promise met, then loop again
		await HNMpromise;
	}

	return;
}