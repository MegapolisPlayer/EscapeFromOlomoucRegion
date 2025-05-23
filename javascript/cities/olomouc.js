let OlomoucImages = [];

function OlomoucNastupiste() {
	Player.set(50, 47, 0.5);

	return Promise.any([
		ui.makeArrow(new ArrowInfo(10, 90, ui.arrowType.LEFT, async () => { ui.info.location_minor_next = 1; })),
		new Promise((resolve) => {
			NPCManager.make(NPCManager.types.TRAIN, 55, 47, 0.5, async (e) => {
				ui.hideAllInput();
				if(await cutsceneTravel(LEAVE_COST_OLOMOUC)) ui.goToNextMajor(e.target);
				ui.showAllInput();
				resolve();
			})
		}),
	]);
}

function OlomoucNadrazi() {
	Player.set(40, 80, 1);

	return ui.makeArrows([
		new ArrowInfo(45, 40, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 0; }),
		new ArrowInfo(20, 85, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 2; })
	]);
}

function OlomoucNamesti() {
	Player.set(40, 90, 0.7);

	return ui.makeArrows([
		new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(10, 90, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 3; }),
		new ArrowInfo(50, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 4; }),
		new ArrowInfo(70, 80, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 5; }),
	]);
}

function OlomoucSyrarna() {
	Player.set(60, 80, 1);

	return ui.makeArrow(new ArrowInfo(80, 90, ui.arrowType.RIGHT, async () => { ui.info.location_minor_next = 2; }));
}

function OlomoucRestaurant() {
	Player.set(50, 65, 2);

	NPCManager.make(NPCManager.types.COOK, 65, 55, 1, async() => {
		ui.hideAllInput();
		await minigameWaiter();
		canvas.background(OlomoucImages[ui.info.location_minor]);
		ui.showAllInput();
	});

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 2; }));
}

function OlomoucObchodVenek() {
	Player.set(50, 85, 0.8);

	return ui.makeArrows([
		new ArrowInfo(50, 70, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 6; }),
		new ArrowInfo(10, 90, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 2; })
	]);
}

function OlomoucObchodVnitrek() {
	Player.set(100, 50, 2.5);

	return ui.makeArrow(new ArrowInfo(10, 80, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 5; }));
}