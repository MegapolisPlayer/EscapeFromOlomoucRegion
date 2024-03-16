let HNMimages = [];

async function HNMDomov() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasPlayer(70, 60, 2.5);
	renderMoney();
	renderSpeedrunMode();

	return renderArrow(new ArrowInfo(90, 80, arrowType.RIGHT, async () => { info.location_minor_next = 1; }));
}

async function HNMNamesti() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasPlayer(50, 60, 1);
	renderMoney();
	renderSpeedrunMode();
	
	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { info.location_minor_next = 0; }),
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { info.location_minor_next = 2; })
	]);
}

async function HNMNadrazi() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasPlayer(35, 60, 1.7);
	renderMoney();
	renderSpeedrunMode();

	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { info.location_minor_next = 1; }),
		new ArrowInfo(95, 75, arrowType.UP, () => { info.location_minor_next = 3; }),
		new ArrowInfo(85, 85, arrowType.DOWN, () => { info.location_minor_next = 4; })
	]);
}

async function HNMRestaurace() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasNPC(NPC.COOK, 90, 50, 2);
	canvasPlayer(70, 90, 3); //for player
	renderMoney();
	renderSpeedrunMode();
	
	return renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, () => { info.location_minor_next = 2; }));
}

async function HNMNastupiste() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasPlayer(65, 70, 1.3);
	canvasNPC(NPC.STATION, 40, 70, 1.3);
	renderMoney();
	renderSpeedrunMode();

	return renderArrow(new ArrowInfo(50, 90, arrowType.DOWN, () => { info.location_minor_next = 2; }));
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

	info.location_major = 0;
	info.location_minor = 0;
	info.location_minor_next = 0;
	
	canvasLoading();
	await loadMusic([2, 10]);
	HNMimages = await loadImages([
		"assets/photo/hnm/domov.png",
		"assets/photo/hnm/namesti.jpg",
		"assets/photo/hnm/nadrazi.jpg",
		"assets/photo/hnm/restaurace.jpg",
		"assets/photo/hnm/nastupiste.jpg"
	]);
	
	//map
	if(!info.speedrun) {
		musicPlay(1);
		await renderMap(1);
		await canvasFadeOut();
	}

	musicPlay(2); //start playing AFTER loading

	canvasBackground(HNMimages[info.location_minor]);
	canvasPlayer(70, 60, 2.5);
	
	//entry dialogue
	if(!info.speedrun) {
		dialogueBegin();
		await dialogueNext(0);
		dialogueEnd();
	}

	let promise;
	while(info.location_minor_next != -1) {
		info.location_minor = info.location_minor_next;

		switch(info.location_minor) {
			case(-1): break; //to next city
			case(0): promise = HNMDomov(); break;
			case(1): promise = HNMNamesti(); break;
			case(2): promise = HNMNadrazi(); break;
			case(3): promise = HNMRestaurace(); break;
			case(4): promise = HNMNastupiste(); break;
		}

		//we wait until any promise met, then loop again
		await promise;

		//cleanup code, moved here so doesnt get called on first entry to location

		await canvasFadeOut();
		//clear NPCs when switching location
		canvasNPCClear();
	}

	return;
}