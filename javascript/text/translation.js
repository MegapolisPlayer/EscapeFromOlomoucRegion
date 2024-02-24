async function loadTranslation() {
	let temp;
	/*
	const promise = new Promise((resolve) => {
		let req = new XMLHttpRequest();
        req.open("GET", "javascript/text/translation.csv");
        req.onload = (event) => {
			//TODO: finish

			//split string into array

			//add array into array, with for loop
			translations[i].push();
		}
		req.send();
    });

    await promise;
	*/
	return temp;
}

function getTranslation(id) {
	return translations[translationSelected][id];
}