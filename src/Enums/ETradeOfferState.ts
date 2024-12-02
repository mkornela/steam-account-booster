export default (ID: number) => {
	switch(ID){
        case 1: return "Invalid";
	    case 2: return "Active";
	    case 3: return "Accepted";
	    case 4: return "Countered";
	    case 5: return "Expired";
	    case 6: return "Canceled";
	    case 7: return "Declined";
	    case 8: return "InvalidItems";
	    case 9: return "CreatedNeedsConfirmation";
	    case 10: return "CanceledBySecondFactor";
	    case 11: return "InEscrow";
        default: return "Couldn't resolve ETradeOfferState!";
    }
}