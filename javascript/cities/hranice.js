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
		canvas.background(this[ui.info.location_minor]);
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
		new Promise((resolve) => {
			NPCManager.make(NPCManager.types.TRAIN, 40, 70, 1.3, async (e) => {
				ui.hideAllInput();
				if(await cutsceneTravel(LEAVE_COST_HRANICE)) ui.goToNextMajor(e.target);
				ui.showAllInput();
				resolve();
			})
		}),
		ui.makeArrow(new ArrowInfo(50, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 2; }))
	]);
}

let HNMPropastEndingTimer;
let HNMVisitedPropast = false;

function HNMPropast() {
	Player.set(10, 90, 2.5);
	HNMVisitedPropast = true;
	HNMPropastEndingTimer = Date.now();

	return ui.makeArrow(new ArrowInfo(40, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 1; }));
}