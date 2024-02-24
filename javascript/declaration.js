//
// DECLARATIONS AND UTILITY FUNCTIONS
//

// DECLARATIONS

// CANVAS

let canvas;
let ctx;

let canvas_fontSize = 0;
let canvas_fontFamily = "";
let canvas_fontWeight = "";

let biggerWindowSize = (window.screen.width > window.screen.height) ? window.screen.width : window.screen.height;
let fontSizeMultiplier = 0.025;

// CHARACTERS

let characters = [];
let players = [];

let selectedPlayer = 0;

// AUDIO

let musicArray = [];
let sfxArray = [];

//same size as translations, uses same IDs

let voiceEN = []; 
let voiceCZ = []; 
let voiceDE = []; 
let voiceSUS = []; 
let voiceBA = []; 

let voice = [ voiceEN, voiceCZ, voiceDE, voiceSUS, voiceBA ];

let audioIsOn = false;

// TRANSLATIONS

let translationEN = [];
let translationCZ = [];
let translationDE = [];
let translationSUS = [];
let translationBA = [];

let translationSelected = 0;

let translations = [ translationEN, translationCZ, translationDE, translationSUS, translationBA ];

// SETTINGS AND INFORMATION

let settings = {
	//easy - 0, medium - 1, hard - 2
	difficulty: 1,
	//easy - 0.80, medium - 1, hard - 1.2
	diff_multiplier: 1,
	//easy - 10000, medium - 5000, hard - 1000
	random_loss_chance: 5000,
	//easy: -1000, medium: -500, hard: -100
	debt_limit: -500,
	//volume of music
	volume: 1,
	//music and sfx
	music_enabled: true,
	//voiceover enabled
	voice_enabled: true,
};

let info = {
	money: 0,
	location_major: 0,
	location_minor: 0
};

let moneyLimit = 2500; //no minigames allowed above 2500

// UTILITIES

function doesFileExist(file) {
	try {
		let xhr = new XMLHttpRequest();
		xhr.open("HEAD", file);
		xhr.send();
		return true;
	}
	catch {
		return false;
	}
}