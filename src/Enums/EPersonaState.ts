export default (ID: number) => {
	switch(ID){
        case 0: return "Offline";
	    case 1: return "Online";
	    case 2: return "Busy";
	    case 3: return "Away";
	    case 4: return "Snooze";
	    case 5: return "LookingToTrade";
	    case 6: return "LookingToPlay";
	    case 7: return "Invisible";
        default: return "Couldn't resolve EPersonaState!"
    }
}