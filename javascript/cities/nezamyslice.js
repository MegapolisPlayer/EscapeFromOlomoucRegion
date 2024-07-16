let NezamysliceImages = [];

function NezamysliceNastupiste() {
	canvasPlayer(90, 70, 0.7); 

	return Promise.any([
		renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, async () => { ui.info.location_minor_next = 1; })),
		makeNPC(NPC.TRAIN, 80, 70, 0.7, (e) => {
			clearArrows();
			e.target.remove();
			ui.info.location_minor_next = -1;
			ui.info.location_major++;
		})
	]);
}

function NezamysliceNadrazi() {
	canvasPlayer(70, 60, 2.5);
	makeNPC(NPC.STATION, 30, 60, 2.5, (e) => {
			
	});

	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { ui.info.location_minor_next = 0; })
	]);
}

function NezamyslicePodnikVenek() {
	canvasPlayer(70, 90, 1); 

	return renderArrows([
		new ArrowInfo(70, 70, arrowType.LEFT, () => { ui.info.location_minor_next = 3; }),
		new ArrowInfo(90, 90, arrowType.DOWN, () => { ui.info.location_minor_next = 1; })
	]);
}

function NezamyslicePodnikVnitrek() {
	canvasPlayer(80, 55, 3);
	makeNPC(NPC.TRANSLATOR, 30, 55, 3, (e) => {
		
	});

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, async () => { ui.info.location_minor_next = 2; }));
}

async function NezamysliceHandler() {
	console.log("NEZAMYSLICE");

	ui.info.location_major = 2;
	ui.info.location_minor = 0;
	ui.info.location_minor_next = 0;
	
	canvas.loadingScreen();
	await loadMusic([4]);
	NezamysliceImages = await loadImages([
		"assets/photo/nezamyslice/nastupiste.jpg",
		"assets/photo/nezamyslice/nadrazi.jpg",
		"assets/photo/nezamyslice/podnik_venek.jpg",
		"assets/photo/nezamyslice/podnik_vnitrek.jpg"
	]);

	//map
	if(!ui.info.speedrun) {
		musicPlay(1);
		await renderMap(3);
		await canvas.fadeOut({ref:ui});
	}
	
	musicPlay(4); //start playing AFTER loading
	ui.animationBlocked = false;

	ui.enablePauseButton();
	canvas.background(NezamysliceImages[ui.info.location_minor]);
	canvasPlayer(90, 70, 0.7); 

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

		console.log("NZM "+ui.info.location_minor);
		canvas.background(NezamysliceImages[ui.info.location_minor]);

		switch(ui.info.location_minor) {
			case(0): promise = NezamysliceNastupiste(); break;
			case(1): promise = NezamysliceNadrazi(); break;
			case(2): promise = NezamyslicePodnikVenek(); break;
			case(3): promise = NezamyslicePodnikVnitrek(); break;
		}

		await ui.renderWidgets();

		await promise;

		if(ui.info.location_major != 2) {
			ui.disablePauseButton();
			canvasPlayerDisable(); 
			ui.animationBlocked = true;
			break;
		}

		await canvas.fadeOut({ref:ui});
		clearNPC();
	}
}
