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
const characterAnimationIntervalTime = 600;
let characterAnimationState = false; //works for players too

//images
let players = [];
let players2 = []; //second stage of animation
let selectedPlayer = 0;

let characters = [];
let characters2 = []; //second stage of animation

async function loadCharacters() {
	let charactersToLoad = ["default", "winter", "girl", "girl_2"];
	for(let i = 0; i < charactersToLoad.length; i++) {
		players.push(await loadImage("assets/characters/p_"+charactersToLoad[i]+".png"));
	}
	for(let i = 0; i < charactersToLoad.length; i++) {
		players2.push(await loadImage("assets/characters/p2_"+charactersToLoad[i]+".png"));
	}

	NPC = {
		ARMY: 0,
		COOK: 1,
		STATION: 2,
		TRAIN: 3,
		TRANSLATOR: 4,
		UTILITY: 5,
		CHEESEMAKER: 6,
	};

	let NPCSToLoad = ["army", "cook", "station", "train", "translator", "utility", "cheesemaker"];
	for(let i = 0; i < NPCSToLoad.length; i++) {
		characters.push(await loadImage("assets/characters/"+NPCSToLoad[i]+".png"));
	}
	for(let i = 0; i < NPCSToLoad.length; i++) {
		characters2.push(await loadImage("assets/characters/2_"+NPCSToLoad[i]+".png"));
	}

	//Interval setup

	characterAnimationInterval = window.setInterval(() => {
		if(ui.animationBlocked) return;

		if(player.ISON) {
			canvasPlayerRemove(player.X, player.Y, player.SCALE, canvas.currentBGImage);
			if(characterAnimationState == false) {
				canvasPlayer(player.X, player.Y, player.SCALE);
			}
			else {
				canvasPlayer2(player.X, player.Y, player.SCALE);
			}
		}
		for(let i = 0; i < npcs.length; i++) {
			hideNPC(npcs[i].TYPE, npcs[i].X, npcs[i].Y, npcs[i].SCALE, canvas.currentBGImage);
			//invert so looks better
			if(characterAnimationState == true) {
				drawNPC(npcs[i].TYPE, npcs[i].X, npcs[i].Y, npcs[i].SCALE);
			}
			else {
				drawNPC2(npcs[i].TYPE, npcs[i].X, npcs[i].Y, npcs[i].SCALE);
			}
		}
		characterAnimationState = !characterAnimationState;
	}, characterAnimationIntervalTime);
}

//These calculations calculate the top left x and y as a percentage. (only X, Y as the center point is given)

function canvasPlayer(x, y, scale) {
	//canvas space processing for x, y happens in canvasImage
	canvas.image(
		players[selectedPlayer],
		x-(players[selectedPlayer].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
		y-(players[selectedPlayer].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
		scale*canvas.characterSizeMultiplier
	);
	player.X = x;
	player.Y = y;
	player.SCALE = scale;
	player.ISON = true;
}
function canvasPlayer2(x, y, scale) {
	//canvas space processing for x, y happens in canvasImage
	canvas.image(
		players2[selectedPlayer],
		x-(players2[selectedPlayer].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
		y-(players2[selectedPlayer].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
		scale*canvas.characterSizeMultiplier
	);
	player.X = x;
	player.Y = y;
	player.SCALE = scale;
	player.ISON = true;
}

function canvasPlayerRemove(x, y, scale, bgimage) {
	canvas.imageEquivalent(
		bgimage,
		x-(players[selectedPlayer].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
		y-(players[selectedPlayer].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
		players[selectedPlayer].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width*100,
		players[selectedPlayer].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height*100
	);
	player.X = x;
	player.Y = y;
	player.SCALE = scale;
	player.ISON = false;
}

function canvasPlayerDisable() {
	player.ISON = false;
}

function NPCInfo(type, x, y, scale, fn) {
	this.X = x;
	this.Y = y;
	this.SCALE = scale;
	this.TYPE = type;
	this.BTN = ui.makeButton(
		"NPCInfo"+String(Math.trunc(Math.random()*10000)), "", "draw_input_elem_npc",
		canvas.getX(x-(characters[this.TYPE].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100)),
		canvas.getY(y-(characters[this.TYPE].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100)),
		characters[this.TYPE].width*scale*canvas.characterSizeMultiplier,
		characters[this.TYPE].height*scale*canvas.characterSizeMultiplier,
		fn
	);
}

function makeNPC(characterid, x, y, scale, fn) {
	npcs.push(new NPCInfo(characterid, x, y, scale, fn));
	drawNPC(characterid, x, y, scale);
	return waiterEventFromElement(npcs[npcs.length - 1].BTN, "click");
}

function drawNPC(characterid, x, y, scale) {
	canvas.image(
		characters[characterid],
		x-(characters[characterid].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
		y-(characters[characterid].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
		scale*canvas.characterSizeMultiplier
	);
}

function drawNPC2(characterid, x, y, scale) {
	canvas.image(
		characters2[characterid],
		x-(characters2[characterid].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
		y-(characters2[characterid].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
		scale*canvas.characterSizeMultiplier
	);
}

function hideNPC(characterid, x, y, scale, bgimage) {
	canvas.imageEquivalent(
		bgimage,
		x-(characters[characterid].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
		y-(characters[characterid].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
		characters[characterid].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width*100,
		characters[characterid].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height*100
	);
}

function deleteNPC() {
	for(let i = 0; i < npcs.length; i++) {
		if(npcs[i].x == X, npcs[i].y == Y) {
			npcs[i].BTN.remove();
			npcs.splice(i, 1); return;
		}
	}
}
function clearNPC() {
	npcs.forEach((val) => {
		val.BTN.remove();
	});
	npcs.length = 0;
}
