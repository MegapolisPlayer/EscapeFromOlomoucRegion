function minigameTicketsReset() {

}

async function minigameTicketsLoad() {

}

async function minigameTicketsMenu() {
	
}
async function minigameTicketsGame() {
	
}
async function minigameTicketsSummary() {
	
}

async function minigameTickets() {
	ui.animationBlocked = true;
	ui.arrowAnimationBlocked = true;
	ui.disableWidgets();

	await minigameTicketsLoad();
	await minigameTicketsMenu();
	await minigameTicketsGame();
	await minigameTicketsSummary();
	minigameTicketsReset();

	ui.animationBlocked = false;
	ui.arrowAnimationBlocked = false;
	ui.enableWidgets();
}
