//CANVAS, BUTTONS AND CHARACTERS

//
// CANVAS
//

function canvasInit() {
	canvas = document.getElementById("draw");
	ctx = canvas.getContext("2d");

	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle = "#000000";
	ctx.lineWidth = 1;

}
function canvasFullscreen(afunc) {
	canvas.width = window.screen.width;
	canvas.height = window.screen.height;
	ctx.width = window.screen.width;
	ctx.height = window.screen.height;

	if(afunc !== undefined) { afunc(); }
}
function canvasOriginal(afunc) {
	canvas.width = 1000;
	canvas.height = 500;
	ctx.width = 1000;
	ctx.height = 500;

	if(afunc !== undefined) { afunc(); }
}

function canvasX(xvalue) {
	return Math.trunc(canvas.width*(xvalue/100));
}
function canvasY(yvalue) {
	return Math.trunc(canvas.height*(yvalue/100));
}

function canvasRoundedBox(x, y, sizex, sizey, radius) {
	ctx.beginPath();
	ctx.roundRect(x, y, sizex, sizey, radius);
	ctx.fill();
}
function canvasRoundedBoxBorder(x, y, sizex, sizey, radius) {
	ctx.beginPath();
	ctx.roundRect(x, y, sizex, sizey, radius);
	ctx.stroke();
}

// 0 - right side
// 0.5 PI - bottom
// PI - left size
// 1.5 PI - top

function canvasCircleBox(x, y, sizex, sizey) {
	ctx.fillRect(x + (sizey/2), y, sizex - sizey, sizey);
	ctx.beginPath();
	ctx.arc(x + (sizey/2), y + (sizey/2), sizey/2, Math.PI * 1.5, Math.PI * 0.5, true);
	ctx.arc(x + sizex - (sizey/2), y + (sizey/2), sizey/2, Math.PI * 1.5, Math.PI * 0.5);
	ctx.fill();
}
function canvasCircleBoxBorder(x, y, sizex, sizey) {
	ctx.beginPath();
	ctx.arc(x + (sizey/2), y + (sizey/2), sizey/2, Math.PI * 1.5, Math.PI * 0.5, true);
	ctx.moveTo(x + (sizey/2), y);
	ctx.lineTo(x + sizex - (sizey/2), y);
	ctx.moveTo(x + (sizey/2), y + sizey);
	ctx.lineTo(x + sizex - (sizey/2), y + sizey);
	ctx.moveTo(x + sizex, y); //moves to beginning of circle drawing
	ctx.arc(x + sizex - (sizey/2), y + (sizey/2), sizey/2, Math.PI * 1.5, Math.PI * 0.5);
	ctx.stroke();
}
function canvasBox(x, y, sizex, sizey) {
	ctx.fillRect(x, y, sizex, sizey);
}
function canvasBoxBorder(x, y, sizex, sizey) {
	ctx.strokeRect(x, y, sizex, sizey);
}

function canvasSetColor(color) {
	ctx.fillStyle = color;
}
function canvasSetBorder(color) {
	ctx.strokeStyle = color;
}

function canvasSetFont(font, fontsize, weight = "normal") {
	canvas_fontFamily = font;
	canvas_fontSize = String(fontsize);
	canvas_fontWeight = weight;
	ctx.font = canvas_fontWeight+" "+canvas_fontSize+"px "+canvas_fontFamily;
}
function canvasSetFontFamily(fontfamily) {
	canvas_fontFamily = fontfamily;
	ctx.font = canvas_fontWeight+" "+canvas_fontSize+"px "+canvas_fontFamily;
}
function canvasSetFontSize(fontsize) {
	canvas_fontSize = String(fontsize);
	ctx.font = canvas_fontWeight+" "+canvas_fontSize+"px "+canvas_fontFamily;
}
function canvasSetFontWeight(weight) {
	canvas_fontWeight = weight;
	ctx.font = canvas_fontWeight+" "+canvas_fontSize+"px "+canvas_fontFamily;
}

function canvasClear(clearcolor) {
	let temp = ctx.fillStyle;
	ctx.fillStyle = clearcolor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = temp;
}

function canvasTextS(text, x, y) {
	ctx.fillText(text, x, y);
}
function canvasTextBorderS(text, x, y) {
	ctx.strokeText(text, x - ctx.lineWidth, y - ctx.lineWidth);
}
function canvasTextAndBorderS(text, x, y) {
	ctx.strokeText(text, x - ctx.lineWidth, y - ctx.lineWidth);
	ctx.fillText(text, x, y);
}

function canvasTextM(text, x, y) {
	let lines = text.split('\n');
	let newlineyoffset = 0;
	let metrics = ctx.measureText(text);
	//lowest point from line + highest point from line
	let lineheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	lineheight *= 1.5;
	for(let Id = 0; Id < lines.length; Id++) {
		ctx.fillText(lines[Id], x, y + newlineyoffset);
		newlineyoffset += lineheight;
	}
}
function canvasTextBorderM(text, x, y) {
	let lines = text.split('\n');
	let newlineyoffset = 0;
	let metrics = ctx.measureText(text);
	//lowest point from line + highest point from line
	let lineheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	lineheight *= 1.5;
	for(let Id = 0; Id < lines.length; Id++) {
		ctx.strokeText(lines[Id], x, y + newlineyoffset);
		newlineyoffset += lineheight;
	}
}

//returns image
async function loadImage(filename) {
	let temp;
	const promise = new Promise((resolve) => {
        temp = new Image();
        temp.src = filename;
        temp.onload = resolve;
    });

    await promise;
	console.log("loadImage completed for " + filename);
	return temp;
}

function waiterEventFromElement(element, event) {
	//in promise: first arg resolve, then reject
	return new Promise((resolve) => {
	  const listener = () => {
		element.removeEventListener(event, listener); resolve();
	  }
	  element.addEventListener(event, listener);
	})
}

function canvasImage(image, x, y, scale) {
	ctx.drawImage(image, x, y, image.width * scale, image.height * scale);
}
function canvasImageD(image, x, y, sizex, sizey) {
	ctx.drawImage(image, x, y, sizex, sizey);
}

//
// BUTTONS
//

//returns said button
function addButton(id, text, x, y, sizex, sizey, fn) {
	let btn = document.createElement("button");
	
	btn.className = "draw_input_elem";
	btn.id = id;
	btn.innerHTML = text;

	btn.style.setProperty("width", sizex+"px");
	btn.style.setProperty("height", sizey+"px");
	btn.style.setProperty("left", x+"px");
	btn.style.setProperty("top", y+"px");

	btn.addEventListener("click", fn);

	document.getElementById("draw_contain").appendChild(btn);

	return btn;
}
function addSmallButton(id, text, x, y, sizex, sizey, fn) {
	let btn = document.createElement("button");
	
	btn.className = "draw_input_elem_small";
	btn.id = id;
	btn.innerHTML = text;

	btn.style.setProperty("width", sizex+"px");
	btn.style.setProperty("height", sizey+"px");
	btn.style.setProperty("left", x+"px");
	btn.style.setProperty("top", y+"px");

	btn.addEventListener("click", fn);

	document.getElementById("draw_contain").appendChild(btn);

	return btn;
}
function removeButton(id) {
	document.getElementById(id).remove();
}

//
// CHARACTERS
//

async function loadCharacter(charname) {
	characters.push(await loadImage("assets/characters/"+charname+".png"));
}
async function loadPlayer(pname) {
	players.push(await loadImage("assets/characters/p_"+pname+".png"));
}
async function loadCharacters() {
	const promise = new Promise((resolve) => {
		loadPlayer("default");
		loadPlayer("winter");
		loadPlayer("girl");
		loadPlayer("girl_2");

		//TODO: organize playes so they are always in order!

		loadCharacter("army");
		loadCharacter("cook");
		loadCharacter("station");
		loadCharacter("train");
		loadCharacter("translator");
		loadCharacter("utility");
		resolve();
	});

	await promise; return;
}

//
// LOADING
//

function canvasLoading(messageoverride = null) {
	canvasClear("purple");
	canvasTextS(((messageoverride == null) ? getTranslation(0) : messageoverride), canvasX(10), canvasY(10));
	canvasSetFontSize(20);

	canvasTextS("Translations", canvasX(10), canvasY(15));
	canvasTextS("Music", canvasX(10), canvasY(20));
	canvasTextS("SFX", canvasX(10), canvasY(25));
	canvasTextS("Voice", canvasX(10), canvasY(30));
	canvasTextS("Characters", canvasX(10), canvasY(35));
}

function canvasLoadingDone(place) {
	let message;
	switch(place) {
		case(0): message = "Translations"; break;
		case(1): message = "Music"; break;
		case(2): message = "SFX"; break;
		case(3): message = "Voice"; break;
		case(4): message = "Characters"; break;
	}

	canvasTextS(message+" done", canvasX(10), canvasY(15 + (place * 5)));
}