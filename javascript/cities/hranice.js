let HNMimages = [];

function HNMDomov() {
	Player.set(70, 60, 2.5);

	return ui.makeArrow(new ArrowInfo(90, 80, ui.arrowType.RIGHT, async () => { ui.info.location_minor_next = 1; }));
}

function HNMNamesti() {
	Player.set(50, 60, 1);
	
	return ui.makeArrows([
		new ArrowInfo(10, 90, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 0; }),
		new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(45, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 5; })
	]);
}

function HNMNadrazi() {
	Player.set(35, 60, 1.7);

	return ui.makeArrows([
		new ArrowInfo(10, 90, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(95, 75, ui.arrowType.UP, () => { ui.info.location_minor_next = 3; }),
		new ArrowInfo(85, 85, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 4; })
	]);
}

function HNMRestaurace() {
	Player.set(70, 90, 3);
	NPCManager.make(NPCManager.types.COOK, 90, 50, 2, async () => {
		ui.hideAllInput();

		await ui.dialogueLine(62);
		await ui.dialogueLine(63);
		if(await ui.dialogueChoice()) {
			await ui.dialogueLine(64);
			await minigameWaiter();
			musicPlay(2);
		}
		else {
			await ui.dialogueLine(65);
		}
		canvas.background(HNMimages[ui.info.location_minor]);
		Player.set(70, 90, 3);
		NPCManager.drawByAnimation(NPCManager.types.COOK, 90, 50, 2);
		await ui.renderWidgets();

		ui.showAllInput();
	});
	
	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 2; }));
}

function HNMNastupiste() {
	Player.set(65, 70, 1.3);

	return Promise.any([
	ui.makeArrow(new ArrowInfo(50, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 2; })),
	NPCManager.make(NPCManager.types.TRAIN, 40, 70, 1.3, (e) => {
		//TODO add dialogue
		ui.clearArrows();
		e.target.remove();
		ui.info.location_minor_next = -1;
		ui.info.location_major++;
	})]);
}

let HNMPropastEndingTimer;
let HNMVisitedPropast = false;

function HNMPropast() {
	Player.set(10, 90, 2.5);
	HNMVisitedPropast = true;
	HNMPropastEndingTimer = Date.now();

	return ui.makeArrow(new ArrowInfo(40, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 1; }));
}

async function HNMHandler() {
	// HANDLER <-> DOMOV
	//             NAMESTI
	//             NADRAZI
	//             NASTUPISTE
	//             RESTAURACE
	
	// handler is a loop, return NextLocation as variable
	// wait until any function returns, then run again
	// when returning: set next location value, return promise
	
	console.log("HNM");

	ui.info.location_major = 0;
	ui.info.location_minor = 0;
	ui.info.location_minor_next = 0;
	
	canvas.loadingScreen();
	await loadMusic([2, 10]);
	HNMimages = await loadImages([
		"assets/photo/hnm/domov.png",
		"assets/photo/hnm/namesti.jpg",
		"assets/photo/hnm/nadrazi.jpg",
		"assets/photo/hnm/restaurace.jpg",
		"assets/photo/hnm/nastupiste.jpg",
		"assets/photo/hnm/propast.jpg"
	]);
	
	//map
	if(!ui.info.speedrun) {
		musicPlay(1);
		await renderMap(1);
		await canvas.fadeOut({ref:ui});

		//init pause shortcut; just in HNM
		window.addEventListener("keydown", (e) => {
			if(e.code === "Escape") {
				ui.pauseMenuToggle();
			}
		});
	}

	musicPlay(2); //start playing AFTER loading
	ui.animationBlocked = false;

	ui.enablePauseButton();
	canvas.background(HNMimages[ui.info.location_minor]);
	Player.set(70, 60, 2.5);
	
	//entry dialogue
	if(!ui.info.speedrun) {
		await ui.dialogueLine(49);
	}
	ui.UIanimationBlocked = false;

	let promise;
	while(ui.info.location_minor_next != -1) {
		ui.info.location_minor = ui.info.location_minor_next;

		console.log("HNM "+ui.info.location_minor);
		canvas.background(HNMimages[ui.info.location_minor]);

		switch(ui.info.location_minor) {
			case(0): promise = HNMDomov(); break;
			case(1): promise = HNMNamesti(); break;
			case(2): promise = HNMNadrazi(); break;
			case(3): promise = HNMRestaurace(); break;
			case(4): promise = HNMNastupiste(); break;
			case(5): promise = HNMPropast(); break;
			default: break;
		}
		await ui.renderWidgets();

		//we wait until any promise met, then loop again
		await promise;
		ui.clearArrows();

		if(ui.info.location_major != 0) {
			ui.disablePauseButton();
			Player.hide();
			ui.animationBlocked = true;
			break;
		}

		//cleanup code, moved here so doesnt get called on first entry to location

		await canvas.fadeOut({ref:ui});
		//clear NPCs when switching location
		NPCManager.clear();
	}
}
