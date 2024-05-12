let StudenkaImages = [];

function StudenkaPrejezd() {
	canvasPlayer(20, 70, 1); 

	return renderArrow(new ArrowInfo(10, 90, arrowType.LEFT, async () => { info.location_minor_next = 3; }));
}

function StudenkaNastupiste() {
	canvasPlayer(75, 78, 1); 

	return Promise.any([
		renderArrow(new ArrowInfo(20, 70, arrowType.LEFT, async () => { info.location_minor_next = 3; })),
		canvasNPC(NPC.TRAIN, 60, 78, 1, (e) => {
			clearArrows();
			e.target.remove();
			info.location_minor_next = -1;
			info.location_major++;
		}),
	]);
}

function StudenkaNadrazi() {
	canvasPlayer(45, 65, 2); 

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { info.location_minor_next = 1; }),
		new ArrowInfo(10, 90, arrowType.LEFT, () => { info.location_minor_next = 3; })
	]);
}

function StudenkaPredNadrazi() {
	canvasPlayer(75, 70, 2); 

	return renderArrows([
		new ArrowInfo(90, 50, arrowType.RIGHT, () => { info.location_minor_next = 0; }),
		new ArrowInfo(60, 50, arrowType.LEFT, () => { info.location_minor_next = 2; }),
		new ArrowInfo(10, 90, arrowType.DOWN, () => { info.location_minor_next = 4; }),
		new ArrowInfo(10, 70, arrowType.LEFT, () => { info.location_minor_next = 6; })
	]);
}

function StudenkaNamesti() {
	canvasPlayer(75, 70, 2); 

	return renderArrows([
		new ArrowInfo(45, 90, arrowType.DOWN, () => { info.location_minor_next = 3; }),
		new ArrowInfo(10, 90, arrowType.LEFT, () => { info.location_minor_next = 5; }),
	]);
}

function StudenkaPole() {
	canvasPlayer(75, 70, 1); 

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, async () => { info.location_minor_next = 4; }));
}

function StudenkaMost() {
	canvasPlayer(75, 70, 2); 
	if(!info.speedrun) {
		renderArrow(new ArrowInfo(40, 70, arrowType.INFO, async (e) => { 
			hideAllInput();
			dialogueBegin();
			await dialogueNext(0);
			dialogueEnd();
			showAllInput();
		}));
	}
 
	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, async () => { info.location_minor_next = 3; clearArrows(); }));
}

async function StudenkaHandler() {
	console.log("STUDENKA");

	info.location_major = 5;
	info.location_minor = 0;
	info.location_minor_next = 0;

	canvasLoading();
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
	if(!info.speedrun) {
		musicPlay(1);
		await renderMap(6);
		await canvasFadeOut();
	}
	
	musicPlay(7); //start playing AFTER loading
	animationBlocked = false;

	showPause();
	canvasBackground(StudenkaImages[info.location_minor]);
	canvasPlayer(20, 70, 1); 

	let promise;
	while(info.location_minor_next != -1) {
		info.location_minor = info.location_minor_next;

		//clear NPCs when switching location
		canvasNPCClear();

		console.log("STUDENKA "+info.location_minor);
		canvasBackground(StudenkaImages[info.location_minor]);

		switch(info.location_minor) {
			case(0): promise = StudenkaPrejezd(); break;
			case(1): promise = StudenkaNastupiste(); break;
			case(2): promise = StudenkaNadrazi(); break;
			case(3): promise = StudenkaPredNadrazi(); break;
			case(4): promise = StudenkaNamesti(); break;
			case(5): promise = StudenkaPole(); break;
			case(6): promise = StudenkaMost(); break;
		}

		await renderMoney();
		renderSpeedrunMode();
		renderPause();

		await promise;

		if(info.location_major != 5) { 
			canvasPlayerDisable(); 
			animationBlocked = true;
			break;
		}

		await canvasFadeOut();
		canvasNPCClear();
	}
}