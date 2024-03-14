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
	let oldscale = canvasGetScale();

	//change vars
	let cvselem = document.getElementById("draw");
	cvselem.width = x;
	cvselem.height = y;
	ctx.width = x;
	ctx.height = y;
	
	let cvsb = document.getElementById("draw_buffer");
	cvsb.style.setProperty("width", x+"px");
	cvsb.style.setProperty("height", y+"px");

	//resize buttons and arrows

	let cvsc = document.getElementById("draw_contain");
	let btns = cvsc.querySelectorAll(".draw_input_elem, .draw_input_elem_arrow");

	btns.forEach((val) => {
		val.style.setProperty("top",    parseFloat(val.style.getPropertyValue("top"))*canvasGetScale()/oldscale+"px");
		val.style.setProperty("left",   parseFloat(val.style.getPropertyValue("left"))*canvasGetScale()/oldscale+"px");
		val.style.setProperty("width",  parseFloat(val.style.getPropertyValue("width"))*canvasGetScale()/oldscale+"px");
		val.style.setProperty("height", parseFloat(val.style.getPropertyValue("height"))*canvasGetScale()/oldscale+"px");

		val.style.setProperty("font-size", parseFloat(val.style.getPropertyValue("font-size"))*canvasGetScale()/oldscale+"px");
	});
	
	canvasSet();

	canvasBackground(savedcvs);
}

function canvasFullscreen() {
	console.log("fullscreen resize");
	document.getElementById("draw_contain").requestFullscreen("hide");
}  