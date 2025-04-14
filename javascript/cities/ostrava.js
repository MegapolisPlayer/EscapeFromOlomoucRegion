let OstravaImages = [];

function OstravaNastupiste() {
	Player.set(70, 60, 2);

	return ui.makeArrow(new ArrowInfo(50, 90, ui.arrowType.DOWN, async () => { ui.info.location_minor_next = 1; }));
}

function OstravaNadrazi() {
	Player.set(70, 72, 0.25);

	return ui.makeArrows([
		new ArrowInfo(45, 75, ui.arrowType.UP, () => { ui.info.location_minor_next = 2; }),
		new ArrowInfo(10, 80, ui.arrowType.LEFT, () => { ui.info.location_minor_next = 0; }),
	]);
}

function OstravaNastupiste2() {
	Player.set(90, 80, 0.5);

	return ui.makeArrows([
		new ArrowInfo(75, 60, ui.arrowType.DOWN, () => { ui.info.location_minor_next = 1; }),
		new ArrowInfo(50, 70, ui.arrowType.INFO, () => {
			ui.clearArrows();
			ui.info.location_minor_next = -1;
			ui.info.location_major++;
		})
	]);
}