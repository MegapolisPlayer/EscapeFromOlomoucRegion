function errorHandle(message) {
	canvasClear("#800000");
	canvasSetColor("#ffffff");
	canvasTextM(":(\nAn error occured somewhere\n"+message, canvasX(10), canvasY(10));
	console.error("Error: "+message);
}