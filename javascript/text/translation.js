async function loadTranslation() {
	const promise = new Promise((resolve) => {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "javascript/text/translation.csv", true);

		xhr.onload = () => {
			let text = xhr.response;
			console.log("Translation file:\n"+xhr.response);
			text = text.replaceAll('\r', ''); //remove opposition
			let lineText = text.split('\n'); //divide and conquer
			for(let i = 0; i < lineText.length; i++) {
				let splitText = lineText[i].split(';');
				if(splitText.length == 0) { continue; }
				for(let j = 0; j < splitText.length; j++) {
					translations[j].push(splitText[j]);
				}
			}

			resolve();
		};

		xhr.send(null);
	});

    await promise; return;
}

function getTranslation(id) {
	return translations[translationSelected][id];
}

function getVoiceTranslation(id) {
	return voice[translationSelected][id];
}

function wrapText(str, maxwidth) {
	let splitstr = str.split(' '); //split to words
	let tempstr = "";
	let textWidth = 0;

	for(let i = 0; i < splitstr.length; i++) {
		textWidth += ctx.measureText(splitstr[i] + ' ').width;

		if(textWidth > canvasX(maxwidth)) {
			tempstr += '\n';
			textWidth = 0;
		}
		else {
			tempstr += splitstr[i];
			tempstr += ' ';
		}
	}

	return tempstr;
}