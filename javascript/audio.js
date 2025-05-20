let musicArray = [];
let sfxArray = [];

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
	//13, Map help mg
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
	audioVolume(ui.settings.volume);
	return;
}
async function loadSFX() {
	const promise = new Promise((resolve) => {
		/* 0 */ sfxArray.push(new Audio("assets/sfx/Click.mp3"));
		/* 1 */ sfxArray.push(new Audio("assets/sfx/DialogueYes.mp3"));
		/* 2 */ sfxArray.push(new Audio("assets/sfx/DialogueNo.mp3"));
		/* 3 */ sfxArray.push(new Audio("assets/sfx/Success.mp3"));
		/* 4 */ sfxArray.push(new Audio("assets/sfx/Fail.mp3"));
		/* 5 */ sfxArray.push(new Audio("assets/sfx/Ticket.mp3"));
		/* 6 */ sfxArray.push(new Audio("assets/sfx/Beep.mp3"));
		/* 7 */ sfxArray.push(new Audio("assets/sfx/Shoot.mp3"));
		/* 8 */ sfxArray.push(new Audio("assets/sfx/GameOver.mp3"));
		/* 9 */ sfxArray.push(new Audio("assets/sfx/TrainBrake.mp3"));
		/* 10 */ sfxArray.push(new Audio("assets/sfx/News.mp3"));
		/* 11 */ sfxArray.push(new Audio("assets/sfx/Type.mp3"));
		/* 12 */ sfxArray.push(new Audio("assets/sfx/Bell.mp3"));
		/* 13 */ sfxArray.push(new Audio("assets/sfx/Train.wav"));

		for(let i = 0; i < sfxArray.length; i++) {
			sfxArray[i].volume = 0.3;
		}

		resolve();
	});

	await promise; return;
}

function audioToggle(elem) {
	musicToggle();
	if(elem != undefined) { elem.innerHTML = getTranslation(ui.settings.music_enabled ? 9 : 8); }
	ui.settings.voice_enabled = ui.settings.music_enabled;
}

function musicToggle(elem) {
	if(ui.settings.music_enabled) {
		musicArray[musicCurrent].pause();
		ui.settings.music_enabled = false;
		if(elem != undefined) { elem.innerHTML = getTranslation(27); }
	}
	else {
		ui.settings.music_enabled = true;
		if(elem != undefined) { elem.innerHTML = getTranslation(26); }
	}
}
function voiceToggle(elem) {
	if(ui.settings.voice_enabled) {
		ui.settings.voice_enabled = false;
		elem.innerHTML = getTranslation(27);
	}
	else {
		ui.settings.voice_enabled = true;
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
		console.error("Music ID undefined or out of range.");
	}
	musicPause(musicCurrent);
	musicCurrent = id;
	if(!ui.settings.music_enabled) {
		musicArray[id].pause();	return;
	}
	musicArray[id].currentTime = 0;
	musicArray[id].play();
}
function musicPause() {
	if(!ui.settings.music_enabled) { return; }
	musicArray[musicCurrent].pause();
}
function musicUnpause() {
	if(!ui.settings.music_enabled) { return; }
	musicArray[musicCurrent].play();
}
function musicRestart() {
	if(!ui.settings.music_enabled) { return; }
	musicArray[musicCurrent].currentTime = 0;
}

function sfxPlay(id) {
	if(id >= sfxArray.length || id == undefined) {
		console.error("SFX ID undefined or out of range.");
	}
	if(!ui.settings.music_enabled) { return; };
	sfxArray[id].currentTime = 0;
	sfxArray[id].play();
}
function sfxPlayQuiet(id) {
	if(id >= sfxArray.length || id == undefined) {
		console.error("SFX ID undefined or out of range.");
	}
	if(!ui.settings.music_enabled) { return; };

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
		console.error("SFX ID undefined or out of range.");
	}
	if(!ui.settings.music_enabled) { return; };

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
		console.error("Music ID undefined or out of range.");
	}
	if(!ui.settings.music_enabled) { return; }
	sfxArray[id].pause();
}

function voicePlay(id) {
	if(id == undefined) {
		console.error("Voiceover ID undefined.");
	}
	if(!ui.settings.voice_enabled) { return; }
	getVoiceTranslation(id).play();
}

function getTranslationAndVoice(id) {
	voicePlay(id); return getTranslation(id);
}

function playVoice(id) {
	if(!ui.settings.voice_enabled) { return Promise.resolve(); }
	getVoiceTranslation(id).play();
	return Promise.any([Promise.resolve(), new Promise((resolve) => {
		//clear event listeners by cloning
		getVoiceTranslation(id).addEventListener("ended", (e) => { resolve(); e.target = e.target.cloneNode(true); });
	})]);
}

function voiceStop() {
	for(let i = 0; i < voice.length; i++) {
		for(let j = 0; j < voice[i].length; j++) {
			voice[i][j].pause();
			voice[i][j].currentTime = 0;
		}
	}
}
