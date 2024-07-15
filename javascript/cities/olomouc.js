let OlomoucImages = [];

function OlomoucNastupiste() {
	canvasPlayer(50, 47, 0.5); 

	return Promise.any([
		renderArrow(new ArrowInfo(10, 90, arrowType.LEFT, async () => { info.location_minor_next = 1; })),
		makeNPC(NPC.TRAIN, 55, 47, 0.5, (e) => {
			clearArrows();
			e.target.remove();
			info.location_minor_next = -1;
			info.location_major++;
		})
	]);
}

function OlomoucNadrazi() {
	canvasPlayer(40, 80, 1); 

	return renderArrows([
		new ArrowInfo(45, 40, arrowType.DOWN, () => { info.location_minor_next = 0; }),
		new ArrowInfo(20, 85, arrowType.DOWN, () => { info.location_minor_next = 2; })
	]);
}

function OlomoucNamesti() {
	canvasPlayer(40, 90, 0.7);

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { info.location_minor_next = 1; }),
		new ArrowInfo(10, 90, arrowType.LEFT, () => { info.location_minor_next = 3; }),
		new ArrowInfo(50, 90, arrowType.DOWN, () => { info.location_minor_next = 4; }),
		new ArrowInfo(70, 80, arrowType.RIGHT, () => { info.location_minor_next = 5; }),
	]);
}

function OlomoucSyrarna() {
	canvasPlayer(60, 80, 1);

	return renderArrow(new ArrowInfo(80, 90, arrowType.RIGHT, async () => { info.location_minor_next = 2; }));
}

function OlomoucRestaurant() {
	canvasPlayer(50, 65, 2);

	makeNPC(NPC.COOK, 65, 55, 1, async() => {
		hideAllInput();
		await minigameWaiter();
		canvas.background(OlomoucImages[info.location_minor]);
		showAllInput();
	});

	return renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, async () => { info.location_minor_next = 2; }));
}

function OlomoucObchodVenek() {
	canvasPlayer(50, 85, 0.8);

	return renderArrows([
		new ArrowInfo(50, 70, arrowType.LEFT, () => { info.location_minor_next = 6; }),
		new ArrowInfo(10, 90, arrowType.LEFT, () => { info.location_minor_next = 2; })
	]);
}

function OlomoucObchodVnitrek() {
	canvasPlayer(100, 50, 2.5);

	return renderArrow(new ArrowInfo(10, 80, arrowType.DOWN, async () => { info.location_minor_next = 5; }));
}

async function OlomoucHandler() {
	console.log("OLOMOUC");

	info.location_major = 4;
	info.location_minor = 0;
	info.location_minor_next = 0;

	canvas.loadingScreen();
	await loadMusic([6]);
	OlomoucImages = await loadImages([
		"assets/photo/olomouc/nastupiste.jpg",
		"assets/photo/olomouc/nadrazi.jpg",
		"assets/photo/olomouc/namesti.jpg",
		"assets/photo/olomouc/syrarna.jpg",
		"assets/photo/olomouc/restaurant.jpg",
		"assets/photo/olomouc/obchod_venek.jpg",
		"assets/photo/olomouc/obchod_vnitrek.jpg"
	]);

	//map
	if(!info.speedrun) {
		musicPlay(1);
		await renderMap(5);
		await canvas.fadeOut();
	}
	
	musicPlay(6); //start playing AFTER loading
	canvas.animationBlocked = false;

	showPause();
	canvas.background(OlomoucImages[info.location_minor]);
	canvasPlayer(50, 47, 0.5); 

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

		console.log("OLOMOUC "+info.location_minor);
		canvas.background(OlomoucImages[info.location_minor]);

		switch(info.location_minor) {
			case(0): promise = OlomoucNastupiste(); break;
			case(1): promise = OlomoucNadrazi(); break;
			case(2): promise = OlomoucNamesti(); break;
			case(3): promise = OlomoucSyrarna(); break;
			case(4): promise = OlomoucRestaurant(); break;
			case(5): promise = OlomoucObchodVenek(); break;
			case(6): promise = OlomoucObchodVnitrek(); break;
		}

		await renderMoney();
		renderSpeedrunMode();
		renderPause();

		await promise;

		if(info.location_major != 4) { 
			hidePause();
			canvasPlayerDisable(); 
			canvas.animationBlocked = true;
			break;
		}

		await canvas.fadeOut();
		clearNPC();
	}
}
