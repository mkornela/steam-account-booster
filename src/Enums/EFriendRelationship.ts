export default (ID: number) => {
	switch(ID){
        case 0: return "None";
		case 1: return "Blocked";
		case 2: return "RequestRecipient";
		case 3: return "Friend";
		case 4: return "RequestInitiator";
		case 5: return "Ignored";
		case 6: return "IgnoredFriend";
		case 7: return "SuggestedFriend";
		default: return "Couldn't resolve EFriendRelationship!";
    }
}