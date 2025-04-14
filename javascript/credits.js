let creditsDelay = 3500; //in milliseconds
let creditsCounter = 0;
let creditsImg;

function setCreditsStep(titleid, text = "", fn = undefined) {
	setTimeout(() => {
		console.log("setCreditsStep callback: Next credits step!");
		canvas.setColor("#ffffff");
		canvas.background(creditsImg);
		canvas.setFontWeight("bold");
		canvas.textS(getTranslation(titleid), 5, 35);
		canvas.setFontWeight("normal");
		canvas.textM(text, 10, 35);
		if(fn != undefined) { fn.call() };
	}, creditsDelay * creditsCounter);
	creditsCounter++;
}

async function renderCredits() {
	creditsImg = await loadImage("assets/photo/katowice/credits.jpg");
	loadMusic([9]);
	musicPlay(9);
	
	canvas.setSmallFontSize();
	ui.addSmallButton("creditsskip", getTranslation(7), 80, 0, 20, 10, () => { window.location.reload(); });

	setCreditsStep(1);
	setCreditsStep(29, `
		Martin/MegapolisPlayer (code and graphics)
		Jirka/KohoutGD (idea, translations and voiceover)
	`);
	setCreditsStep(30, `
		SReality, Freepik (jcomp), VlakemJednoduse.cz, Fortes Interactive, VagonWeb,
		Pixabay (PickupImage, pexels, igormattio)
		From Wikimedia Commons (in no particular order):
		Marie Čchiedzeová, Vojtěch Dočkal, Jiří Komárek, JirkaSv, Dezidor, Vitezslava,
		Kamil Czianskim, Michal Klajban, STERUSSTUDENKA, Draceane, Herbert Frank,
		Palickap, RPekar, Radim Holiš, Vojtěch Dočkal
	`);
	setCreditsStep(30, `
		Map images: Copyright (c) OpenStreetMap contributors
		https://www.openstreetmap.org/copyright
		Available under the ODL (Open Database License).
	`);

	let musicNamesString = "\n";
	for(let i = 0; i < musicNames.length; i++) {
		musicNamesString += ("\"" + musicNames[i] + "\"");
		if(i !== musicNames.length - 1) {
			musicNamesString += ", "
		}
		if((i % 4 == 0 && i > 0) || i === musicNames.length - 1) {
			musicNamesString += "\n";
		}
	}

	setCreditsStep(31, 
		musicNamesString+
		`Kevin MacLeod (incompetech.com)
		Licensed under Creative Commons: By Attribution 3.0
		http://creativecommons.org/licenses/by/3.0/
	`);
	setCreditsStep(32, `
		Sound effects from Pixabay, UNIVERSFIELD
		All sound effects hosted on Pixabay.
	`);
	setCreditsStep(33, `
		Male characters -
		Female characters -
		Cook, Translator, Utility man -
		Train conductor, Army -
	`);
	setCreditsStep(34, `
		Čeština: Martin/MegapolisPlayer and Jirka/KohoutGD
		English: Martin/MegapolisPlayer
		Deutsch: Jirka/KohoutGD
		Susština and Baština: Jirka/KohoutGD
	`);
	setCreditsStep(35, `
		Nářečí ČJ: https://cs.wikiversity.org/wiki
		English Dialect: https://en.wiktionary.org
		Deutscher Dialekt:  
		Susština and Baština: custom
	`);
	setCreditsStep(81, `
		<insert testers and stuff here!>
	`);
	setCreditsStep(36, "\n"+getTranslation(37), () => {
		ui.removeButton("creditsskip");
		window.addEventListener("click", () => {
			window.location.reload();	
		});
	});
}
