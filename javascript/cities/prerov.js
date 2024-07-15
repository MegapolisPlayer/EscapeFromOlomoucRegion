let PrerovImages = [];

function PrerovNastupiste() {
	canvasPlayer(70, 60, 2.5);

	return Promise.any([
		renderArrow(new ArrowInfo(90, 80, arrowType.DOWN, async () => { info.location_minor_next = 1; })),
		makeNPC(NPC.TRAIN, 30, 60, 2.5, (e) => {
			clearArrows();
			e.target.remove();
			info.location_minor_next = -1;
			info.location_major++;
		})]
	);
}

function PrerovNadrazi() {
	canvasPlayer(75, 80, 1.7);

	return renderArrows([
		new ArrowInfo(90, 50, arrowType.RIGHT, () => { info.location_minor_next = 2; }),
		new ArrowInfo(50, 90, arrowType.DOWN, () => { info.location_minor_next = 0; })
	]);
}

function PrerovNamesti() {
	canvasPlayer(55, 60, 0.5);

	return renderArrows([
		new ArrowInfo(10, 90, arrowType.DOWN, () => { info.location_minor_next = 1; }),
		new ArrowInfo(10, 50, arrowType.LEFT, () => { info.location_minor_next = 4; }),
		new ArrowInfo(85, 85, arrowType.RIGHT, () => { info.location_minor_next = 3; })
	]);
}

function PrerovBecva() {
	canvasPlayer(38, 75, 0.5);

	return renderArrow(new ArrowInfo(10, 90, arrowType.DOWN, async () => { info.location_minor_next = 2; }));
}

function PrerovAutobus() {
	canvasPlayer(15, 80, 1.7);

	return renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, async () => { info.location_minor_next = 2; }));
}

async function PrerovHandler() {
	console.log("PREROV");

	info.location_major = 1;
	info.location_minor = 0;
	info.location_minor_next = 0;
	
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
	if(!info.speedrun) {
		musicPlay(1);
		await renderMap(2);
		await canvas.fadeOut();
	}
	
	musicPlay(3); //start playing AFTER loading
	canvas.animationBlocked = false;

	showPause();
	canvas.background(PrerovImages[info.location_minor]);
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

		//clear NPCs when switching location
		clearNPC();

		console.log("PREROV "+info.location_minor);
		canvas.background(PrerovImages[info.location_minor]);

		switch(info.location_minor) {
			case(0): promise = PrerovNastupiste(); break;
			case(1): promise = PrerovNadrazi(); break;
			case(2): promise = PrerovNamesti(); break;
			case(3): promise = PrerovBecva(); break;
			case(4): promise = PrerovAutobus(); break;
		}

		await renderMoney();
		renderSpeedrunMode();
		renderPause();

		await promise;

		if(info.location_major != 1) { 
			hidePause();
			canvasPlayerDisable(); 
			canvas.animationBlocked = true;
			break;
		}

		await canvas.fadeOut();
		clearNPC();
	}
}
