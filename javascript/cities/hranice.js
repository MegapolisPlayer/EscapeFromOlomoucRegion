let HNMimages = [];
let HNMnextLocation = 0;

async function HNMDomov() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	canvasCharacter(60, 15, 2.5);
	renderMoney();

	//let nextLocationPromise1 = waiterEventFromElement(
		//todo: add arrows
	//);

	return new Promise(() => {});
}
function HNMDomovClear() {

}

async function HNMNamesti() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	renderMoney();
	return new Promise(() => {});
}
function HNMNamestiClear() {

}

async function HNMRestaurace() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	renderMoney();
	return new Promise(() => {});
}
function HNMRestauraceClear() {

}

async function HNMNadrazi() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	renderMoney();
	return new Promise(() => {});
}
function HNMNadraziClear() {

}

async function HNMNastupiste() {
	console.log("HNM "+info.location_minor);
	canvasBackground(HNMimages[info.location_minor]);
	renderMoney();
	return new Promise(() => {});
}
function HNMNastupisteClear() {

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

	info.location_major = 1;
	
	canvasLoading();
	await loadMusic([2]);
	HNMimages = await loadImages([
		"assets/photo/hnm/domov.png",
		"assets/photo/hnm/namesti.jpg",
		"assets/photo/hnm/nadrazi.jpg",
		"assets/photo/hnm/restaurace.jpg",
		"assets/photo/hnm/nastupiste.jpg"
	]);
	
	musicPlay(2); //start playing AFTER loading

	let HNMpromisesArray = [];
	while(HNMnextLocation != -1) {
		info.location_minor = HNMnextLocation;

		switch(info.location_minor) {
			case(-1): break; //to next city
			case(0): HNMpromisesArray.push(HNMDomov()); break;
			case(1): HNMpromisesArray.push(HNMNamesti()); break;
			case(2): HNMpromisesArray.push(HNMNadrazi()); break;
			case(3): HNMpromisesArray.push(HNMRestaurace()); break;
			case(4): HNMpromisesArray.push(HNMNastupiste()); break;
		}

		//we wait until any promise met, then loop again
		await Promise.any(HNMpromisesArray);
	}

	return;
}