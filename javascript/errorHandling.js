function errorHandle(message) {
	canvasClear("#800000");
	canvasSetColor("#ffffff");
	canvasTextM(":(\nAn error occured somewhere\n"+message, 10, 10);
	console.error("Error: "+message);
}