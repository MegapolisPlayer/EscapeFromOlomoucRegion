async function renderSettings() {
	canvasBackground(mainMenuImage);
	canvasSetLargeFont();
	canvasSetColor("#000080");
	canvasSetBorder("#ffffff");
	canvasTextAndBorderS(getTranslation(5), 5, 10);

	let promise = waiterEventFromElement(
		addButton(
		"back", getTranslation(38), 70, 90, 30, 10,
		(e) => { removeButton("back"); }
	), "click");

	await promise;
}