//audio crediting system
let musicNames = [
	//0, Main menu
	"Stormfront",
	//1, Intro, game over
	"Faceoff",
	//2, HNM
	"Impending Boom",
	//3, Prerov
	"Nerves",
	//4, Nezamyslice
	"Late Night Radio",
	//5, Prostejov
	"String Impromptu 1",
	//6, Olomouc
	"Royal Coupling",
	//7, Studenka
	"Failing Defense",
	//8, Ostrava
	"The Parting",
	//9, Credits
	"Starting Out Waltz Vivace",
	//10, Waiter mg
	"Almost Bliss",
	//11, Fishing mg
	"Porch Swing Days",
	//12, Ticket check mg
	"Rollin at 5",
	//13, Direction help (Prerov BUS, Nezamyslice TRAIN) mg
	"Call to Adventure",
	//14, Dialect mg
	"Devonshire Waltz Allegretto",
	//15, Cashier mg
	"Nonstop",
	//16, Cleaning mg
	"Cipher",
	//17, Cheesemaking in olomouc mg
	"Neon Laser Horizon",
	//18, Defense mg
	"Five Armies",
	//19, wagon cutscenes
	"Pride"
];

let musicURI = [];

async function loadMusic(toload) {
	if(musicArray.length === 0) {
		for(let i = 0; i < musicNames.length; i++) {
			musicURI.push("assets/music/"+(musicNames[i].replaceAll(' ', ''))+".mp3");
			musicArray.push(new Audio());
		}
	}

	const promise = new Promise((resolve) => {
		for(let i = 0; i < toload.length; i++) {
			musicArray[toload[i]] = new Audio(musicURI[toload[i]]);

		}

		resolve();
	});

	await promise;
	audioVolume(settings.volume);
	return;
}
async function loadSFX() {
	const promise = new Promise((resolve) => {
		sfxArray.push(new Audio("assets/sfx/Click.mp3"));
		sfxArray.push(new Audio("assets/sfx/DialogueYes.mp3"));
		sfxArray.push(new Audio("assets/sfx/DialogueNo.mp3"));
		sfxArray.push(new Audio("assets/sfx/Success.mp3"));
		sfxArray.push(new Audio("assets/sfx/Fail.mp3"));
		sfxArray.push(new Audio("assets/sfx/Ticket.mp3"));
		sfxArray.push(new Audio("assets/sfx/Beep.mp3"));
		sfxArray.push(new Audio("assets/sfx/Shoot.mp3"));
		sfxArray.push(new Audio("assets/sfx/GameOver.mp3"));
		sfxArray.push(new Audio("assets/sfx/TrainBrake.mp3"));
		sfxArray.push(new Audio("assets/sfx/News.mp3"));
		sfxArray.push(new Audio("assets/sfx/Type.mp3"));
		sfxArray.push(new Audio("assets/sfx/Bell.mp3"));

		for(let i = 0; i < sfxArray.length; i++) {
			sfxArray[i].volume = 0.3;
		}

		resolve();
	});

	await promise; return;
}

//audio file names:
//[LANGNO]-[DIALOGNO].wav

let voicedLines = [
	0 // TODO: add actual lines!
];

async function loadVoice() {
	for(let i = 0; i < voice.length; i++) {
		for(let j = 0; j < translations[i].length; j++) {
			voice[i].push(new Audio());
		}
	}

	let promise = new Promise((resolve) => {
		let allowedLoadCounter = 0;
		for(let i = 0; i < voice.length; i++) {
			for(let j = 0; j < voice[i].length; j++) {
				let filename = "assets/voice/"+String(i+1)+"-"+String(j)+".wav";
				if(j === voicedLines[allowedLoadCounter]) {
					voice[i][j] = new Audio(filename);
					console.log("Voice file "+filename+" loaded to position ", i, j);
					allowedLoadCounter++;
				}		
			}
		}
		resolve();
	});

	await promise; return;
}

function audioToggle(elem) {
	musicToggle();
	if(elem != undefined) { elem.innerHTML = getTranslation(settings.music_enabled ? 9 : 8); }
	settings.voice_enabled = settings.music_enabled;
}

function musicToggle(elem) {
	if(settings.music_enabled) {
		musicArray[musicCurrent].pause();
		settings.music_enabled = false;
		if(elem != undefined) { elem.innerHTML = getTranslation(27); }
	}
	else {
		settings.music_enabled = true;
		if(elem != undefined) { elem.innerHTML = getTranslation(26); }
	}
}
function voiceToggle(elem) {
	if(settings.voice_enabled) {
		settings.voice_enabled = false;
		elem.innerHTML = getTranslation(27);
	}
	else {
		settings.voice_enabled = true;
		elem.innerHTML = getTranslation(26);
	}
}

function audioVolume(newvolume) {
	console.log("Audio volume changed to ", newvolume);
	for(let i = 0; i < musicArray.length; i++) {
		musicArray[i].volume = newvolume*0.3;
	}
	for(let i = 0; i < sfxArray.length; i++) {
		sfxArray[i].volume = newvolume*0.1;
	}
	for(let i = 0; i < voice.length; i++) {
		for(let j = 0; j < voice[i].length; j++) {
			voice[i][j].volume = newvolume;
		}
	}
}

let musicCurrent = 0;

function musicPlay(id) {
	if(id >= musicArray.length || id == undefined) {
		errorHandle("Music ID undefined or out of range.");
	}
	musicStop(musicCurrent);
	musicCurrent = id;
	if(!settings.music_enabled) { 
		musicArray[id].pause();	return;
	}
	musicArray[id].currentTime = 0;
	musicArray[id].play();
}
function musicStop() {
	if(!settings.music_enabled) { return; }
	musicArray[musicCurrent].pause();
}
function musicRestart() {
	if(!settings.music_enabled) { return; }
	musicArray[musicCurrent].currentTime = 0;
}

function sfxPlay(id) {
	if(id >= sfxArray.length || id == undefined) {
		errorHandle("SFX ID undefined or out of range.");
	}
	if(!settings.music_enabled) { return; };
	sfxArray[id].currentTime = 0;
	sfxArray[id].play();
}
function sfxPlayQuiet(id) {
	if(id >= sfxArray.length || id == undefined) {
		errorHandle("SFX ID undefined or out of range.");
	}
	if(!settings.music_enabled) { return; };

	let tempVolume = sfxArray[id].volume;
	sfxArray[id].volume = sfxArray[id].volume*0.5;
	sfxArray[id].currentTime = 0;
	sfxArray[id].play();
	sfxArray[id].addEventListener("ended", () => {
		sfxArray[id].volume = tempVolume;
    });
}
function sfxPlayLoud(id) {
	if(id >= sfxArray.length || id == undefined) {
		errorHandle("SFX ID undefined or out of range.");
	}
	if(!settings.music_enabled) { return; };

	let tempVolume = sfxArray[id].volume;
	sfxArray[id].volume = sfxArray[id].volume*1.5;
	sfxArray[id].currentTime = 0;
	sfxArray[id].play();
	sfxArray[id].addEventListener("ended", () => {
		sfxArray[id].volume = tempVolume;
    });
}
function sfxStop(id) {
	if(id >= musicArray.length || id == undefined) {
		errorHandle("Music ID undefined or out of range.");
	}
	if(!settings.music_enabled) { return; }
	sfxArray[id].pause();
}

function voicePlay(id) {
	if(id == undefined) {
		errorHandle("Voiceover ID undefined.");
	}
	if(!settings.voice_enabled) { return; }
	getVoiceTranslation(id).play();
}

function getTranslationAndVoice(id) {
	voicePlay(id); return getTranslation(id);
}