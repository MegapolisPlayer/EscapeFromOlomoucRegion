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

// AUDIO

let musicArray = [];
let sfxArray = [];
let isAudioOn = false;

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
	difficulty: 0,
	diff_multiplier: 0,
	random_loss_chance: 0,
};

let info = {
	money: 0,
	location_major: 0,
	location_minor: 0
};
