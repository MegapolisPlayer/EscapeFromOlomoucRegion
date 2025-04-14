function NezamysliceNastupiste() {
	Player.set(90, 70, 0.7);

	return Promise.any([
		ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 1; })),
		new Promise((resolve) => {
			NPCManager.make(NPCManager.types.TRAIN, 80, 70, 0.7, async (e) => {
				ui.hideAllInput();
				if(await cutsceneTravel(LEAVE_COST_NEZAMYSLICE)) ui.goToNextMajor(e.target);
				ui.showAllInput();
				resolve();
			})
		}),
	]);
}

function NezamysliceNadrazi() {
	Player.set(70, 60, 2.5);
	NPCManager.make(NPCManager.types.STATION, 30, 60, 2.5, () => {
			
	});

	return ui.makeArrows([
		new ArrowInfo(10, 90, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 0; })
	]);
}

function NezamyslicePodnikVenek() {
	Player.set(70, 90, 1);

	return ui.makeArrows([
		new ArrowInfo(70, 70, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 3; }),
		new ArrowInfo(90, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 1; })
	]);
}

function NezamyslicePodnikVnitrek() {
	Player.set(80, 55, 3);
	NPCManager.make(NPCManager.types.TRANSLATOR, 30, 55, 3, () => {
		
	});

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, async () => { ui.info.location_minor_next = 2; }));
}