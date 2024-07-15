function initWebpage() {
	canvas = new CanvasImplementation();

	document.addEventListener("fullscreenchange", () => {
		if(document.fullscreenElement != null) {
			console.log("fullscreen on");
			canvas.resize(window.screen.width, window.screen.height);
		}
		else {
			console.log("fullscreen off");
			cavnas.resize(1000, 500);
		}
	});

	//begin game
	gameHandler();
}

//canvas resize functions

async function canvasResizeTo(x, y) {
	console.log("resize to", x, y);

	//save state
	//window.open(canvas.canvas.toDataURL("image/png", 1)); //debug
	let savedcvs = await loadImage(canvas.canvas.canvas.toDataURL("image/png", 1)); //very useful!!!1!!!111!!
	let oldscaleX = canvas.getScaleX();
	let oldscaleY = canvas.getScaleY();


	//change vars
	let oldfill = canvas.canvas.ctx.fillStyle;
	let cvselem = document.getElementById("draw");
	cvselem.width = x;
	cvselem.height = y;
	canvas.canvas.ctx.width = x;
	canvas.canvas.ctx.height = y;
	canvas.canvas.ctx.fillStyle = oldfill;
	
	let cvsb = document.getElementById("draw_buffer");
	cvsb.style.setProperty("width", x+"px");
	cvsb.style.setProperty("height", y+"px");

	//resize buttons and arrows

	getAllInput().forEach((val) => {
		val.style.setProperty("top",    parseFloat(val.style.getPropertyValue("top"))   *canvas.getScaleX()/oldscaleY+"px");
		val.style.setProperty("left",   parseFloat(val.style.getPropertyValue("left"))  *canvas.getScaleX()/oldscaleX+"px");
		val.style.setProperty("width",  parseFloat(val.style.getPropertyValue("width")) *canvas.getScaleX()/oldscaleX+"px");
		val.style.setProperty("height", parseFloat(val.style.getPropertyValue("height"))*canvas.getScaleY()/oldscaleY+"px");

		val.style.setProperty("font-size", parseFloat(val.style.getPropertyValue("font-size"))*canvas.getScaleX(canvas)/oldscaleX+"px");
	});
	
	canvas.updateValues();

	canvas.background(savedcvs);
}

function canvasFullscreen() {
	console.log("fullscreen resize");
	document.getElementById("draw_contain").requestFullscreen("hide");
}  
