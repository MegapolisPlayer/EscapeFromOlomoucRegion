async function HNMDomov() {
	
}
function HNMDomovClear() {

}

async function HNMNamesti() {

}
function HNMNamestiClear() {

}

async function HNMRestaurace() {

}
function HNMRestauraceClear() {

}

async function HNMNadrazi() {

}
function HNMNadraziClear() {

}

async function HNMNastupiste() {

}
function HNMNastupisteClear() {

}

let HNMnextLocation = 0;
let HNMpromisesArray = []; //global for better debugging

async function HNMHandler() {
	// HANDLER <-> DOMOV
	//             NAMESTI
	//             NADRAZI
	//             NASTUPISTE
	//             RESTAURACE

	// handler is a loop, return NextLocation as variable
	// wait until any function returns, then run again
	// when returning: set next location value, return promise

	while(HNMnextLocation != -1) {
		switch(HNMnextLocation) {
			case(-1): resolve(); break; //to next city
			case(0): HNMpromisesArray.push(HNMDomov()); break;
			case(1): HNMpromisesArray.push(HNMNamesti()); break;
			case(2): HNMpromisesArray.push(HNMNadrazi()); break;
			case(3): HNMpromisesArray.push(HNMRestaurace()); break;
			case(4): HNMpromisesArray.push(HNMNastupiste()); break;
		}

		//we wait until any promise met, then loop again
		Promise.any(HNMpromisesArray);
	}

	await promise; return;
}