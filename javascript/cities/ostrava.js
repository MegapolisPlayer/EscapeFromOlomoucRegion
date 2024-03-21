let OstravaImages = [];

function OstravaNastupiste() {
	canvasPlayer(70, 60, 2); 

	return renderArrow(new ArrowInfo(50, 90, arrowType.DOWN, async () => { info.location_minor_next = 1; }));
}

function OstravaNadrazi() {
	canvasPlayer(70, 72, 0.25); 

	return renderArrows([
		new ArrowInfo(45, 75, arrowType.UP, () => { info.location_minor_next = 2; }),
		new ArrowInfo(10, 80, arrowType.LEFT, () => { info.location_minor_next = 0; }),
	]);
}

function OstravaNastupiste2() {
	canvasPlayer(90, 80, 0.5); 

	return renderArrows([
		new ArrowInfo(75, 60, arrowType.DOWN, () => { info.location_minor_next = 1; }),
		new ArrowInfo(50, 70, arrowType.INFO, () => { 
			clearArrows();
			info.location_minor_next = -1;
			info.location_major++;
		})
	]);
}

async function OstravaHandler() {
	console.log("OSTRAVA");

	info.location_major = 6;
	info.location_minor = 0;
	info.location_minor_next = 0;

	canvasLoading();
	await loadMusic([8]);
	OstravaImages = await loadImages([
		"assets/photo/ostrava/nastupiste.jpg",
		"assets/photo/ostrava/nadrazi.jpg",
		"assets/photo/ostrava/nastupiste2.jpg",
	]);

	//map
	if(!info.speedrun) {
		musicPlay(1);
		await renderMap(7);
		await canvasFadeOut();
	}
	
	musicPlay(8); //start playing AFTER loading
	animationBlocked = false;

	showPause();
	canvasBackground(OstravaImages[info.location_minor]);
	canvasPlayer(70, 60, 2); 

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

		console.log("OSTRAVA "+info.location_minor);
		canvasBackground(OstravaImages[info.location_minor]);

		switch(info.location_minor) {
			case(0): promise = OstravaNastupiste(); break;
			case(1): promise = OstravaNadrazi(); break;
			case(2): promise = OstravaNastupiste2(); break;
		}

		renderMoney();
		renderSpeedrunMode();
		renderPause();

		await promise;

		if(info.location_major != 6) { 
			hidePause();
			canvasPlayerDisable(); 
			animationBlocked = true;
			break;
		}

		await canvasFadeOut();
		canvasNPCClear();
	}
}