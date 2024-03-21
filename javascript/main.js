function initWebpage() {
	canvasInit();
	
	document.addEventListener("fullscreenchange", () => {
		if(document.fullscreenElement != null) {
			console.log("fullscreen on");
			canvasResizeTo(window.screen.width, window.screen.height);
		}
		else {
			console.log("fullscreen off");
			canvasResizeTo(1000, 500);
		}
	});

	//begin game
	gameHandler();
}

//canvas resize functions

async function canvasResizeTo(x, y) {
	console.log("resize to", x, y);

	//save state
	//window.open(canvas.toDataURL("image/png", 1)); //debug
	let savedcvs = await loadImage(canvas.toDataURL("image/png", 1)); //very useful!!!1!!!111!!
	let oldscaleX = canvasGetScaleX();
	let oldscaleY = canvasGetScaleY();


	//change vars
	let oldfill = ctx.fillStyle;
	let cvselem = document.getElementById("draw");
	cvselem.width = x;
	cvselem.height = y;
	ctx.width = x;
	ctx.height = y;
	ctx.fillStyle = oldfill;
	
	let cvsb = document.getElementById("draw_buffer");
	cvsb.style.setProperty("width", x+"px");
	cvsb.style.setProperty("height", y+"px");

	//resize buttons and arrows

	getAllInput().forEach((val) => {
		val.style.setProperty("top",    parseFloat(val.style.getPropertyValue("top"))   *canvasGetScaleY()/oldscaleY+"px");
		val.style.setProperty("left",   parseFloat(val.style.getPropertyValue("left"))  *canvasGetScaleX()/oldscaleX+"px");
		val.style.setProperty("width",  parseFloat(val.style.getPropertyValue("width")) *canvasGetScaleX()/oldscaleX+"px");
		val.style.setProperty("height", parseFloat(val.style.getPropertyValue("height"))*canvasGetScaleY()/oldscaleY+"px");

		val.style.setProperty("font-size", parseFloat(val.style.getPropertyValue("font-size"))*canvasGetScaleX()/oldscaleX+"px");
	});
	
	canvasSet();

	canvasBackground(savedcvs);
}

function canvasFullscreen() {
	console.log("fullscreen resize");
	document.getElementById("draw_contain").requestFullscreen("hide");
}  