let StudenkaImages = [];

function StudenkaPrejezd() {
	canvasPlayer(20, 70, 1); 

	return renderArrow(new ArrowInfo(10, 90, arrowType.LEFT, async () => { ui.info.location_minor_next = 3; }));
}

function StudenkaNastupiste() {
	canvasPlayer(75, 78, 1); 

	return Promise.any([
		renderArrow(new ArrowInfo(20, 70, arrowType.LEFT, async () => { ui.info.location_minor_next = 3; })),
		makeNPC(NPC.TRAIN, 60, 78, 1, (e) => {
			clearArrows();
			e.target.remove();
			ui.info.location_minor_next = -1;
			ui.info.location_major++;
		}),
	]);
}

function StudenkaNadrazi() {
	canvasPlayer(45, 65, 2); 

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(10, 90, arrowType.LEFT, () => { ui.info.location_minor_next = 3; })
	]);
}

function StudenkaPredNadrazi() {
	canvasPlayer(75, 70, 2); 

	return renderArrows([
		new ArrowInfo(90, 50, arrowType.RIGHT, () => { ui.info.location_minor_next = 0; }),
		new ArrowInfo(60, 50, arrowType.LEFT, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(10, 90, arrowType.DOWN, () => { ui.info.location_minor_next = 4; }),
		new ArrowInfo(10, 70, arrowType.LEFT, () => { ui.info.location_minor_next = 6; })
	]);
}

function StudenkaNamesti() {
	canvasPlayer(75, 70, 2); 

	return renderArrows([
		new ArrowInfo(45, 90, arrowType.DOWN, () => { ui.info.location_minor_next = 3; }),
		new ArrowInfo(10, 90, arrowType.LEFT, () => { ui.info.location_minor_next = 5; }),
	]);
}

function StudenkaPole() {
	canvasPlayer(75, 70, 1); 

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, async () => { ui.info.location_minor_next = 4; }));
}

function StudenkaMost() {
	canvasPlayer(75, 70, 2); 
	if(!ui.info.speedrun) {
		renderArrow(new ArrowInfo(40, 70, arrowType.INFO, async (e) => { 
			hideAllInput();
			dialogueBegin();
			await dialogueNext(0);
			dialogueEnd();
			showAllInput();
		}));
	}
 
	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, async () => { ui.info.location_minor_next = 3; clearArrows(); }));
}

async function StudenkaHandler() {
	console.log("STUDENKA");

	ui.info.location_major = 5;
	ui.info.location_minor = 0;
	ui.info.location_minor_next = 0;

	canvas.loadingScreen();
	await loadMusic([7]);
	StudenkaImages = await loadImages([
		"assets/photo/studenka/prejezd.jpg",
		"assets/photo/studenka/nastupiste.jpg",
		"assets/photo/studenka/nadrazi.jpg",
		"assets/photo/studenka/prednadrazi.jpg",
		"assets/photo/studenka/namesti.jpg",
		"assets/photo/studenka/pole.jpg",
		"assets/photo/studenka/most.jpg",
	]);

	//map
	if(!ui.info.speedrun) {
		musicPlay(1);
		await renderMap(6);
		await canvas.fadeOut({ref:ui});
	}
	
	musicPlay(7); //start playing AFTER loading
	ui.animationBlocked = false;

	ui.enablePauseButton();
	canvas.background(StudenkaImages[ui.info.location_minor]);
	canvasPlayer(20, 70, 1); 

	let promise;
	while(ui.info.location_minor_next != -1) {
		ui.info.location_minor = ui.info.location_minor_next;

		//clear NPCs when switching location
		clearNPC();

		console.log("STUDENKA "+ui.info.location_minor);
		canvas.background(StudenkaImages[ui.info.location_minor]);

		switch(ui.info.location_minor) {
			case(0): promise = StudenkaPrejezd(); break;
			case(1): promise = StudenkaNastupiste(); break;
			case(2): promise = StudenkaNadrazi(); break;
			case(3): promise = StudenkaPredNadrazi(); break;
			case(4): promise = StudenkaNamesti(); break;
			case(5): promise = StudenkaPole(); break;
			case(6): promise = StudenkaMost(); break;
		}

		await ui.renderWidgets();

		await promise;

		if(ui.info.location_major != 5) {
			canvasPlayerDisable(); 
			ui.animationBlocked = true;
			break;
		}

		await canvas.fadeOut({ref:ui});
		clearNPC();
	}
}
