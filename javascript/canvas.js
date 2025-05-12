//non-getters have daisy-chained methods
class CanvasImplementation {
	canvas;
	ctx;
	biggerWindowSize;
	smallerWindowSize;
	fontSize;
	fontSizeSmall;
	fontSizeLarge;
	characterSizeMultiplier;
	fontFamily;
	fontWeight;
	currentBGImage;

	constructor(madecanvas_override, madectx_override) {
		if(madecanvas_override != undefined) {
			this.canvas = madecanvas_override;
		}
		else {
			this.canvas = document.getElementById("draw");
			this.canvas.width = 1000;
			this.canvas.height = 500;
		}

		if(madectx_override != undefined) {
			this.ctx = madectx_override;
		}
		else {
			this.ctx = this.canvas.getContext("2d");
		}
		this.ctx.width = this.canvas.width;
		this.ctx.height = this.canvas.height;
		this.ctx.fillStyle = "#ffffff";
		this.ctx.strokeStyle = "#ffffff";
		this.ctx.lineWidth = 1;

		this.biggerWindowSize = ((this.canvas.width > this.canvas.height) ? this.canvas.width : this.canvas.height);
		this.smallerWindowSize = ((this.canvas.width < this.canvas.height) ? this.canvas.width : this.canvas.height);

		this.fontSizeSmall = this.biggerWindowSize*0.024;
		this.fontSizeLarge = this.biggerWindowSize*0.048;
		this.characterSizeMultiplier = this.smallerWindowSize*0.0003;

		this.setFont("Arial, FreeSans", this.fontSizeLarge, "bold");

		if(madecanvas_override == undefined && madectx_override == undefined) {
			this.clear("#ffffff");
		}
		this.setSmallFontSize();
	}

	updateValues() {
		this.biggerWindowSize = ((this.canvas.width > this.canvas.height) ? this.canvas.width : this.canvas.height);
		this.smallerWindowSize = ((this.canvas.width < this.canvas.height) ? this.canvas.width : this.canvas.height);

		this.fontSizeSmall = this.biggerWindowSize*0.024;
		this.fontSizeLarge = this.biggerWindowSize*0.048;
		this.characterSizeMultiplier = this.smallerWindowSize*0.0003;
	}

	async resize(x, y) {
		//save state
		let savedcvs = await loadImage(this.canvas.toDataURL("image/png", 1)); //very useful!!!1!!!111!!

		//change vars
		let oldfill = this.ctx.fillStyle;
		this.canvas.width = x;
		this.canvas.height = y;
		this.ctx.width = x;
		this.ctx.height = y;
		this.ctx.fillStyle = oldfill;

		this.updateValues();
		this.background(savedcvs);

		return this;
	}

	getX(xvalue) {
		return Math.trunc(this.canvas.width*(xvalue/100));
	}
	getY(yvalue) {
		return Math.trunc(this.canvas.height*(yvalue/100));
	}

	convertYtoX(yvalue) {
		return Math.trunc(parseInt(this.canvas.height)/parseInt(this.canvas.width)*yvalue);
	}
	convertXtoY(xvalue) {
		return Math.trunc(parseInt(this.canvas.width)/parseInt(this.canvas.height)*xvalue);
	}

	getScaleX() {
		return this.canvas.width/1000;
	}
	getScaleY() {
		return this.canvas.height/500;
	}

	drawRoundedBox(x, y, sizex, sizey, radius) {
		this.ctx.beginPath();
		this.ctx.roundRect(this.getX(x), this.getY(y), this.getX(sizex), this.getY(sizey), radius);
		this.ctx.fill();
		return this;
	}
	drawRoundedBoxBorder(x, y, sizex, sizey, radius) {
		this.ctx.beginPath();
		this.ctx.roundRect(canvasX(x), canvasY(y), this.getX(sizex), this.getY(sizey), radius);
		this.ctx.stroke();
		return this;
	}

	// 0 - right side
	// 0.5 PI - bottom
	// PI - left size
	// 1.5 PI - top

	drawCircle(x, y, r) {
		this.ctx.beginPath();
		this.ctx.arc(this.getX(x), this.getY(y), this.getX(r), 0, Math.PI*2);
		this.ctx.fill();
		return this;
	}
	//radius in canvas Y coords
	drawCircleY(x, y, r) {
		this.ctx.beginPath();
		this.ctx.arc(this.getX(x), this.getY(y), this.getY(r), 0, Math.PI*2);
		this.ctx.fill();
		return this;
	}

	drawCircleBox(x, y, sizex, sizey) {
		let px = this.getX(x);
		let py = this.getY(y);
		let psizex = this.getX(sizex);
		let psizey = this.getY(sizey);

		this.ctx.fillRect(px + (psizey/2), py, psizex - psizey, psizey);
		this.ctx.beginPath();
		this.ctx.arc(px + (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5, true);
		this.ctx.arc(px + psizex - (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5);
		this.ctx.fill();

		return this;
	}
	drawCircleBoxBorder(x, y, sizex, sizey) {
		let px = this.getX(this.canvas, x);
		let py = this.getY(this.canvas, y);
		let psizex = this.getX(this.canvas, sizex);
		let psizey = this.getY(this.canvas, sizey);

		this.ctx.beginPath();
		this.ctx.arc(px + (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5, true);
		this.ctx.moveTo(px + (psizey/2), py);
		this.ctx.lineTo(px + psizex - (psizey/2), py);
		this.ctx.moveTo(px + (psizey/2), py + psizey);
		this.ctx.lineTo(px + psizex - (psizey/2), py + psizey);
		this.ctx.moveTo(px + psizex, py); //moves to beginning of circle drawing
		this.ctx.arc(px + psizex - (psizey/2), py + (psizey/2), psizey/2, Math.PI * 1.5, Math.PI * 0.5);
		this.ctx.stroke();

		return this;
	}

	drawBox(x, y, sizex, sizey) {
		this.ctx.fillRect(this.getX(x), this.getY(y), this.getX(sizex), this.getY(sizey));
		return this;
	}
	drawBoxBorder(x, y, sizex, sizey) {
		this.ctx.strokeRect(this.getX(x), this.getY(y), this.getX(sizex), this.getY(sizey));
		return this;
	}

	drawBoxSamesizeX(x, y, size) {
		this.ctx.fillRect(this.getX(x), this.getY(y), this.getX(size), this.getX(size));
		return this;
	}
	drawBoxSamesizeY(x, y, size) {
		this.ctx.fillRect(this.getX(x), this.getY(y), this.getY(size), this.getY(size));
		return this;
	}

	setColor(color) {
		this.ctx.fillStyle = color;
		return this;
	}
	getColor() {
		return this.ctx.fillStyle;
	}

	setBorder(color) {
		this.ctx.strokeStyle = color;
		return this;
	}
	setLineColor(color) {
		this.ctx.strokeStyle = color;
		return this;
	}

	setBrightness(brightness) {
		this.ctx.filter = "brightness("+brightness+"%)";
		return this;
	}
	resetBrightness() {
		this.ctx.filter = "brightness(100%)";
		return this;
	}
	getBrightness() {
		let str = String(this.ctx.filter);
		return Number(str.substring(str.indexOf('(') + 1, str.indexOf(')', str.indexOf('(')) - 1));
	}

	setAlpha(alpha) {
		this.ctx.globalAlpha = alpha;
		return this;
	}
	resetAlpha() {
		this.ctx.globalAlpha = 1;
		return this;
	}

	setFont(font, fontsize, weight = "normal") {
		this.fontFamily = font;
		this.fontSize = String(fontsize);
		this.fontWeight = weight;
		this.ctx.font = this.fontWeight+" "+this.fontSize+"px "+this.fontFamily;
		return this;
	}
	setFontFamily() {
		this.fontFamily = font;
		this.ctx.font = this.fontWeight+" "+this.fontSize+"px "+this.fontFamily;
		return this;
	}
	setFontSize(fontsize) {
		this.fontSize = String(fontsize);
		this.ctx.font = this.fontWeight+" "+this.fontSize+"px "+this.fontFamily;
		return this;
	}
	setFontWeight(weight) {
		this.fontWeight = weight;
		this.ctx.font = this.fontWeight+" "+this.fontSize+"px "+this.fontFamily;
		return this;
	}
	setVerySmallFontSize() {
		this.setFontSize(this.fontSizeSmall/2);
		return this;
	}
	setSmallFontSize() {
		this.setFontSize(this.fontSizeSmall);
		return this;
	}
	setLargeFontSize() {
		this.setFontSize(this.fontSizeLarge);
		return this;
	}

	clear(clearcolor) {
		let temp = this.ctx.fillStyle;
		this.ctx.fillStyle = clearcolor;
		this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.fillStyle = temp;

		return this;
	}

	textS(text, x, y) {
		this.ctx.fillText(text, this.getX(x), this.getY(y));
		return this;
	}
	textBorderS(text, x, y) {
		this.ctx.strokeText(text, this.getX(x) - this.ctx.lineWidth, this.getY(y) - this.ctx.lineWidth);
		return this;
	}
	textAndBorderS(text, x, y) {
		this.ctx.strokeText(text, this.getX(x) - this.ctx.lineWidth, this.getY(y) - this.ctx.lineWidth);
		this.ctx.fillText(text, this.getX(x), this.getY(y));
		return this;
	}

	textM(text, x, y) {
		let px = this.getX(x);
		let py = this.getY(y);
		let lines = text.split('\n');
		let newlineyoffset = 0;
		let metrics = this.ctx.measureText(text);
		//lowest point from line + highest point from line
		let lineheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
		lineheight *= 1.5;
		for(let i = 0; i < lines.length; i++) {
			this.ctx.fillText(lines[i], px, py + newlineyoffset);
			newlineyoffset += lineheight;
		}
		return this;
	}
	textBorderM(text, x, y) {
		let px = this.getX(x);
		let py = this.getY(y);
		let lines = text.split('\n');
		let newlineyoffset = 0;
		let metrics = this.ctx.measureText(text);
		//lowest point from line + highest point from line
		let lineheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
		lineheight *= 1.5;
		for(let i = 0; i < lines.length; i++) {
			this.ctx.strokeText(lines[i], px, py + newlineyoffset);
			newlineyoffset += lineheight;
		}
		return this;
	}

	//typewriter function write letter by letter
	//pass promises as objects! (work kinda like C++ references)
	//{ promise: MyPromise }

	async typewriterS(text, x, y, skip = { promise: Promise.reject() }) {
		for(let i = 0; i < text.length; i++) {
			if(i % 3 == 0) { sfxPlay(11); }
			this.ctx.fillText(text.substring(0,i), canvas.getX(x), canvas.getY(y));
			await Promise.any([skip.promise, new Promise((resolve) => {
				window.setTimeout(() => {
					resolve();
				}, 50);
			})]);
		}
		sfxStop(11);
		return this;
	}
	async typewriterM(text, x, y, skip = { promise: Promise.reject() }) {
		let lines = text.split('\n');
		let newlineyoffset = 0;
		let metrics = this.ctx.measureText(text);
		let lineheight = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
		lineheight *= 1.5;

		for(let i = 0; i < lines.length; i++) {
			for(let j = 0; j < lines[i].length; j++) {
				if(j % 3 == 0) { sfxPlay(11); } //adjust volume!
				this.ctx.fillText(lines[i].substring(0,j), canvas.getX(x),  canvas.getY(y) + newlineyoffset);
				await Promise.any([skip.promise, new Promise((resolve) => {
					window.setTimeout(() => {
						resolve();
					}, 50);
				})]);
			}
			newlineyoffset += lineheight;
		}
		sfxStop(11);
		return this;
	}

	setLineWidth(width) {
		this.ctx.lineWidth = width;
		return this;
	}
	line(x1, y1, x2, y2) {
		this.ctx.beginPath();
		this.ctx.moveTo(this.getX(x1), this.getY(y1));
		this.ctx.lineTo(this.getX(x2), this.getY(y2));
		this.ctx.stroke();
		return this;
	}

	background(image) {
		this.ctx.drawImage(image, 0, 0, this.canvas.width, this.canvas.height);
		this.currentBGImage = image;
		return this;
	}

	image(image, x, y, scale) {
		this.ctx.drawImage(image, this.getX(x), this.getY(y), image.width * scale, image.height * scale);
		return this;
	}
	//draws part of image onto canvas (draws equivalent part)
	imageEquivalent(image, x, y, sizex, sizey) {
		this.ctx.drawImage(
			image,
			image.width*x/100, image.height*y/100, image.width*sizex/100, image.height*sizey/100,
			this.getX(x), this.getY(y), this.getX(sizex),  this.getY(sizey)
		);
		return this;
	}
	//draws whole image to a speicifed space on canvas
	imageDest(image, x, y, sizex, sizey) {
		this.ctx.drawImage(
			image,
			0, 0, image.width, image.height,
			this.getX(x), this.getY(y), this.getX(sizex), this.getY(sizey)
		);
		return this;
	}
	//draws square image to canvas
	imageSamesizeX(image, x, y, size) {
		this.ctx.drawImage(
			image,
			0, 0, image.width, image.height,
			this.getX(x), this.getY(y), this.getX(size), this.getX(size)
		);
		return this;
	}
	//draws square image to canvas
	imageSamesizeY(image, x, y, size) {
		this.ctx.drawImage(
			image,
			0, 0, image.width, image.height,
			this.getX(x), this.getY(y), this.getY(size), this.getY(size)
		);
		return this;
	}

	eraseBox(x, y, sizex, sizey) {
		this.ctx.clearRect(this.getX(x), this.getY(y), this.getX(sizex), this.getY(sizey));
		return this;
	}
	eraseCanvas() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		return this;
	}

	//pass UI as object with parameter ref
	//{ref:ui}
	async fadeOut(uiproxy) {
		let oldAnimationBlocked = uiproxy.ref.animationBlocked;
		let oldUIAnimationBlocked = uiproxy.ref.UIanimationBlocked;
		uiproxy.ref.animationBlocked = true;
		uiproxy.ref.UIanimationBlocked = true;

		let savedcvs = await loadImage(canvas.canvas.toDataURL("image/png", 1)); //very useful!!!1!!!111!!
		while(this.getBrightness() > 5) {
			await new Promise((resolve) => {
				window.setTimeout(() => {
					this.setBrightness(this.getBrightness() - 10);
					this.background(savedcvs);
					document.querySelectorAll(".overlay").forEach((val) => {
						val.style.filter = "brightness("+(this.getBrightness() - 5)+"%)";
					});
					resolve();
				}, 50);
			});
		}
		this.resetBrightness();
		document.querySelectorAll(".overlay").forEach((val) => {
			val.style.filter = "";
		});

		uiproxy.ref.animationBlocked = oldAnimationBlocked;
		uiproxy.ref.UIanimationBlocked = oldUIAnimationBlocked;
		return this;
	}

	loadingScreen(messageoverride) {
		this.clear("purple");
		this.setColor("#ffffff");
		this.setLargeFontSize();
		this.textS(((messageoverride == null) ? getTranslation(0) : messageoverride), 10, 10);
		this.setSmallFontSize();
		return this;
	}
	loadingItemDone(place) {
		let message;
		switch(place) {
			case(0): message = "Translations"; break;
			case(1): message = "Music"; break;
			case(2): message = "SFX"; break;
			case(3): message = "Voice"; break;
			case(4): message = "Characters"; break;
		}

		this.textS(message+" done", 10, 15 + (place * 5));
		return this;
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
