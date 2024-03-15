function renderMapBase(day, city) {
	canvasBackground(mapBGImage);
	canvasImage(mapFGImage, 10, 10, (smallerWindowSize/mapFGImage.height)*0.8);

	canvasSetLargeFont();
	canvasSetColor("#ffffff");
	canvasTextM(getTranslation(50)+" "+String(day)+"\n"+getTranslation(city), 80, 10);
}

//hranice na morave
async function renderMapDay1() {
	renderMapBase(1, 52);

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
	]);
}
//prerov
async function renderMapDay2() {
	renderMapBase(2, 53);
	
	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
	]);
}
//nezamyslice
async function renderMapDay3() {
	renderMapBase(3, 54);

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
	]);
}
//prostejov
async function renderMapDay4() {
	renderMapBase(4, 55);

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
	]);
}
//olomouc
async function renderMapDay5() {
	renderMapBase(5, 56);

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
	]);
}
//studenka
async function renderMapDay52() {
	renderMapBase(5, 57);

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
	]);
}
//ostrava
async function renderMapDay6() {
	renderMapBase(6, 58);

	return renderArrows([
		new ArrowInfo(90, 90, arrowType.RIGHT, () => {}),
	]);
}
