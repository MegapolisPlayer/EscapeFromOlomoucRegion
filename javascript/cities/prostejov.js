let ProstejovImages = [];

function ProstejovNastupiste() {
	Player.set(50, 70, 2);

	return Promise.any([
		ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 1; })),
		new Promise((resolve) => {
			NPCManager.make(NPCManager.types.TRAIN, 80, 55, 1.5, async (e) => {
				ui.hideAllInput();
				if(await cutsceneTravel(LEAVE_COST_PROSTEJOV)) ui.goToNextMajor(e.target);
				ui.showAllInput();
				resolve();
			})
		}),
	]);
}

function ProstejovNadrazi() {
	Player.set(30, 65, 0.8);

	return ui.makeArrows([
		new ArrowInfo(50, 50, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 0; }),
		new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 2; })
	]);
}

function ProstejovNamesti() {
	Player.set(40, 80, 1.2);
	NPCManager.make(NPCManager.types.UTILITY, 60, 60, 0.7, async() => {
		ui.hideAllInput();
		await minigameBench();
		canvas.background(ProstejovImages[ui.info.location_minor]);
		ui.showAllInput();
	});

	return ui.makeArrows([
		new ArrowInfo(10, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(80, 70, ui.arrowType.UP, () => { ui.info.location_minor_next = 4; }),
		new ArrowInfo(10, 70, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 3; })
	]);
}

function ProstejovObchod() {
	Player.set(65, 50, 3);
	//TODO: cashier NPC

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 2; }));
}

function ProstejovCafe() {
	Player.set(65, 55, 4);
	NPCManager.make(NPCManager.types.COOK, 35, 55, 4, async() => {
		ui.hideAllInput();
		await minigameWaiter();
		canvas.background(HNMimages[ui.info.location_minor]);
		ui.showAllInput();
	});

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, async () => { ui.info.location_minor_next = 2; }));
}