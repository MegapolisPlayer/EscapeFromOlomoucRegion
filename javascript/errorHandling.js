function errorHandle(message) {
	canvasClear("#800000");
	canvasSetColor("#ffffff");
	canvasTextM(":(\nAn error occured somewhere\n"+message+"\nCheck the console for more information.\n", 10, 10);
	console.error("Error: "+message);
	console.error(console.trace());
}