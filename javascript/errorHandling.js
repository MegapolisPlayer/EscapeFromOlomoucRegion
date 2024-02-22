function errorHandle(message) {
	canvasClear("#800000");
	canvasSetColor("#ffffff");
	canvasTextM(":(\nAn error occured somewhere\n"+message, 100, 100);
	console.error("Error: "+message);
}