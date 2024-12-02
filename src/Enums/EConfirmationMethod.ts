export default (ID: number) => {
	switch(ID){
        case 0: return "None";
	    case 1: return "Email";
	    case 2: return "MobileApp";
        default: return "Couldn't resolve EConfirmationMethod!";
    }
}