let ProstejovImages = [];

function ProstejovNastupiste() {
	canvasPlayer(50, 70, 2); 

	return Promise.any([
		renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, async () => { info.location_minor_next = 1; })),
		canvasNPC(NPC.TRAIN, 80, 55, 1.5, (e) => {
			clearArrows();
			e.target.remove();
			info.location_minor_next = -1;
			info.location_major++;
		})
	]);
}

function ProstejovNadrazi() {
	canvasPlayer(30, 65, 0.8);

	return renderArrows([
		new ArrowInfo(50, 50, arrowType.LEFT, () => { info.location_minor_next = 0; }),
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { info.location_minor_next = 2; })
	]);
}

function ProstejovNamesti() {
	canvasPlayer(40, 80, 1.2);
	canvasNPC(NPC.UTILITY, 60, 60, 0.7, async() => { 
		hideAllInput();
		await minigameBench();
		canvasBackground(canvas, ctx, ProstejovImages[info.location_minor]);
		showAllInput();
	});

	return renderArrows([
		new ArrowInfo(10, 90, arrowType.DOWN, () => { info.location_minor_next = 1; }),
		new ArrowInfo(80, 70, arrowType.UP, () => { info.location_minor_next = 4; }),
		new ArrowInfo(10, 70, arrowType.LEFT, () => { info.location_minor_next = 3; })
	]);
}

function ProstejovObchod() {
	canvasPlayer(65, 50, 3);
	//TODO: cashier NPC

	return renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, async () => { info.location_minor_next = 2; }));
}

function ProstejovCafe() {
	canvasPlayer(65, 55, 4);
	canvasNPC(NPC.COOK, 35, 55, 4, async() => { 
		hideAllInput();
		await minigameWaiter();
		canvasBackground(canvas, ctx, HNMimages[info.location_minor]);
		showAllInput();
	});

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, async () => { info.location_minor_next = 2; }));
}

async function ProstejovHandler() {
	console.log("PROSTEJOV");

	info.location_major = 3;
	info.location_minor = 0;
	info.location_minor_next = 0;
	
	canvasLoading(canvas, ctx, );
	await loadMusic([5]);
	ProstejovImages = await loadImages([
		"assets/photo/prostejov/nastupiste.jpg",
		"assets/photo/prostejov/nadrazi.jpg",
		"assets/photo/prostejov/namesti.jpg",
		"assets/photo/prostejov/cafe.jpg",
		"assets/photo/prostejov/obchod.jpg"
	]);

	//map
	if(!info.speedrun) {
		musicPlay(1);
		await renderMap(4);
		await canvasFadeOut(canvas, ctx, );
	}
	
	musicPlay(5); //start playing AFTER loading
	animationBlocked = false;

	showPause();
	canvasBackground(canvas, ctx, ProstejovImages[info.location_minor]);
	canvasPlayer(50, 70, 2); 

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
		canvasNPCClear();

		console.log("PROSTEJOV "+info.location_minor);
		canvasBackground(canvas, ctx, ProstejovImages[info.location_minor]);

		switch(info.location_minor) {
			case(0): promise = ProstejovNastupiste(); break;
			case(1): promise = ProstejovNadrazi(); break;
			case(2): promise = ProstejovNamesti(); break;
			case(3): promise = ProstejovCafe(); break;
			case(4): promise = ProstejovObchod(); break;
		}

		await renderMoney();
		renderSpeedrunMode();
		renderPause();

		await promise;

		if(info.location_major != 3) { 
			hidePause();
			canvasPlayerDisable(); 
			animationBlocked = true;
			break;
		}

		await canvasFadeOut(canvas, ctx, );
		canvasNPCClear();
	}
}