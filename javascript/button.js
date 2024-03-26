function waiterEventFromElement(element, event) {
	//in promise: first arg resolve, then reject
	return new Promise((resolve) => {
	  const listener = () => {
		element.removeEventListener(event, listener); resolve();
	  }
	  element.addEventListener(event, listener);
	})
}

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
	btn.addEventListener("click", () => { 
		if(settings.music_enabled) { sfxPlay(0); }
	})
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
function addVerySmallButton(id, text, x, y, sizex, sizey, fn) {
	return internal_setButton(id, text, "draw_input_elem_vsmall", canvasX(x), canvasY(y), canvasX(sizex), canvasY(sizey), fn);
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

	arrowAnimationInterval = window.setInterval(() => {
		if(animationBlocked) return;

		for(let i = 0; i < arrowList.length; i++) {
			if(document.getElementById(arrowList[i].id).style.getPropertyValue("display") === "none") continue;

			ctx.drawImage(
				(arrowAnimationState == false) ? arrowImages2[arrowList[i].type] : arrowImages[arrowList[i].type],
				canvasX(arrowList[i].x) - (arrowSize/2*canvasGetScaleX()),
				canvasY(arrowList[i].y) - (arrowSize/2*canvasGetScaleY()), 
				arrowSize*canvasGetScaleX(), arrowSize*canvasGetScaleX()
			);
		}
		arrowAnimationState = !arrowAnimationState;
	}, arrowAnimationIntervalTime);
}

function addArrow(id, x, y, type, fn) {
	ctx.drawImage(arrowImages[type], canvasX(x) - (arrowSize/2*canvasGetScaleX()), canvasY(y) - (arrowSize/2*canvasGetScaleY()), arrowSize*canvasGetScaleX(), arrowSize*canvasGetScaleX());
	arrowList.push(new SavedArrowInfo(id, x, y, type, fn));
	return internal_setButton(
		id, "", "draw_input_elem_arrow", canvasX(x) - (arrowSize/2*canvasGetScaleX()), canvasY(y) - (arrowSize/2*canvasGetScaleY()),
		arrowSize*canvasGetScaleX(), arrowSize*canvasGetScaleX(), fn
	);
}
function removeArrow(id) {
	removeButton(id);
	for(let i = 0; i < arrowList.length; i++) {
		if(arrowList[i].id == id) {
			console.log("Removed arrow no.", i);
			arrowList.splice(i, 1);
		}
	}
}
function clearArrows() {
	document.getElementById("draw_contain").querySelectorAll(".draw_input_elem_arrow").forEach((val) => {
		val.remove();
	});
	arrowList.length = 0;
}

//takes in 1 ArrowInfo
function renderArrow(arrow) {
	let randomValue = String(Math.trunc(Math.random()*10000));
	return waiterEventFromElement(addArrow("renderArrow"+randomValue, arrow.x, arrow.y, arrow.type, () => { arrow.fn.call(); removeArrow("renderArrow"+randomValue); }), "click");
}
//takes in array of ArrowInfos
function renderArrows(arrows) {
	let tempPromises = [];
	for(let i = 0; i < arrows.length; i++) {
		tempPromises.push(waiterEventFromElement(addArrow("renderArrows"+String(i), arrows[i].x, arrows[i].y, arrows[i].type, () => { arrows[i].fn.call(); clearArrows(); }), "click"));
	}
	return Promise.any(tempPromises);
}

function getAllInput() {
	return document.getElementById("draw_contain")
			.querySelectorAll(
				".draw_input_elem, .draw_input_elem_arrow, .draw_input_elem_small, .draw_input_elem_vsmall, .draw_input_elem_npc"
			);	 //no pause, it does not get deleted!
}
function hideAllInput() {
	getAllInput().forEach((val) => {
		val.style.setProperty("display", "none");
	});
}
function showAllInput() {
	getAllInput().forEach((val) => {
		val.style.setProperty("display", "block");
	});
}

//TODO: add function rerenderArrows()