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
		if(animationBlocked) return;

		if(player.ISON) {
			canvasPlayerRemove(player.X, player.Y, player.SCALE, currentBGImage);
			if(characterAnimationState == false) {
				canvasPlayer(player.X, player.Y, player.SCALE);
			}
			else {
				canvasPlayer2(player.X, player.Y, player.SCALE);
			}

			if(dialogueEnabled) {
				let tempcolor = canvasGetColor();
				canvasSetColor("#ffffff");

				let boxsize = player.Y+(players[selectedPlayer].height*player.SCALE*characterSizeMultiplier/canvas.height/2*100)-80;

				//we expect this to take less than 50ms
				canvasBox(
					player.X-(players[selectedPlayer].width*player.SCALE*characterSizeMultiplier/canvas.width/2*100),
					80,
					players[selectedPlayer].width*player.SCALE*characterSizeMultiplier/canvas.width*100, 80,
					(boxsize < 0) ? 0 : boxsize //only the part which the character touches
				);
				canvasSetColor(tempcolor); //for the text, if we dont manage fast enough it will redraw on next char
			}
		}
		for(let i = 0; i < npcs.length; i++) {
			canvasNPCRemove(npcs[i].TYPE, npcs[i].X, npcs[i].Y, npcs[i].SCALE, currentBGImage);
			//invert so looks better
			if(characterAnimationState == true) {
				canvasDrawNPC(npcs[i].TYPE, npcs[i].X, npcs[i].Y, npcs[i].SCALE);
			}
			else {
				canvasDrawNPC2(npcs[i].TYPE, npcs[i].X, npcs[i].Y, npcs[i].SCALE);
			}

			if(dialogueEnabled) {
				canvasSetColor("#ffffff");

				let boxsize = npcs[i].Y+(characters[npcs[i].TYPE].height*characterSizeMultiplier/canvas.height*100)-80;

				canvasBox(
					npcs[i].X-(characters[npcs[i].TYPE].width*npcs[i].SCALE*characterSizeMultiplier/canvas.width/2*100),
					80,
					characters[npcs[i].TYPE].width*npcs[i].SCALE*characterSizeMultiplier/canvas.width*100,
					(boxsize < 0) ? 0 : boxsize //only the part which the character occupies will get redrawn
				);
			}
		}
		characterAnimationState = !characterAnimationState;
	}, characterAnimationIntervalTime);
}

//These calculations calculate the top left x and y as a percentage. (only X, Y as the center point is given)

function canvasPlayer(x, y, scale) {
	//canvas space processing for x, y happens in canvasImage
	canvasImage(
		players[selectedPlayer],
		x-(players[selectedPlayer].width*scale*characterSizeMultiplier/canvas.width/2*100),
		y-(players[selectedPlayer].height*scale*characterSizeMultiplier/canvas.height/2*100),
		scale*characterSizeMultiplier
	);
	player.X = x;
	player.Y = y;
	player.SCALE = scale;
	player.ISON = true;
}
function canvasPlayer2(x, y, scale) {
	//canvas space processing for x, y happens in canvasImage
	canvasImage(
		players2[selectedPlayer],
		x-(players2[selectedPlayer].width*scale*characterSizeMultiplier/canvas.width/2*100),
		y-(players2[selectedPlayer].height*scale*characterSizeMultiplier/canvas.height/2*100),
		scale*characterSizeMultiplier
	);
	player.X = x;
	player.Y = y;
	player.SCALE = scale;
	player.ISON = true;
}

function canvasPlayerRemove(x, y, scale, bgimage) {
	canvasImageEquivalent(
		bgimage,
		x-(players[selectedPlayer].width*scale*characterSizeMultiplier/canvas.width/2*100),
		y-(players[selectedPlayer].height*scale*characterSizeMultiplier/canvas.height/2*100),
		players[selectedPlayer].width*scale*characterSizeMultiplier/canvas.width*100,
		players[selectedPlayer].height*scale*characterSizeMultiplier/canvas.height*100
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
	this.BTN = internal_setButton(
		"NPCInfo"+String(Math.trunc(Math.random()*10000)), "", "draw_input_elem_npc",
		canvasX(x-(characters[this.TYPE].width*scale*characterSizeMultiplier/canvas.width/2*100)),
		canvasY(y-(characters[this.TYPE].height*scale*characterSizeMultiplier/canvas.height/2*100)),
		characters[this.TYPE].width*scale*characterSizeMultiplier,
		characters[this.TYPE].height*scale*characterSizeMultiplier,
		fn
	);
}

function canvasNPC(characterid, x, y, scale, fn) {
	npcs.push(new NPCInfo(characterid, x, y, scale, fn));
	canvasDrawNPC(characterid, x, y, scale);
	return waiterEventFromElement(npcs[npcs.length - 1].BTN, "click");
}

function canvasDrawNPC(characterid, x, y, scale) {
	canvasImage(
		characters[characterid],
		x-(characters[characterid].width*scale*characterSizeMultiplier/canvas.width/2*100),
		y-(characters[characterid].height*scale*characterSizeMultiplier/canvas.height/2*100),
		scale*characterSizeMultiplier
	);
}

function canvasDrawNPC2(characterid, x, y, scale) {
	canvasImage(
		characters2[characterid],
		x-(characters2[characterid].width*scale*characterSizeMultiplier/canvas.width/2*100),
		y-(characters2[characterid].height*scale*characterSizeMultiplier/canvas.height/2*100),
		scale*characterSizeMultiplier
	);
}

function canvasNPCRemove(characterid, x, y, scale, bgimage) {
	canvasImageEquivalent(
		bgimage,
		x-(characters[characterid].width*scale*characterSizeMultiplier/canvas.width/2*100),
		y-(characters[characterid].height*scale*characterSizeMultiplier/canvas.height/2*100),
		characters[characterid].width*scale*characterSizeMultiplier/canvas.width*100,
		characters[characterid].height*scale*characterSizeMultiplier/canvas.height*100
	);
}

function canvasNPCDelete() {
	for(let i = 0; i < npcs.length; i++) {
		if(npcs[i].x == X, npcs[i].y == Y) {
			npcs[i].BTN.remove();
			npcs.splice(i, 1); return;
		}
	}
}
function canvasNPCClear() {
	npcs.forEach((val) => {
		val.BTN.remove();
	});
	npcs.length = 0;
}