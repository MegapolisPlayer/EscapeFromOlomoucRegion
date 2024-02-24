let musicURI = [
	//main menu
	"assets/music/Stormfront.mp3",
	//intro
	"assets/music/Faceoff.mp3",
	//HNM
	"assets/music/ImpendingBoom.mp3",
	//Prerov
	"assets/music/Nerves.mp3",
	//Nezamyslice
	"assets/music/LateNightRadio.mp3",
	//Prostejov
	"assets/music/StringImpromptu1.mp3",
	//Olomouc
	"assets/music/RoyalCoupling.mp3",
	//Studenka
	"assets/music/FailingDefense.mp3",
	//Ostrava
	"assets/music/TheParting.mp3",
	//Credits
	"assets/music/StartingOutWaltzVivace.mp3",
	//Waiter mg
	"assets/music/AlmostBliss.mp3",
	//Fishing mg
	"assets/music/PorchSwingDays.mp3",
	//ticket check mg
	"assets/music/Rollinat5.mp3",
	//Direction help (Prerov BUS, Nezamyslice TRAIN) mg
	"assets/music/CalltoAdventure.mp3",
	//Dialect mg
	"assets/music/DevonshireWaltzAllegretto.mp3",
	//Cashier mg
	"assets/music/Nonstop.mp3",
	//Cleaning mg
	"assets/music/Cipher.mp3",
	//Cheesemaking in olomouc mg
	"assets/music/NeonLaserHorizon.mp3",
	//Defense mg
	"assets/music/FiveArmies.mp3",
	//wagon cutscenes
	"assets/music/Pride.mp3"
];

async function loadMusic(toload) {
	if(musicArray.length === 0) {
		for(let i = 0; i < musicURI.length; i++) {
			musicArray.push(new Audio());
		}
	}

	const promise = new Promise((resolve) => {
		for(let i = 0; i < toload.length; i++) {
			musicArray[toload[i]] = new Audio(musicURI[toload[i]]);
			musicArray[toload[i]].loop = true;
		}

		resolve();
	});

	await promise; return;
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

		resolve();
	});

	await promise; return;
}

//audio file names:
//[LANGNO]-[DIALOGNO].wav

let voicedLines = [
	100, 101, 102 // TEMP
];

async function loadVoice() {
	for(let i = 0; i < voice.length; i++) {
		for(let j = 0; j < translations[i].length; j++) {
			voice[i].push(new Audio());
		}
	}

	const promise = new Promise((resolve) => {
		let allowedLoadCounter = 0;
		for(let i = 0; i < voice.length; i++) {
			for(let j = 0; j < voice[i].length; j++) {
				let filename = "assets/voice/"+String(i+1)+"-"+String(j)+".wav";
				if(j === voicedLines[allowedLoadCounter]) {
					voice[i][j] = new Audio(filename);
					console.log("Voice file "+filename+" loaded.");
					allowedLoadCounter++;
				}		
			}
		}
		resolve();
	});

	await promise; return;
}

function audioToggle(elem) {
	if(audioIsOn) {
		musicArray[musicCurrent].pause();
		audioIsOn = false;
		elem.innerHTML = getTranslation(7);
	}
	else {
		audioIsOn = true;
		elem.innerHTML = getTranslation(8);
	}
}

function audioVolume(newvolume) {
	for(let i = 0; i < musicArray.length; i++) {
		musicArray[i].volume = newvolume;
	}
	for(let i = 0; i < sfxArray.length; i++) {
		sfxArray[i].volume = newvolume*0.75;
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
	musicCurrent = id;
	if(!audioIsOn) { 
		musicArray[id].pause();	return;
	}
	musicArray[id].play();
}
function musicStop(id) {
	if(id >= musicArray.length || id == undefined) {
		errorHandle("Music ID undefined or out of range.");
	}
	if(!audioIsOn) { return; }
	musicArray[id].pause();
}
function musicRestart(id) {
	if(id >= musicArray.length || id == undefined) {
		errorHandle("Music ID undefined or out of range.");
	}
	if(!audioIsOn) { return; }
	musicArray[id].currentTime = 0;
}

function sfxPlay(id) {
	if(id >= sfxArray.length || id == undefined) {
		errorHandle("SFX ID undefined or out of range.");
	}
	if(!audioIsOn) { return; };
	sfxArray[id].currentTime = 0;
	sfxArray[id].play();
}

function voicePlay(id) {
	if(id == undefined) {
		errorHandle("Voiceover ID undefined.");
	}
	if(!audioIsOn) { return; }
	getVoiceTranslation(id).play();
}