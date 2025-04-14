let PrerovImages = [];

function PrerovNastupiste() {
	Player.set(70, 60, 2.5);

	return Promise.any([
		ui.makeArrow(new ArrowInfo(90, 80, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 1; })),
		new Promise((resolve) => {
			NPCManager.make(NPCManager.types.TRAIN, 30, 60, 2.5, async (e) => {
				ui.hideAllInput();
				if(await cutsceneTravel(LEAVE_COST_PREROV)) ui.goToNextMajor(e.target);
				ui.showAllInput();
				resolve();
			})
		}),
	]);
}

function PrerovNadrazi() {
	Player.set(75, 80, 1.7);

	return ui.makeArrows([
		new ArrowInfo(90, 50, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(50, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 0; })
	]);
}

function PrerovNamesti() {
	Player.set(55, 60, 0.5);

	return ui.makeArrows([
		new ArrowInfo(10, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(10, 50, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 4; }),
		new ArrowInfo(85, 85, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 3; })
	]);
}

function PrerovBecva() {
	Player.set(38, 75, 0.5);

	ui.makeArrow(new ArrowInfo(70, 75, ui.arrowType.DOWN, async () => {
		await minigameFish();
		musicPlay(3);
	}));

	return ui.makeArrow(new ArrowInfo(10, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 2; }));
}

function PrerovAutobus() {
	Player.set(15, 80, 1.7);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 2; }));
}