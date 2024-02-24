let creditsDelay = 2500; //in milliseconds
let creditsCounter = 0;
let creditsImg;

function setCreditsStep(fn) {
	setTimeout(() => {
		console.log("setCreditsStep callback: Next credits step!");
		canvasImageD(creditsImg, 0, 0, canvas.width, canvas.height);
		fn.call();
	}, creditsDelay * creditsCounter);
	creditsCounter++;
}

async function renderCredits() {
	creditsImg = await loadImage("assets/photo/katowice/credits.jpg");

	addButton("creditsskip", "Skip credits", canvasX(80), canvasY(0), canvasX(20), canvasY(10), () => { window.location.reload(); });

	//credits

	setCreditsStep(() => {
		canvasSetFontSize(48);
		
		canvasSetFontSize(20);
	});
	setCreditsStep(() => {
		canvasSetFontSize(48);

		canvasSetFontSize(20);
	});
	setCreditsStep(() => {
		canvasSetFontSize(48);

		canvasSetFontSize(20);
	});
	setCreditsStep(() => {
		window.location.reload();
	});
}