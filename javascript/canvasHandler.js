//CANVAS, BUTTONS AND CHARACTERS

//
// CANVAS
//

function canvasSet() {
	biggerWindowSize = ((canvas.width > canvas.height) ? canvas.width : canvas.height);
	smallerWindowSize = ((canvas.width < canvas.height) ? canvas.width : canvas.height);	

	fontSizeLarge = biggerWindowSize*0.048;
	fontSizeSmall = biggerWindowSize*0.024;
	characterSizeMultiplier = smallerWindowSize*0.0003;

	canvasSetSmallFont();
}

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
	
	canvasSet();
	
	canvasSetFont("Arial, FreeSans", fontSizeLarge, "bold");
	canvasClear("#ffffff");
}

function canvasX(xvalue) {
	return Math.trunc(canvas.width*(xvalue/100));
}
function canvasY(yvalue) {
	return Math.trunc(canvas.height*(yvalue/100));
}

function canvasTransposeYToX(yvalue) {
	return canvas.height/canvas.width*yvalue;
}

function canvasGetScaleX() {
	return canvas.width/1000;
}
function canvasGetScaleY() {
	return canvas.height/500;
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
	ctx.fillRect(canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey));
}
function canvasBoxBorder(x, y, sizex, sizey) {
	ctx.strokeRect(canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey));
}
function canvasBoxSamesizeX(x, y, size) {
	ctx.fillRect(canvasX(x), canvasY(y), canvasX(size), canvasX(size));
}
function canvasBoxSamesizeY(x, y, size) {
	ctx.fillRect(canvasX(x), canvasY(y), canvasY(size), canvasY(size));
}

function canvasSetColor(color) {
	ctx.fillStyle = color;
}
function canvasGetColor() {
	return ctx.fillStyle;
}
function canvasSetBorder(color) {
	ctx.strokeStyle = color;
}
function canvasSetBrightness(brightness) {
	ctx.filter = "brightness("+brightness+"%)";
}
function canvasResetBrightness() {
	ctx.filter = "brightness(100%)";
}
function canvasGetBrightness() {
	let str = String(ctx.filter);
	return Number(str.substring(str.indexOf('(') + 1, str.indexOf(')', str.indexOf('(')) - 1));
}

function canvasSetAlpha(alpha) {
	ctx.globalAlpha = alpha;
}
function canvasResetAlpha() {
	ctx.globalAlpha = 1;
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

	npcs.length = 0;
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
	for(let i = 0; i < lines.length; i++) {
		ctx.fillText(lines[i], px, py + newlineyoffset);
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
	for(let i = 0; i < lines.length; i++) {
		ctx.strokeText(lines[i], px, py + newlineyoffset);
		newlineyoffset += lineheight;
	}
}

//typewriter function write letter by letter
//pass promises as objects!
//{ promise: MyPromise }

async function canvasTypewriterS(text, x, y, skip = { promise: Promise.reject() }) {
	for(let i = 0; i < text.length; i++) {
		if(i % 3 == 0) { sfxPlay(11); }
		ctx.fillText(text.substring(0,i), canvasX(x), canvasY(y));
		await Promise.any([skip.promise, new Promise((resolve) => {
			window.setTimeout(() => {
				resolve();
			}, 50);
		})]);
	}
	sfxStop(11);
}
async function canvasTypewriterM(text, x, y, skip = { promise: Promise.reject() }) {
	let lines = text.split('\n');
	let newlineyoffset = 0;
	let metrics = ctx.measureText(text);
	let lineheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	lineheight *= 1.5;

	for(let i = 0; i < lines.length; i++) {
		for(let j = 0; j < lines[i].length; j++) {
			if(j % 3 == 0) { sfxPlay(11); } //adjust volume!
			ctx.fillText(lines[i].substring(0,j), canvasX(x),  canvasY(y) + newlineyoffset);
			await Promise.any([skip.promise, new Promise((resolve) => {
				window.setTimeout(() => {
					resolve();
				}, 50);
			})]);
		}
		newlineyoffset += lineheight;
	}
	sfxStop(11);
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

function canvasBackground(image) {
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	currentBGImage = image;
}
//just draw image
function canvasImage(image, x, y, scale) {
	ctx.drawImage(image, canvasX(x), canvasY(y), image.width * scale, image.height * scale);
}
//draws part of image onto canvas (draws equivalent part)
function canvasImageEquivalent(image, x, y, sizex, sizey) {
	ctx.drawImage(
		image,
		image.width*x/100, image.height*y/100, image.width*sizex/100, image.height*sizey/100,
		canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey)
	);
}

//draws whole image to a speicifed space on canvas
function canvasImageDest(image, x, y, sizex, sizey) {
	ctx.drawImage(
		image,
		0, 0, image.width, image.height,
		canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey)
	);
}
//draws square image to canvas
function canvasImageSamesizeX(image, x, y, size) {
	ctx.drawImage(
		image,
		0, 0, image.width, image.height,
		canvasX(x), canvasY(y), canvasX(size), canvasX(size)
	);
}
//draws square image to canvas
function canvasImageSamesizeY(image, x, y, size) {
	ctx.drawImage(
		image,
		0, 0, image.width, image.height,
		canvasX(x), canvasY(y), canvasY(size), canvasY(size)
	);
}

async function canvasFadeOut(strength = 10) {
	animationBlocked = true;
	let savedcvs = await loadImage(canvas.toDataURL("image/png", 1)); //very useful!!!1!!!111!!
	while(canvasGetBrightness() > 5) {
		await new Promise((resolve) => {
			window.setTimeout(() => {
				canvasSetBrightness(canvasGetBrightness() - strength);
				canvasBackground(savedcvs);
				resolve();
			}, 50);
		});
	}
	canvasResetBrightness();
	animationBlocked = false;
	return;
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