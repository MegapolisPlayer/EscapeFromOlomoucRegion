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

function canvasSetColor(color) {
	ctx.fillStyle = color;
	ctx.strokeStyle = color;
}
function canvasSetFont(font, fontsize, weight = "normal") {
	ctx.font = weight+" "+fontsize+"px "+font;
}

function canvasClear(clearcolor) {
	ctx.fillStyle = clearcolor;
	ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function canvasTextS(text, x, y) {
	ctx.fillText(text, x, y);
}
//TODO: align with normal text
function canvasTextBorderS(text, x, y) {
	ctx.strokeText(text, x, y);
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
	const promise = new Promise(resolve => {
        temp = new Image();
        temp.src = filename;
        temp.onload = resolve;
    });

    await promise;
	console.log("loadImage completed for " + filename);
	return temp;
}

function canvasImage(image, x, y, sizex, sizey) {
	ctx.drawImage(image, x, y, sizex, sizey);
}

//
// BUTTONS
//

function addButton(id, text, x, y, sizex, sizey) {
	let btn = document.createElement("button");
	
	btn.className = "draw_input_elem";
	btn.id = id;
	btn.innerHTML = text;

	btn.style.setProperty("width", sizex+"px");
	btn.style.setProperty("height", sizey+"px");
	btn.style.setProperty("left", x+"px");
	btn.style.setProperty("top", y+"px");

	document.getElementById("draw_contain").appendChild(btn);
}
function removeButton(id) {
	let btn = document.getElementById(id);
	btn.parentElement.removeChild(btn);
}

//
// CHARACTERS
//

