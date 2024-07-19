let OstravaImages = [];

function OstravaNastupiste() {
	canvasPlayer(70, 60, 2); 

	return ui.makeArrow(new ArrowInfo(50, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 1; }));
}

function OstravaNadrazi() {
	canvasPlayer(70, 72, 0.25); 

	return ui.makeArrows([
		new ArrowInfo(45, 75, ui.arrowType.UP, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(10, 80, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 0; }),
	]);
}

function OstravaNastupiste2() {
	canvasPlayer(90, 80, 0.5); 

	return ui.makeArrows([
		new ArrowInfo(75, 60, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(50, 70, ui.arrowType.INFO, () => {
			ui.clearArrows();
			ui.info.location_minor_next = -1;
			ui.info.location_major++;
		})
	]);
}

async function OstravaHandler() {
	console.log("OSTRAVA");

	ui.info.location_major = 6;
	ui.info.location_minor = 0;
	ui.info.location_minor_next = 0;

	canvas.loadingScreen();
	await loadMusic([8]);
	OstravaImages = await loadImages([
		"assets/photo/ostrava/nastupiste.jpg",
		"assets/photo/ostrava/nadrazi.jpg",
		"assets/photo/ostrava/nastupiste2.jpg",
	]);

	//map
	if(!ui.info.speedrun) {
		musicPlay(1);
		await renderMap(7);
		await canvas.fadeOut({ref:ui});
	}
	
	musicPlay(8); //start playing AFTER loading
	ui.animationBlocked = false;

	ui.enablePauseButton();
	canvas.background(OstravaImages[ui.info.location_minor]);
	canvasPlayer(70, 60, 2); 

	//entry dialogue
	if(!ui.info.speedrun) {
		await ui.dialogueLine(0);

	}

	let promise;
	while(ui.info.location_minor_next != -1) {
		ui.info.location_minor = ui.info.location_minor_next;

		//clear NPCs when switching location
		clearNPC();

		console.log("OSTRAVA "+ui.info.location_minor);
		canvas.background(OstravaImages[ui.info.location_minor]);

		switch(ui.info.location_minor) {
			case(0): promise = OstravaNastupiste(); break;
			case(1): promise = OstravaNadrazi(); break;
			case(2): promise = OstravaNastupiste2(); break;
		}
		await ui.renderWidgets();

		await promise;
		ui.clearArrows();

		if(ui.info.location_major != 6) {
			ui.disablePauseButton();
			canvasPlayerDisable(); 
			ui.animationBlocked = true;
			break;
		}

		await canvas.fadeOut({ref:ui});
		clearNPC();
	}
}
