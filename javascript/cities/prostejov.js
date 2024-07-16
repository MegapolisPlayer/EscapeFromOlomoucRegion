let ProstejovImages = [];

function ProstejovNastupiste() {
	canvasPlayer(50, 70, 2); 

	return Promise.any([
		renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, async () => { ui.info.location_minor_next = 1; })),
		makeNPC(NPC.TRAIN, 80, 55, 1.5, (e) => {
			clearArrows();
			e.target.remove();
			ui.info.location_minor_next = -1;
			ui.info.location_major++;
		})
	]);
}

function ProstejovNadrazi() {
	canvasPlayer(30, 65, 0.8);

	return renderArrows([
		new ArrowInfo(50, 50, arrowType.LEFT, () => { ui.info.location_minor_next = 0; }),
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { ui.info.location_minor_next = 2; })
	]);
}

function ProstejovNamesti() {
	canvasPlayer(40, 80, 1.2);
	makeNPC(NPC.UTILITY, 60, 60, 0.7, async() => {
		hideAllInput();
		await minigameBench();
		canvas.background(ProstejovImages[ui.info.location_minor]);
		showAllInput();
	});

	return renderArrows([
		new ArrowInfo(10, 90, arrowType.DOWN, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(80, 70, arrowType.UP, () => { ui.info.location_minor_next = 4; }),
		new ArrowInfo(10, 70, arrowType.LEFT, () => { ui.info.location_minor_next = 3; })
	]);
}

function ProstejovObchod() {
	canvasPlayer(65, 50, 3);
	//TODO: cashier NPC

	return renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, async () => { ui.info.location_minor_next = 2; }));
}

function ProstejovCafe() {
	canvasPlayer(65, 55, 4);
	makeNPC(NPC.COOK, 35, 55, 4, async() => {
		hideAllInput();
		await minigameWaiter();
		canvas.background(HNMimages[ui.info.location_minor]);
		showAllInput();
	});

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, async () => { ui.info.location_minor_next = 2; }));
}

async function ProstejovHandler() {
	console.log("PROSTEJOV");

	ui.info.location_major = 3;
	ui.info.location_minor = 0;
	ui.info.location_minor_next = 0;
	
	canvas.loadingScreen();
	await loadMusic([5]);
	ProstejovImages = await loadImages([
		"assets/photo/prostejov/nastupiste.jpg",
		"assets/photo/prostejov/nadrazi.jpg",
		"assets/photo/prostejov/namesti.jpg",
		"assets/photo/prostejov/cafe.jpg",
		"assets/photo/prostejov/obchod.jpg"
	]);

	//map
	if(!ui.info.speedrun) {
		musicPlay(1);
		await renderMap(4);
		await canvas.fadeOut({ref:ui});
	}
	
	musicPlay(5); //start playing AFTER loading
	ui.animationBlocked = false;

	ui.enablePauseButton();
	canvas.background(ProstejovImages[ui.info.location_minor]);
	canvasPlayer(50, 70, 2); 

	//entry dialogue
	if(!ui.info.speedrun) {
		dialogueBegin();
		await dialogueNext(0);
		dialogueEnd();
	}

	let promise;
	while(ui.info.location_minor_next != -1) {
		ui.info.location_minor = ui.info.location_minor_next;

		//clear NPCs when switching location
		clearNPC();

		console.log("PROSTEJOV "+ui.info.location_minor);
		canvas.background(ProstejovImages[ui.info.location_minor]);

		switch(ui.info.location_minor) {
			case(0): promise = ProstejovNastupiste(); break;
			case(1): promise = ProstejovNadrazi(); break;
			case(2): promise = ProstejovNamesti(); break;
			case(3): promise = ProstejovCafe(); break;
			case(4): promise = ProstejovObchod(); break;
		}

		await ui.renderWidgets();

		await promise;

		if(ui.info.location_major != 3) {
			ui.disablePauseButton();
			canvasPlayerDisable(); 
			ui.animationBlocked = true;
			break;
		}

		await canvas.fadeOut({ref:ui});
		clearNPC();
	}
}
