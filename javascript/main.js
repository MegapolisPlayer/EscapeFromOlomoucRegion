var canvas; //we do actually need var here
var ui; //we do actually need var here

function initWebpage() {
	canvas = new CanvasImplementation();
	ui = new UIImplementation();

	document.addEventListener("fullscreenchange", () => {
		if(document.fullscreenElement != null) {
			console.log("fullscreen on");
			resizeAllCanvases(window.screen.width, window.screen.height);
		}
		else {
			console.log("fullscreen off");
			resizeAllCanvases(1000, 500);
		}
	});

	//begin game
	gameHandler();
}

function canvasFullscreen() {
	console.log("fullscreen resize");
	document.getElementById("draw_contain").requestFullscreen("hide");
}  

async function resizeAllCanvases(x, y) {
	let oldscaleX = canvas.getScaleX();
	let oldscaleY = canvas.getScaleY();

	await canvas.resize(x, y);
	await ui.canvas.resize(x, y);

	//resize buffer
	let buffer = document.getElementById("draw_buffer");
	buffer.style.setProperty("width", x+"px");
	buffer.style.setProperty("height", y+"px");

	//resize buttons and arrows incl. pause

	document.querySelectorAll("#draw_contain > button").forEach((val) => {
		val.style.setProperty("top",   (parseFloat(val.style.getPropertyValue("top"))    *(canvas.getScaleY()/oldscaleY))+"px");
		val.style.setProperty("left",  (parseFloat(val.style.getPropertyValue("left"))   *(canvas.getScaleX()/oldscaleX))+"px");
		val.style.setProperty("width",  (parseFloat(val.style.getPropertyValue("width")) *(canvas.getScaleX()/oldscaleX))+"px");
		val.style.setProperty("height", (parseFloat(val.style.getPropertyValue("height"))*(canvas.getScaleY()/oldscaleY))+"px");

		val.style.setProperty("font-size", parseFloat(val.style.getPropertyValue("font-size"))*canvas.getScaleX()/oldscaleX+"px");
	});

	//resize pause

	let savedpausecvs = await loadImage(ui.pauseCanvasElement.toDataURL("image/png", 1)); //very useful!!!1!!!111!!
	ui.pauseCanvasElement.style.setProperty("top", ui.canvas.canvas.height*0.1+"px");
	ui.pauseCanvasElement.style.setProperty("left", ui.canvas.canvas.width*0.1+"px");
	ui.pauseCanvasElement.width = ui.canvas.canvas.width*0.8;
	ui.pauseCanvasElement.height = ui.canvas.canvas.height*0.8;
	ui.pauseCanvasElement.style.setProperty("width", ui.pauseCanvasElement.width+"px");
	ui.pauseCanvasElement.style.setProperty("height", ui.pauseCanvasElement.height+"px");
	ui.pauseContext.width = ui.pauseCanvasElement.width;
	ui.pauseContext.height = ui.pauseCanvasElement.height;
	ui.pauseCanvas.background(savedpausecvs);
}
