let PrerovImages = [];

function PrerovNastupiste() {
	canvasPlayer(70, 60, 2.5);

	return Promise.any([
		ui.makeArrow(new ArrowInfo(90, 80, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 1; })),
		makeNPC(NPC.TRAIN, 30, 60, 2.5, (e) => {
			ui.clearArrows();
			e.target.remove();
			ui.info.location_minor_next = -1;
			ui.info.location_major++;
		})]
	);
}

function PrerovNadrazi() {
	canvasPlayer(75, 80, 1.7);

	return ui.makeArrows([
		new ArrowInfo(90, 50, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(50, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 0; })
	]);
}

function PrerovNamesti() {
	canvasPlayer(55, 60, 0.5);

	return ui.makeArrows([
		new ArrowInfo(10, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(10, 50, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 4; }),
		new ArrowInfo(85, 85, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 3; })
	]);
}

function PrerovBecva() {
	canvasPlayer(38, 75, 0.5);

	return ui.makeArrow(new ArrowInfo(10, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 2; }));
}

function PrerovAutobus() {
	canvasPlayer(15, 80, 1.7);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 2; }));
}

async function PrerovHandler() {
	console.log("PREROV");

	ui.info.location_major = 1;
	ui.info.location_minor = 0;
	ui.info.location_minor_next = 0;
	
	canvas.loadingScreen();
	await loadMusic([3]);
	PrerovImages = await loadImages([
		"assets/photo/prerov/nastupiste.jpg",
		"assets/photo/prerov/nadrazi.jpg",
		"assets/photo/prerov/namesti.jpg",
		"assets/photo/prerov/becva.jpg",
		"assets/photo/prerov/autobus.jpg"
	]);

	//map
	if(!ui.info.speedrun) {
		musicPlay(1);
		await renderMap(2);
		await canvas.fadeOut({ref:ui});
	}
	
	musicPlay(3); //start playing AFTER loading
	ui.animationBlocked = false;

	ui.enablePauseButton();
	canvas.background(PrerovImages[ui.info.location_minor]);
	canvasPlayer(70, 60, 2.5);

	//entry dialogue
	if(!ui.info.speedrun) {
		await ui.dialogueLine(0);

	}

	let promise;
	while(ui.info.location_minor_next != -1) {
		ui.info.location_minor = ui.info.location_minor_next;

		//clear NPCs when switching location
		clearNPC();

		console.log("PREROV "+ui.info.location_minor);
		canvas.background(PrerovImages[ui.info.location_minor]);

		switch(ui.info.location_minor) {
			case(0): promise = PrerovNastupiste(); break;
			case(1): promise = PrerovNadrazi(); break;
			case(2): promise = PrerovNamesti(); break;
			case(3): promise = PrerovBecva(); break;
			case(4): promise = PrerovAutobus(); break;
		}
		await ui.renderWidgets();

		await promise;
		ui.clearArrows();

		if(ui.info.location_major != 1) {
			ui.disablePauseButton();
			canvasPlayerDisable(); 
			ui.animationBlocked = true;
			break;
		}

		await canvas.fadeOut({ref:ui});
		clearNPC();
	}
}
