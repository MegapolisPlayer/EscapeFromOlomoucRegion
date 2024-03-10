//
// DECLARATIONS AND UTILITY FUNCTIONS
//

// DECLARATIONS

// CANVAS, calc in canvas init and resize functions

let canvas;
let ctx;
let canvas_fontSize = 0;
let canvas_fontFamily  = "";
let canvas_fontWeight = "";

let biggerWindowSize = 0;
let smallerWindowSize = 0;

let fontSizeLarge = 0;
let fontSizeSmall = 0;
let characterSizeMultiplier = 0;

let currentBGImage;

let mainMenuImage;

// ARROWS

let arrowType = {
	LEFT: 0,
	RIGHT: 1,
	UP: 2,
	DOWN: 3,
	INFO: 4
};
let arrowImages = [];
let arrowImages2 = []; //second stage of animation

let arrowSize = 100;

let arrowList = [];
let arrowAnimationInterval;
let arrowAnimationIntervalTime = 700;
let arrowAnimationState = false; //false - default, true - animated

// CHARACTERS  

let player = {
	X: 0,
	Y: 0,
	SCALE: 1,
	ISON: false,
};
let NPC = {}; //set in loadCharacters function, types of NPCs


let npcs = [];
let characterAnimationInterval;
let characterAnimationIntervalTime = 600;
let characterAnimationState = false; //works for players too

//images
let players = [];
let players2 = []; //second stage of animation
let selectedPlayer = 0;

let characters = [];
let characters2 = []; //second stage of animation

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
	location_minor: 0,
	location_minor_next: 0,
	speedrun: false,
	currentTicketPrice: 0,
};

let moneyLimit = 2500; //no minigames allowed above 2500
