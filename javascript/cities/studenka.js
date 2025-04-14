let StudenkaImages = [];

function StudenkaPrejezd() {
	Player.set(20, 70, 1);

	return ui.makeArrow(new ArrowInfo(10, 90, ui.arrowType.LEFT, async () => { ui.info.location_minor_next = 3; }));
}

function StudenkaNastupiste() {
	Player.set(75, 78, 1);

	return Promise.any([
		ui.makeArrow(new ArrowInfo(20, 70, ui.arrowType.LEFT, async () => { ui.info.location_minor_next = 3; })),
		NPCManager.make(NPCManager.types.TRAIN, 60, 78, 1, (e) => {
			ui.clearArrows();
			e.target.remove();
			ui.info.location_minor_next = -1;
			ui.info.location_major++;
		}),
	]);
}

function StudenkaNadrazi() {
	Player.set(45, 65, 2);

	return ui.makeArrows([
		new ArrowInfo(90, 90, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(10, 90, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 3; })
	]);
}

function StudenkaPredNadrazi() {
	Player.set(75, 70, 2);

	return ui.makeArrows([
		new ArrowInfo(90, 50, ui.arrowType.RIGHT, () => { ui.info.location_minor_next = 0; }),
		new ArrowInfo(60, 50, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(10, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 4; }),
		new ArrowInfo(10, 70, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 6; })
	]);
}

function StudenkaNamesti() {
	Player.set(75, 70, 2);

	return ui.makeArrows([
		new ArrowInfo(45, 90, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 3; }),
		new ArrowInfo(10, 90, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 5; }),
	]);
}

function StudenkaPole() {
	Player.set(75, 70, 1);

	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, async () => { ui.info.location_minor_next = 4; }));
}

function StudenkaMost() {
	Player.set(75, 70, 2);
	if(!ui.info.speedrun) {
		ui.makeArrow(new ArrowInfo(40, 70, ui.arrowType.INFO, async () => {
			ui.hideAllInput();
			await ui.dialogueLine(0);

			ui.showAllInput();
		}));
	}
 
	return ui.makeArrow(new ArrowInfo(90, 90, ui.arrowType.RIGHT, async () => { ui.info.location_minor_next = 3; ui.clearArrows(); }));
}