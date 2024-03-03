//CANVAS, BUTTONS AND CHARACTERS

//
// CANVAS
//

function canvasInit() {
	canvas = document.getElementById("draw");
	ctx = canvas.getContext("2d");
	
	canvas.width = 1000;
	canvas.height = 500;
	ctx.width = 1000;
	ctx.height = 500;
	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = 1;
	
	biggerWindowSize = ((canvas.width > canvas.height) ? canvas.width : canvas.height);
	smallerWindowSize = ((canvas.width < canvas.height) ? canvas.width : canvas.height);	

	fontSizeLarge = biggerWindowSize*0.048;
	fontSizeSmall = biggerWindowSize*0.024;
	characterSizeMultiplier = smallerWindowSize*0.0003;

	canvasSetFont("Arial, FreeSans", fontSizeLarge, "bold");
	canvasClear("#ffffff");
}
function canvasFullscreen(afunc = undefined) {
	canvas.width = window.screen.width;
	canvas.height = window.screen.height;
	ctx.width = window.screen.width;
	ctx.height = window.screen.height;

	if(afunc !== undefined) { afunc(); }
}
function canvasOriginal(afunc = undefined) {
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
	ctx.roundRect(canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey), radius);
	ctx.fill();
}
function canvasRoundedBoxBorder(x, y, sizex, sizey, radius) {
	ctx.beginPath();
	ctx.roundRect(canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey), radius);
	ctx.stroke();
}

// 0 - right side
// 0.5 PI - bottom
// PI - left size
// 1.5 PI - top

function canvasCircleBox(x, y, sizex, sizey) {
	let px = canvasX(x);
	let py = canvasY(y);
	let psizex = canvasX(sizex);
	let psizey = canvasY(sizey);

	ctx.fillRect(px + (psizey/2), py, psizex - psizey, psizey);
	ctx.beginPath();
	ctx.arc(px + (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5, true);
	ctx.arc(px + psizex - (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5);
	ctx.fill();
}
function canvasCircleBoxBorder(x, y, sizex, sizey) {
	let px = canvasX(x);
	let py = canvasY(y);
	let psizex = canvasX(sizex);
	let psizey = canvasY(sizey);

	ctx.beginPath();
	ctx.arc(px + (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5, true);
	ctx.moveTo(px + (psizey/2), py);
	ctx.lineTo(px + psizex - (psizey/2), py);
	ctx.moveTo(px + (psizey/2), py + psizey);
	ctx.lineTo(px + psizex - (psizey/2), py + psizey);
	ctx.moveTo(px + psizex, py); //moves to beginning of circle drawing
	ctx.arc(px + psizex - (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5);
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
function canvasSetSmallFont() {
	canvasSetFontSize(fontSizeSmall);
}
function canvasSetLargeFont() {
	canvasSetFontSize(fontSizeLarge);
}

function canvasClear(clearcolor) {
	let temp = ctx.fillStyle;
	ctx.fillStyle = clearcolor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = temp;
}

function canvasTextS(text, x, y) {
	ctx.fillText(text, canvasX(x), canvasY(y));
}
function canvasTextBorderS(text, x, y) {
	ctx.strokeText(text, canvasX(x) - ctx.lineWidth, canvasY(y) - ctx.lineWidth);
}
function canvasTextAndBorderS(text, x, y) {
	ctx.strokeText(text, canvasX(x) - ctx.lineWidth, canvasY(y) - ctx.lineWidth);
	ctx.fillText(text, canvasX(x), canvasY(y));
}

function canvasTextM(text, x, y) {
	let px = canvasX(x);
	let py = canvasY(y);
	let lines = text.split('\n');
	let newlineyoffset = 0;
	let metrics = ctx.measureText(text);
	//lowest point from line + highest point from line
	let lineheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	lineheight *= 1.5;
	for(let Id = 0; Id < lines.length; Id++) {
		ctx.fillText(lines[Id], px, py + newlineyoffset);
		newlineyoffset += lineheight;
	}
}
function canvasTextBorderM(text, x, y) {
	let px = canvasX(x);
	let py = canvasY(y);
	let lines = text.split('\n');
	let newlineyoffset = 0;
	let metrics = ctx.measureText(text);
	//lowest point from line + highest point from line
	let lineheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	lineheight *= 1.5;
	for(let Id = 0; Id < lines.length; Id++) {
		ctx.strokeText(lines[Id], px, py + newlineyoffset);
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
async function loadImages(filenames_array) {
	let temparr = [];
	for(let i = 0; i < filenames_array.length; i++) {
		temparr.push(await loadImage(filenames_array[i]));
	}
	return temparr;
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

function canvasBackground(image) {
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
}
function canvasImage(image, x, y, scale) {
	ctx.drawImage(image, canvasX(x), canvasY(y), image.width * scale, image.height * scale);
}
function canvasImageD(image, x, y, sizex, sizey) {
	ctx.drawImage(image, canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey));
}
function canvasCharacter(x, y, scale) {
	//canvas space processing for x, y happens in canvasImage
	canvasImage(
		players[selectedPlayer],
		x-(players[selectedPlayer].width*scale*characterSizeMultiplier/canvas.width/2*100),
		y-(players[selectedPlayer].height*scale*characterSizeMultiplier/canvas.height/2*100),
		scale*characterSizeMultiplier
	);
}
function canvasCharacterRedraw(x, y, scale, bgimage) {
	//TODO: finish
}

//
// BUTTONS
//

function internal_setButton(id, text, classname, x, y, sizex, sizey, fn) {
	let btn = document.createElement("button");
	btn.id = id;
	btn.innerHTML = text;
	btn.className = classname;
	btn.style.setProperty("width", sizex+"px");
	btn.style.setProperty("height", sizey+"px");
	btn.style.setProperty("left", x+"px");
	btn.style.setProperty("top", y+"px");
	btn.addEventListener("click", fn);
	btn.addEventListener("click", () => { sfxPlay(0); })
	document.getElementById("draw_contain").appendChild(btn);
	return btn;
}

//returns said button
function addButton(id, text, x, y, sizex, sizey, fn) {
	return internal_setButton(id, text, "draw_input_elem", canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey), fn);
}
function addSmallButton(id, text, x, y, sizex, sizey, fn) {
	return internal_setButton(id, text, "draw_input_elem_small", canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey), fn);
}
function removeButton(id) {
	document.getElementById(id).remove();
}

function showButton(id) {
	document.getElementById(id).style.setProperty("display", "block");
}
function hideButton(id) {
	document.getElementById(id).style.setProperty("display", "none");
}

//
// ARROWS
//

async function loadArrows() {
	arrowImages.push(await loadImage("assets/arrow/left.png"));
	arrowImages.push(await loadImage("assets/arrow/right.png"));
	arrowImages.push(await loadImage("assets/arrow/top.png"));
	arrowImages.push(await loadImage("assets/arrow/bottom.png"));
	arrowImages.push(await loadImage("assets/arrow/info.png"));
}

function addArrow(id, x, y, type, fn) {
	ctx.drawImage(arrowImages[type], canvasX(x) - (arrowSize/2), canvasY(y) - (arrowSize/2), 100, 100);
	return internal_setButton(id, "", "draw_input_elem_arrow", canvasX(x) - (arrowSize/2), canvasY(y) - (arrowSize/2), 100, 100, fn);
}
function removeArrow(id) {
	removeButton(id);
}
function clearArrows() {
	document.getElementById("draw_contain").querySelectorAll(".draw_input_elem_arrow").forEach((val) => {
		val.remove();
	});
}

function ArrowInfo(x, y, type, fn) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.fn = fn;
}

//takes in array of ArrowInfos
function renderArrows(arrows) {
	let tempPromises = [];
	for(let i = 0; i < arrows.length; i++) {
		tempPromises.push(waiterEventFromElement(addArrow("", arrows[i].x, arrows[i].y, arrows[i].type, () => { arrows[i].fn.call(); clearArrows(); }), "click"));
	}
	return Promise.any(tempPromises);
}

//
// CHARACTERS
//

async function loadCharacters() {
	let charactersToLoad = ["default", "winter", "girl", "girl_2"];
	for(let i = 0; i < charactersToLoad.length; i++) {
		players.push(await loadImage("assets/characters/p_"+charactersToLoad[i]+".png"));
	}

	let NPCSToLoad = ["army", "cook", "station", "train", "translator", "utility"];
	for(let i = 0; i < NPCSToLoad.length; i++) {
		characters.push(await loadImage("assets/characters/"+NPCSToLoad[i]+".png"));
	}
}

//
// LOADING
//

function canvasLoading(messageoverride = null) {
	canvasClear("purple");
	canvasSetColor("#ffffff");
	canvasSetLargeFont();
	canvasTextS(((messageoverride == null) ? getTranslation(0) : messageoverride), 10, 10);
	canvasSetSmallFont();
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

	canvasTextS(message+" done", 10, 15 + (place * 5));
}