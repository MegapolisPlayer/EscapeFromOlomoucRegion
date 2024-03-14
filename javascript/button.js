function internal_setButton(id, text, classname, x, y, sizex, sizey, fn) {
	let btn = document.createElement("button");
	btn.id = id;
	btn.innerHTML = text;
	btn.className = classname;
	btn.style.setProperty("width", sizex+"px");
	btn.style.setProperty("height", sizey+"px");
	btn.style.setProperty("left", x+"px");
	btn.style.setProperty("top", y+"px");
	btn.addEventListener("click", fn);
	btn.addEventListener("click", () => { sfxPlay(0); })
	document.getElementById("draw_contain").appendChild(btn);
	return btn;
}

//returns said button
function addButton(id, text, x, y, sizex, sizey, fn) {
	return internal_setButton(id, text, "draw_input_elem", canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey), fn);
}
function addSmallButton(id, text, x, y, sizex, sizey, fn) {
	return internal_setButton(id, text, "draw_input_elem_small", canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey), fn);
}
function removeButton(id) {
	document.getElementById(id).remove();
}

function showButton(id) {
	document.getElementById(id).style.setProperty("display", "block");
}
function hideButton(id) {
	document.getElementById(id).style.setProperty("display", "none");
}

function ArrowInfo(x, y, type, fn) {
	this.x = x;
	this.y = y;
	this.type = type;
	this.fn = fn;
}

function SavedArrowInfo(id, x, y, type, fn) {
	this.id = id;
	this.x = x;
	this.y = y;
	this.type = type;
	this.fn = fn;
}

async function loadArrows() {
	arrowImages.push(await loadImage("assets/arrow/left.png"));
	arrowImages.push(await loadImage("assets/arrow/right.png"));
	arrowImages.push(await loadImage("assets/arrow/top.png"));
	arrowImages.push(await loadImage("assets/arrow/bottom.png"));
	arrowImages.push(await loadImage("assets/arrow/info.png"));

	arrowImages2.push(await loadImage("assets/arrow/left2.png"));
	arrowImages2.push(await loadImage("assets/arrow/right2.png"));
	arrowImages2.push(await loadImage("assets/arrow/top2.png"));
	arrowImages2.push(await loadImage("assets/arrow/bottom2.png"));
	arrowImages2.push(await loadImage("assets/arrow/info2.png"));
}

function setArrowInterval() {
	arrowAnimationInterval = window.setInterval(() => {
		if(animationBlocked) return;

		for(let i = 0; i < arrowList.length; i++) {
			ctx.drawImage(
				(arrowAnimationState == false) ? arrowImages2[arrowList[i].type] : arrowImages[arrowList[i].type],
				canvasX(arrowList[i].x) - (arrowSize/2*canvasGetScale()),
				canvasY(arrowList[i].y) - (arrowSize/2*canvasGetScale()), 
				arrowSize*canvasGetScale(), arrowSize*canvasGetScale()
			);
		}
		arrowAnimationState = !arrowAnimationState;
	}, arrowAnimationIntervalTime);
}

function addArrow(id, x, y, type, fn) {
	ctx.drawImage(arrowImages[type], canvasX(x) - (arrowSize/2*canvasGetScale()), canvasY(y) - (arrowSize/2*canvasGetScale()), arrowSize*canvasGetScale(), arrowSize*canvasGetScale());
	arrowList.push(new SavedArrowInfo(id, x, y, type, fn));
	return internal_setButton(
		id, "", "draw_input_elem_arrow", canvasX(x) - (arrowSize/2*canvasGetScale()), canvasY(y) - (arrowSize/2*canvasGetScale()),
		arrowSize*canvasGetScale(), arrowSize*canvasGetScale(), fn
	);
}
function removeArrow(id) {
	removeButton(id);
	for(let i = 0; i < arrowList.length; i++) {
		if(arrowList[i].id == id) {
			arrowList[i].splice(i, 1);
		}
	}
}
function clearArrows() {
	document.getElementById("draw_contain").querySelectorAll(".draw_input_elem_arrow").forEach((val) => {
		val.remove();
	});
	arrowList.length = 0;
}

//takes in array of ArrowInfos
function renderArrows(arrows) {
	let tempPromises = [];
	for(let i = 0; i < arrows.length; i++) {
		tempPromises.push(waiterEventFromElement(addArrow("renderArrows"+String(i), arrows[i].x, arrows[i].y, arrows[i].type, () => { arrows[i].fn.call(); clearArrows(); }), "click"));
	}
	return Promise.any(tempPromises);
}