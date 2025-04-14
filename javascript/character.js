class NPCInfo {
	x; y; scale; button; type;

	constructor(characterid, x, y, scale, fn) {
		this.x = x;
		this.y = y;
		this.scale = scale;
		this.type = characterid;
		this.button = ui.makeButton(
			"NPC"+String(Math.trunc(Math.random()*10000)), "", "draw_input_elem_npc",
			canvas.getX(x-(NPCManager.images[this.type].width*this.scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100)),
			canvas.getY(y-(NPCManager.images[this.type].height*this.scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100)),
			NPCManager.images[this.type].width*this.scale*canvas.characterSizeMultiplier,
			NPCManager.images[this.type].height*this.scale*canvas.characterSizeMultiplier,
			fn
		);
	}
};

let NPCManager = {
	list: [],
	types: {},
	interval: {},

	npcs: [],
	intervalTime: 600,
	animationState: false, //works for players too

	images: [],
	images2: [], //second stage of animation

	load: async function() {
		this.list = new Array();

		let charactersToLoad = ["default", "winter", "girl", "girl_2"];
		for(let i = 0; i < charactersToLoad.length; i++) {
			Player.images.push(await loadImage("assets/characters/p_"+charactersToLoad[i]+".png"));
		}
		for(let i = 0; i < charactersToLoad.length; i++) {
			Player.images2.push(await loadImage("assets/characters/p2_"+charactersToLoad[i]+".png"));
		}

		this.types = {
			ARMY: 0,
			COOK: 1,
			STATION: 2,
			TRAIN: 3,
			TRANSLATOR: 4,
			UTILITY: 5,
			CHEESEMAKER: 6,
			NEWS: 7,
		};

		let NPCSToLoad = ["army", "cook", "station", "train", "translator", "utility", "cheesemaker", "news"];
		for(let i = 0; i < NPCSToLoad.length; i++) {
			this.images.push(await loadImage("assets/characters/"+NPCSToLoad[i]+".png"));
		}
		for(let i = 0; i < NPCSToLoad.length; i++) {
			this.images2.push(await loadImage("assets/characters/2_"+NPCSToLoad[i]+".png"));
		}

		this.interval = window.setInterval(() => {
			if(ui.animationBlocked) return;

			if(Player.exists) {
				Player.remove(canvas.currentBGImage);
				if(this.animationState == false) Player.draw();
				else Player.draw2();
			}
			for(let i = 0; i < this.npcs.length; i++) {
				this.hide(this.npcs[i].type, this.npcs[i].x, this.npcs[i].y, this.npcs[i].scale, canvas.currentBGImage);
				//invert so looks better
				if(this.animationState  == true) {
					this.draw(this.npcs[i].type, this.npcs[i].x, this.npcs[i].y, this.npcs[i].scale);
				}
				else {
					this.draw2(this.npcs[i].type, this.npcs[i].x, this.npcs[i].y, this.npcs[i].scale);
				}
			}
			this.animationState  = !this.animationState ;
		}, this.intervalTime);
	},

	make: function(characterid, x, y, scale, fn) {
		this.npcs.push(new NPCInfo(characterid, x, y, scale, fn));
		this.animationState ? this.draw(characterid, x, y, scale) : this.draw2(characterid, x, y, scale);
		return waiterEventFromElement(this.npcs[this.npcs.length - 1].button, "click");
	},

	draw: function(characterid, x, y, scale) {
		canvas.image(
			this.images[characterid],
			x-(this.images[characterid].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
			y-(this.images[characterid].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
			scale*canvas.characterSizeMultiplier
		);
	},

	draw2: function(characterid, x, y, scale) {
		canvas.image(
			this.images2[characterid],
			x-(this.images2[characterid].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
			y-(this.images2[characterid].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
			scale*canvas.characterSizeMultiplier
		);
	},

	drawByAnimation: function(characterid, x, y, scale) {
		this.animationState ? this.draw(characterid, x, y, scale) : this.draw2(characterid, x, y, scale);
	},

	hide: function(characterid, x, y, scale, bgimage) {
		canvas.imageEquivalent(
			bgimage,
			x-(this.images[characterid].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
			y-(this.images[characterid].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
			this.images[characterid].width*scale*canvas.characterSizeMultiplier/canvas.canvas.width*100,
			this.images[characterid].height*scale*canvas.characterSizeMultiplier/canvas.canvas.height*100
		);
	},

	clear: function() {
		this.npcs.forEach((val) => {
			val.button.remove();
		});
		this.npcs.length = 0;
	}
};

let Player = {
	x: 0, y: 0, scale: 0, exists: false,

	//images
	images: [],
	images2: [], //second stage of animation
	selected: 0,

	//These calculations calculate the top left x and y as a percentage. (only X, Y as the center point is given)

	draw: function() {
		//canvas space processing for x, y happens in canvasImage
		canvas.image(
			this.images[this.selected],
			this.x-(this.images[this.selected].width*this.scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
			this.y-(this.images[this.selected].height*this.scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
			this.scale*canvas.characterSizeMultiplier
		);
	},
	draw2: function() {
		//canvas space processing for x, y happens in canvasImage
		canvas.image(
			this.images2[this.selected],
			this.x-(this.images2[this.selected].width*this.scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
			this.y-(this.images2[this.selected].height*this.scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
			this.scale*canvas.characterSizeMultiplier
		);
	},
	remove: function(bgimage) {
		canvas.imageEquivalent(
			bgimage,
			this.x-(this.images[this.selected].width*this.scale*canvas.characterSizeMultiplier/canvas.canvas.width/2*100),
			this.y-(this.images[this.selected].height*this.scale*canvas.characterSizeMultiplier/canvas.canvas.height/2*100),
			this.images[this.selected].width*this.scale*canvas.characterSizeMultiplier/canvas.canvas.width*100,
			this.images[this.selected].height*this.scale*canvas.characterSizeMultiplier/canvas.canvas.height*100
		);
	},
	hide: function () {
		this.exists = false;
	},
	set: function (x, y, scale) {
		this.x = x;
		this.y = y;
		this.scale = scale;
		this.exists = true;
		if(!ui.animationBlocked) {
			(NPCManager.animationState) ? this.draw() : this.draw2();
		}
	}
};
