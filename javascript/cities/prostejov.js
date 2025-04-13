let ProstejovImages = [];

function ProstejovNastupiste() {
	Player.set(50, 70, 2);

	return Promise.any([
		ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 1; })),
		new Promise((resolve) => {
			NPCManager.make(NPCManager.types.TRAIN, 80, 55, 1.5, async (e) => {
				ui.hideAllInput();
				if(await cutsceneTravel(LEAVE_COST_PROSTEJOV)) ui.goToNextMajor(e.target);
				ui.showAllInput();
				resolve();
			})
		}),
	]);
}

function ProstejovNadrazi() {
	Player.set(30, 65, 0.8);

	return ui.makeArrows([
		new ArrowInfo(50, 50, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 0; }),
		new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 2; })
	]);
}

function ProstejovNamesti() {
	Player.set(40, 80, 1.2);
	NPCManager.make(NPCManager.types.UTILITY, 60, 60, 0.7, async() => {
		ui.hideAllInput();
		await minigameBench();
		canvas.background(ProstejovImages[ui.info.location_minor]);
		ui.showAllInput();
	});

	return ui.makeArrows([
		new ArrowInfo(10, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(80, 70, ui.arrowType.UP, () => { ui.info.location_minor_next = 4; }),
		new ArrowInfo(10, 70, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 3; })
	]);
}

function ProstejovObchod() {
	Player.set(65, 50, 3);
	//TODO: cashier NPC

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 2; }));
}

function ProstejovCafe() {
	Player.set(65, 55, 4);
	NPCManager.make(NPCManager.types.COOK, 35, 55, 4, async() => {
		ui.hideAllInput();
		await minigameWaiter();
		canvas.background(HNMimages[ui.info.location_minor]);
		ui.showAllInput();
	});

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, async () => { ui.info.location_minor_next = 2; }));
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
	Player.set(50, 70, 2);

	//entry dialogue
	if(!ui.info.speedrun) {
		await ui.dialogueLine(0);
	}

	let promise;
	while(ui.info.location_minor_next != -1) {
		ui.info.location_minor = ui.info.location_minor_next;

		//clear NPCs when switching location
		NPCManager.clear();

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
		ui.clearArrows();

		if(ui.info.location_major != 3) {
			ui.disablePauseButton();
			Player.hide();
			ui.animationBlocked = true;
			break;
		}

		if(ui.info.location_minor_next != ui.info.location_minor) await canvas.fadeOut({ref:ui});
		NPCManager.clear();
		ui.info.last_location_minor = ui.info.location_minor;
	}
}
