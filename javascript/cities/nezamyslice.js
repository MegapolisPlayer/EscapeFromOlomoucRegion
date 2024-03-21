let NezamysliceImages = [];

function NezamysliceNastupiste() {
	canvasPlayer(90, 70, 0.7); 

	return Promise.any([
		renderArrow(new ArrowInfo(90, 90, arrowType.DOWN, async () => { info.location_minor_next = 1; })),
		canvasNPC(NPC.TRAIN, 80, 70, 0.7, (e) => {
			clearArrows();
			e.target.remove();
			info.location_minor_next = -1;
			info.location_major++;
		})
	]);
}

function NezamysliceNadrazi() {
	canvasPlayer(70, 60, 2.5);
	canvasNPC(NPC.STATION, 30, 60, 2.5, (e) => {
			
	});

	return renderArrows([
		new ArrowInfo(10, 90, arrowType.LEFT, () => { info.location_minor_next = 2; }),
		new ArrowInfo(90, 90, arrowType.RIGHT, () => { info.location_minor_next = 0; })
	]);
}

function NezamyslicePodnikVenek() {
	canvasPlayer(70, 90, 1); 

	return renderArrows([
		new ArrowInfo(70, 70, arrowType.LEFT, () => { info.location_minor_next = 3; }),
		new ArrowInfo(90, 90, arrowType.DOWN, () => { info.location_minor_next = 1; })
	]);
}

function NezamyslicePodnikVnitrek() {
	canvasPlayer(80, 55, 3);
	canvasNPC(NPC.TRANSLATOR, 30, 55, 3, (e) => {
		
	});

	return renderArrow(new ArrowInfo(90, 90, arrowType.RIGHT, async () => { info.location_minor_next = 2; }));
}

async function NezamysliceHandler() {
	console.log("NEZAMYSLICE");

	info.location_major = 2;
	info.location_minor = 0;
	info.location_minor_next = 0;
	
	canvasLoading();
	await loadMusic([4]);
	NezamysliceImages = await loadImages([
		"assets/photo/nezamyslice/nastupiste.jpg",
		"assets/photo/nezamyslice/nadrazi.jpg",
		"assets/photo/nezamyslice/podnik_venek.jpg",
		"assets/photo/nezamyslice/podnik_vnitrek.jpg"
	]);

	//map
	if(!info.speedrun) {
		musicPlay(1);
		await renderMap(3);
		await canvasFadeOut();
	}
	
	musicPlay(4); //start playing AFTER loading
	animationBlocked = false;

	showPause();
	canvasBackground(NezamysliceImages[info.location_minor]);
	canvasPlayer(90, 70, 0.7); 

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

		console.log("NZM "+info.location_minor);
		canvasBackground(NezamysliceImages[info.location_minor]);

		switch(info.location_minor) {
			case(0): promise = NezamysliceNastupiste(); break;
			case(1): promise = NezamysliceNadrazi(); break;
			case(2): promise = NezamyslicePodnikVenek(); break;
			case(3): promise = NezamyslicePodnikVnitrek(); break;
		}

		renderMoney();
		renderSpeedrunMode();
		renderPause();

		await promise;

		if(info.location_major != 2) { 
			hidePause();
			canvasPlayerDisable(); 
			animationBlocked = true;
			break;
		}

		await canvasFadeOut();
		canvasNPCClear();
	}
}