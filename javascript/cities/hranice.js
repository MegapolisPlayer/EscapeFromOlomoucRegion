let HNMimages = [];

function HNMDomov() {
	canvasPlayer(70, 60, 2.5);

	return renderArrow(new ArrowInfo(90, 80, arrowType.RIGHT, async () => { info.location_minor_next = 1; }));
}

function HNMNamesti() {
	canvasPlayer(50, 60, 1);
	
	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { info.location_minor_next = 0; }),
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { info.location_minor_next = 2; }),
		new ArrowInfo(45, 90, arrowType.DOWN, () => { info.location_minor_next = 5; })
	]);
}

function HNMNadrazi() {
	canvasPlayer(35, 60, 1.7);

	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { info.location_minor_next = 1; }),
		new ArrowInfo(95, 75, arrowType.UP, () => { info.location_minor_next = 3; }),
		new ArrowInfo(85, 85, arrowType.DOWN, () => { info.location_minor_next = 4; })
	]);
}

function HNMRestaurace() {
	canvasPlayer(70, 90, 3);
	canvasNPC(NPC.COOK, 90, 50, 2, async (e) => {
		hideAllInput();

		dialogueBegin();
		await dialogueNext(0);
		dialogueEnd();
		await minigameWaiter();
		
		musicPlay(2);
		canvasBackground(HNMimages[info.location_minor]);
		canvasPlayer(70, 90, 3);
		canvasDrawNPC(NPC.COOK, 90, 50, 2);
		await renderMoney();
		renderSpeedrunMode();
		renderPause();
		showAllInput();
	});
	
	return renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, () => { info.location_minor_next = 2; }));
}

function HNMNastupiste() {
	canvasPlayer(65, 70, 1.3);

	return Promise.any([
	renderArrow(new ArrowInfo(50, 90, arrowType.DOWN, () => { info.location_minor_next = 2; })),
	canvasNPC(NPC.TRAIN, 40, 70, 1.3, (e) => {
		clearArrows();
		e.target.remove();
		info.location_minor_next = -1;
		info.location_major++;
	})]);
}

let HNMPropastEndingTimer;
let HNMVisitedPropast = false;

function HNMPropast() {
	canvasPlayer(10, 90, 2.5);
	HNMVisitedPropast = true;
	HNMPropastEndingTimer = Date.now();

	return renderArrow(new ArrowInfo(40, 90, arrowType.DOWN, () => { info.location_minor_next = 1; }));
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
		"assets/photo/hnm/nastupiste.jpg",
		"assets/photo/hnm/propast.jpg"
	]);
	
	//map
	if(!info.speedrun) {
		musicPlay(1);
		await renderMap(1);
		await canvasFadeOut();
	}

	musicPlay(2); //start playing AFTER loading
	animationBlocked = false;

	showPause();
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

		console.log("HNM "+info.location_minor);
		canvasBackground(HNMimages[info.location_minor]);

		switch(info.location_minor) {
			case(0): promise = HNMDomov(); break;
			case(1): promise = HNMNamesti(); break;
			case(2): promise = HNMNadrazi(); break;
			case(3): promise = HNMRestaurace(); break;
			case(4): promise = HNMNastupiste(); break;
			case(5): promise = HNMPropast(); break;
			default: break;
		}
		await renderMoney();
		renderSpeedrunMode();
		renderPause();

		//we wait until any promise met, then loop again
		await promise;

		if(info.location_major != 0) { 
			hidePause();
			canvasPlayerDisable();
			animationBlocked = true;
			break;
		}

		//cleanup code, moved here so doesnt get called on first entry to location

		await canvasFadeOut();
		//clear NPCs when switching location
		canvasNPCClear();
	}
}