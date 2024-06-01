//CANVAS, BUTTONS AND CHARACTERS

//
// CANVAS
//

function canvasSet(canvas) {
	biggerWindowSize = ((canvas.width > canvas.height) ? canvas.width : canvas.height);
	smallerWindowSize = ((canvas.width < canvas.height) ? canvas.width : canvas.height);	

	fontSizeLarge = biggerWindowSize*0.048;
	fontSizeSmall = biggerWindowSize*0.024;
	characterSizeMultiplier = smallerWindowSize*0.0003;
}

function canvasInit() {
	let canvas = document.getElementById("draw");
	let ctx = canvas.getContext("2d");
	
	canvas.width = 1000;
	canvas.height = 500;
	ctx.width = 1000;
	ctx.height = 500;
	ctx.fillStyle = "#ffffff";
	ctx.strokeStyle = "#ffffff";
	ctx.lineWidth = 1;
	
	canvasSet(canvas);
	
	canvasSetFont(canvas, ctx, "Arial, FreeSans", fontSizeLarge, "bold");
	canvasClear(canvas, ctx, "#ffffff");
	canvasSetSmallFont(canvas, ctx);

	return { a: canvas, b: ctx };
}

function canvasX(canvas, xvalue) {
	return Math.trunc(canvas.width*(xvalue/100));
}
function canvasY(canvas, yvalue) {
	return Math.trunc(canvas.height*(yvalue/100));
}

function canvasTransposeYToX(canvas, yvalue) {
	return parseInt(canvas.height/canvas.width*yvalue);
}

function canvasGetScaleX(canvas) {
	return canvas.width/1000;
}
function canvasGetScaleY(canvas) {
	return canvas.height/500;
}

function canvasRoundedBox(canvas, ctx, x, y, sizex, sizey, radius) {
	ctx.beginPath();
	ctx.roundRect(canvasX(canvas, x), canvasY(canvas, y), canvasX(canvas, sizex), canvasY(canvas, sizey), radius);
	ctx.fill();
}
function canvasRoundedBoxBorder(canvas, ctx, x, y, sizex, sizey, radius) {
	ctx.beginPath();
	ctx.roundRect(canvasX(canvas, x), canvasY(canvas, y), canvasX(canvas, sizex), canvasY(canvas, sizey), radius);
	ctx.stroke();
}

// 0 - right side
// 0.5 PI - bottom
// PI - left size
// 1.5 PI - top

function canvasCircleBox(canvas, ctx, x, y, sizex, sizey) {
	let px = canvasX(canvas, x);
	let py = canvasY(canvas, y);
	let psizex = canvasX(canvas, sizex);
	let psizey = canvasY(canvas, sizey);

	ctx.fillRect(px + (psizey/2), py, psizex - psizey, psizey);
	ctx.beginPath();
	ctx.arc(px + (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5, true);
	ctx.arc(px + psizex - (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5);
	ctx.fill();
}
function canvasCircleBoxBorder(canvas, ctx, x, y, sizex, sizey) {
	let px = canvasX(canvas, x);
	let py = canvasY(canvas, y);
	let psizex = canvasX(canvas, sizex);
	let psizey = canvasY(canvas, sizey);

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
function canvasBox(canvas, ctx, x, y, sizex, sizey) {
	ctx.fillRect(canvasX(canvas, x), canvasY(canvas, y), canvasX(canvas, sizex), canvasY(canvas, sizey));
}
function canvasBoxBorder(canvas, ctx, x, y, sizex, sizey) {
	ctx.strokeRect(canvasX(canvas, x), canvasY(canvas, y), canvasX(canvas, sizex), canvasY(canvas, sizey));
}
function canvasBoxSamesizeX(canvas, ctx, x, y, size) {
	ctx.fillRect(canvasX(canvas, x), canvasY(canvas, y), canvasX(canvas, size), canvasX(canvas, size));
}
function canvasBoxSamesizeY(canvas, ctx, x, y, size) {
	ctx.fillRect(canvasX(canvas, x), canvasY(canvas, y), canvasY(canvas, size), canvasY(canvas, size));
}

//Canvas 

function canvasSetColor(canvas, ctx, color) {
	ctx.fillStyle = color;
}
function canvasGetColor(canvas, ctx) {
	return ctx.fillStyle;
}
function canvasSetBorder(canvas, ctx, color) {
	ctx.strokeStyle = color;
}
function canvasSetBrightness(canvas, ctx, brightness) {
	ctx.filter = "brightness("+brightness+"%)";
}
function canvasResetBrightness(canvas, ctx) {
	ctx.filter = "brightness(100%)";
}
function canvasGetBrightness(canvas, ctx) {
	let str = String(ctx.filter);
	return Number(str.substring(str.indexOf('(') + 1, str.indexOf(')', str.indexOf('(')) - 1));
}

function canvasSetAlpha(canvas, ctx, alpha) {
	ctx.globalAlpha = alpha;
}
function canvasResetAlpha(canvas, ctx) {
	ctx.globalAlpha = 1;
}

function canvasSetFont(canvas, ctx, font, fontsize, weight = "normal") {
	canvas_fontFamily = font;
	canvas_fontSize = String(fontsize);
	canvas_fontWeight = weight;
	ctx.font = canvas_fontWeight+" "+canvas_fontSize+"px "+canvas_fontFamily;
}
function canvasSetFontFamily(canvas, ctx, fontfamily) {
	canvas_fontFamily = fontfamily;
	ctx.font = canvas_fontWeight+" "+canvas_fontSize+"px "+canvas_fontFamily;
}
function canvasSetFontSize(canvas, ctx, fontsize) {
	canvas_fontSize = String(fontsize);
	ctx.font = canvas_fontWeight+" "+canvas_fontSize+"px "+canvas_fontFamily;
}
function canvasSetFontWeight(canvas, ctx, weight) {
	canvas_fontWeight = weight;
	ctx.font = canvas_fontWeight+" "+canvas_fontSize+"px "+canvas_fontFamily;
}
function canvasSetVerySmallFont(canvas, ctx) {
	canvasSetFontSize(canvas, ctx, fontSizeSmall/2);
}
function canvasSetSmallFont(canvas, ctx) {
	canvasSetFontSize(canvas, ctx, fontSizeSmall);
}
function canvasSetLargeFont(canvas, ctx) {
	canvasSetFontSize(canvas, ctx, fontSizeLarge);
}

function canvasClear(canvas, ctx, clearcolor) {
	let temp = ctx.fillStyle;
	ctx.fillStyle = clearcolor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = temp;

	npcs.length = 0;
}

function canvasTextS(canvas, ctx, text, x, y) {
	ctx.fillText(text, canvasX(canvas, x), canvasY(canvas, y));
}
function canvasTextBorderS(canvas, ctx, text, x, y) {
	ctx.strokeText(text, canvasX(canvas, x) - ctx.lineWidth, canvasY(canvas, y) - ctx.lineWidth);
}
function canvasTextAndBorderS(canvas, ctx, text, x, y) {
	ctx.strokeText(text, canvasX(canvas, x) - ctx.lineWidth, canvasY(canvas, y) - ctx.lineWidth);
	ctx.fillText(text, canvasX(canvas, x), canvasY(canvas, y));
}

function canvasTextM(canvas, ctx, text, x, y) {
	let px = canvasX(canvas, x);
	let py = canvasY(canvas, y);
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
function canvasTextBorderM(canvas, ctx, text, x, y) {
	let px = canvasX(canvas, x);
	let py = canvasY(canvas, y);
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

async function canvasTypewriterS(canvas, ctx, text, x, y, skip = { promise: Promise.reject() }) {
	for(let i = 0; i < text.length; i++) {
		if(i % 3 == 0) { sfxPlay(11); }
		ctx.fillText(text.substring(0,i), canvasX(canvas, x), canvasY(canvas, y));
		await Promise.any([skip.promise, new Promise((resolve) => {
			window.setTimeout(() => {
				resolve();
			}, 50);
		})]);
	}
	sfxStop(11);
}
async function canvasTypewriterM(canvas, ctx, text, x, y, skip = { promise: Promise.reject() }) {
	let lines = text.split('\n');
	let newlineyoffset = 0;
	let metrics = ctx.measureText(text);
	let lineheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
	lineheight *= 1.5;

	for(let i = 0; i < lines.length; i++) {
		for(let j = 0; j < lines[i].length; j++) {
			if(j % 3 == 0) { sfxPlay(11); } //adjust volume!
			ctx.fillText(lines[i].substring(0,j), canvasX(canvas, x),  canvasY(canvas, y) + newlineyoffset);
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

function canvasBackground(canvas, ctx, image) {
	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
	currentBGImage = image;
}
//just draw image
function canvasImage(canvas, ctx, image, x, y, scale) {
	ctx.drawImage(image, canvasX(canvas, x), canvasY(canvas, y), image.width * scale, image.height * scale);
}
//draws part of image onto canvas (draws equivalent part)
function canvasImageEquivalent(canvas, ctx, image, x, y, sizex, sizey) {
	ctx.drawImage(
		image,
		image.width*x/100, image.height*y/100, image.width*sizex/100, image.height*sizey/100,
		canvasX(canvas, x), canvasY(canvas, y), canvasX(canvas, sizex), canvasY(canvas, sizey)
	);
}

//draws whole image to a speicifed space on canvas
function canvasImageDest(canvas, ctx, image, x, y, sizex, sizey) {
	ctx.drawImage(
		image,
		0, 0, image.width, image.height,
		canvasX(canvas, x), canvasY(canvas, y), canvasX(canvas, sizex), canvasY(canvas, sizey)
	);
}
//draws square image to canvas
function canvasImageSamesizeX(canvas, ctx, image, x, y, size) {
	ctx.drawImage(
		image,
		0, 0, image.width, image.height,
		canvasX(canvas, x), canvasY(canvas, y), canvasX(canvas, size), canvasX(canvas, size)
	);
}
//draws square image to canvas
function canvasImageSamesizeY(canvas, ctx, image, x, y, size) {
	ctx.drawImage(
		image,
		0, 0, image.width, image.height,
		canvasX(canvas, x), canvasY(canvas, y), canvasY(canvas, size), canvasY(canvas, size)
	);
}

async function canvasFadeOut(canvas, ctx, strength = 10) {
	animationBlocked = true;
	let savedcvs = await loadImage(canvas.toDataURL("image/png", 1)); //very useful!!!1!!!111!!
	while(canvasGetBrightness(canvas, ctx) > 5) {
		await new Promise((resolve) => {
			window.setTimeout(() => {
				canvasSetBrightness(canvas, ctx, canvasGetBrightness(canvas, ctx) - strength);
				canvasBackground(canvas, ctx, savedcvs);
				resolve();
			}, 50);
		});
	}
	canvasResetBrightness(canvas, ctx);
	animationBlocked = false;
	return;
}

//
// LOADING SCREEN
//

function canvasLoading(canvas, ctx, messageoverride = null) {
	canvasClear(canvas, ctx, "purple");
	canvasSetColor(canvas, ctx, "#ffffff");
	canvasSetLargeFont(canvas, ctx);
	canvasTextS(canvas, ctx, ((messageoverride == null) ? getTranslation(0) : messageoverride), 10, 10);
	canvasSetSmallFont(canvas, ctx);
}

function canvasLoadingDone(canvas, ctx, place) {
	let message;
	switch(place) {
		case(0): message = "Translations"; break;
		case(1): message = "Music"; break;
		case(2): message = "SFX"; break;
		case(3): message = "Voice"; break;
		case(4): message = "Characters"; break;
	}

	canvasTextS(canvas, ctx, message+" done", 10, 15 + (place * 5));
}