let translationEN = [];
let translationCZ = [];
let translationDE = [];
let translationPL = [];
let translationBA = [];

let translationSelected = 0;

let translations = [ translationEN, translationCZ, translationDE, translationPL, translationBA ];
let translationNames = [ "English", "Čeština", "Deutsch", "Polski", "Baština" ];

async function loadTranslation() {
	const promise = new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "javascript/text/translation.csv", true);

		xhr.onload = () => {
			let text = xhr.response;
			console.log("Translation file:\n"+xhr.response);
			text = text.replaceAll('\r', ''); //remove opposition
			let lineText = text.split('\n'); //divide and conquer
			for(let i = 0; i < lineText.length; i++) {
				let splitText = lineText[i].split(';');
				if(splitText.length == 0) { continue; }
				for(let j = 0; j < splitText.length; j++) {
					translations[j].push(splitText[j]);
				}
			}

			resolve();
		};

		xhr.send(null);
	});

    await promise; return;
}

//audio file names:
//[LANGNO]-[DIALOGNO].wav
//Lang. No: 1 - English, 2 - Čeština, 3 - Deutsch", 4 - Polski, 5 - Baština

let voicedLines = [
	40, 41, 42, 43, 47, 48, 49, 50, 63, 64, 65, 66, 88, 89, 90
];

let voiceEN = [];
let voiceCZ = [];
let voiceDE = [];
let voiceBA = [];

let voice = [ voiceEN, voiceCZ, voiceDE, voiceBA ];

async function loadVoice() {
	for(let i = 0; i < voice.length; i++) {
		for(let j = 0; j < translations[i].length; j++) {
			voice[i].push(new Audio());
		}
	}

	let promise = new Promise((resolve) => {
		let allowedLoadCounter;
		for(let i = 0; i < voice.length; i++) {
			console.log("Loading translation "+i);
			allowedLoadCounter = 0;
			for(let j = 0; j < voice[i].length; j++) {
				let filename = "assets/voice/"+String(i+1)+"-"+String(j)+".wav";
				if(j === voicedLines[allowedLoadCounter]) {
					voice[i][j-1] = new Audio(filename);
					console.log("Voice file "+filename+" loaded to position ", i, j-1);
					allowedLoadCounter++;
				}
			}
		}
		resolve();
	});

	await promise; return;
}

function getTranslation(id) {
	return translations[translationSelected][id];
}

function getVoiceTranslation(id) {
	return voice[translationSelected][id];
}

function wrapText(str, maxwidth) {
	let splitstr = str.split(' '); //split to words
	let tempstr = "";
	let textWidth = 0;

	for(let i = 0; i < splitstr.length; i++) {
		textWidth += canvas.ctx.measureText(splitstr[i] + ' ').width;

		if(textWidth > canvas.getX(maxwidth)) {
			tempstr += ('\n' + splitstr[i] + ' '); //we still add text after newline
			textWidth = canvas.ctx.measureText(splitstr[i] + ' ').width;
		}
		else {
			tempstr += splitstr[i];
			tempstr += ' ';
		}
	}

	return tempstr;
}

//male
let randomNameNames = [];
let randomNameSurnames = [];
//female
let randomNameNamesF = [];
let randomNameSurnamesF = [];
let firstRandomNameGeneratorRun = true;

function getRandomName() {
	if(firstRandomNameGeneratorRun) {
		randomNameNames = getTranslation(193).split(',').filter(v => !v.empty());
		randomNameSurnames = getTranslation(194).split(',').filter(v => !v.empty());
		randomNameNamesF = getTranslation(195).split(',').filter(v => !v.empty());
		randomNameSurnamesF = getTranslation(196).split(',').filter(v => !v.empty());
		firstRandomNameGeneratorRun = false;
	}

	let gender = Math.trunc(Math.random()*2);
	if(gender === 0) {
		return randomNameNames[Math.trunc(Math.random()*randomNameNames.length)] + " " + randomNameSurnames[Math.trunc(Math.random()*randomNameSurnames.length)];
	}
	return randomNameNamesF[Math.trunc(Math.random()*randomNameNamesF.length)] + " " + randomNameSurnamesF[Math.trunc(Math.random()*randomNameSurnamesF.length)];
}