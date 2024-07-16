let HNMimages = [];

function HNMDomov() {
	canvasPlayer(70, 60, 2.5);

	return renderArrow(new ArrowInfo(90, 80, arrowType.RIGHT, async () => { ui.info.location_minor_next = 1; }));
}

function HNMNamesti() {
	canvasPlayer(50, 60, 1);
	
	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { ui.info.location_minor_next = 0; }),
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(45, 90, arrowType.DOWN, () => { ui.info.location_minor_next = 5; })
	]);
}

function HNMNadrazi() {
	canvasPlayer(35, 60, 1.7);

	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(95, 75, arrowType.UP, () => { ui.info.location_minor_next = 3; }),
		new ArrowInfo(85, 85, arrowType.DOWN, () => { ui.info.location_minor_next = 4; })
	]);
}

function HNMRestaurace() {
	canvasPlayer(70, 90, 3);
	makeNPC(NPC.COOK, 90, 50, 2, async (e) => {
		hideAllInput();

		dialogueBegin();
		await dialogueNext(0);
		if(await dialogueChoice()) {
			dialogueEnd();
			await minigameWaiter();
		}
		dialogueEnd();
		musicPlay(2);
		canvas.background(HNMimages[ui.info.location_minor]);
		canvasPlayer(70, 90, 3);
		drawNPC(NPC.COOK, 90, 50, 2);
		await ui.renderWidgets();

		showAllInput();
	});
	
	return renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, () => { ui.info.location_minor_next = 2; }));
}

function HNMNastupiste() {
	canvasPlayer(65, 70, 1.3);

	return Promise.any([
	renderArrow(new ArrowInfo(50, 90, arrowType.DOWN, () => { ui.info.location_minor_next = 2; })),
	makeNPC(NPC.TRAIN, 40, 70, 1.3, (e) => {
		clearArrows();
		e.target.remove();
		ui.info.location_minor_next = -1;
		ui.info.location_major++;
	})]);
}

let HNMPropastEndingTimer;
let HNMVisitedPropast = false;

function HNMPropast() {
	canvasPlayer(10, 90, 2.5);
	HNMVisitedPropast = true;
	HNMPropastEndingTimer = Date.now();

	return renderArrow(new ArrowInfo(40, 90, arrowType.DOWN, () => { ui.info.location_minor_next = 1; }));
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

	ui.info.location_major = 0;
	ui.info.location_minor = 0;
	ui.info.location_minor_next = 0;
	
	canvas.loadingScreen();
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
	if(!ui.info.speedrun) {
		musicPlay(1);
		await renderMap(1);
		await canvas.fadeOut({ref:ui});
	}

	musicPlay(2); //start playing AFTER loading
	ui.animationBlocked = false;

	ui.enablePauseButton();
	canvas.background(HNMimages[ui.info.location_minor]);
	canvasPlayer(70, 60, 2.5);
	
	//entry dialogue
	if(!ui.info.speedrun) {
		dialogueBegin();
		await dialogueNext(0);
		dialogueEnd();
	}

	let promise;
	while(ui.info.location_minor_next != -1) {
		ui.info.location_minor = ui.info.location_minor_next;

		console.log("HNM "+ui.info.location_minor);
		canvas.background(HNMimages[ui.info.location_minor]);

		switch(ui.info.location_minor) {
			case(0): promise = HNMDomov(); break;
			case(1): promise = HNMNamesti(); break;
			case(2): promise = HNMNadrazi(); break;
			case(3): promise = HNMRestaurace(); break;
			case(4): promise = HNMNastupiste(); break;
			case(5): promise = HNMPropast(); break;
			default: break;
		}
		await ui.renderWidgets();

		//we wait until any promise met, then loop again
		await promise;

		if(ui.info.location_major != 0) {
			ui.disablePauseButton();
			canvasPlayerDisable();
			ui.animationBlocked = true;
			break;
		}

		//cleanup code, moved here so doesnt get called on first entry to location

		await canvas.fadeOut({ref:ui});
		//clear NPCs when switching location
		clearNPC();
	}
}
