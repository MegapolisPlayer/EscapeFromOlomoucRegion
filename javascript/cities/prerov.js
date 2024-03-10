let Prerovimages = [];

async function PrerovHandler() {
	console.log("PREROV");

	info.location_major = 1;
	info.location_minor = 0;
	info.location_minor_next = 0;
	
	canvasLoading();
	await loadMusic([2]);
	Prerovimages = await loadImages([
		"assets/photo/hnm/domov.png",
		"assets/photo/hnm/namesti.jpg",
		"assets/photo/hnm/nadrazi.jpg",
		"assets/photo/hnm/restaurace.jpg",
		"assets/photo/hnm/nastupiste.jpg"
	]);
	
	musicPlay(2); //start playing AFTER loading

	//entry dialogue
	canvasBackground(Prerovimages[info.location_minor]);
	canvasPlayer(70, 60, 2.5);

	await renderDialogue(0);

	let promise;
	while(info.location_minor_next != -1) {
		info.location_minor = info.location_minor_next;

		//clear NPCs when switching location
		canvasNPCClear();

		switch(info.location_minor) {
			case(-1): break; //to next city
			case(0): promise = HNMDomov(); break;
			case(1): promise = HNMNamesti(); break;
			case(2): promise = HNMNadrazi(); break;
			case(3): promise = HNMRestaurace(); break;
			case(4): promise = HNMNastupiste(); break;
		}

		//we wait until any promise met, then loop again
		await promise;
	}

	return;
}