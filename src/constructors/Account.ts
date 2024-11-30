import imports from "../imports";
import AccountConfig from "../Interfaces/AccountConfig";
import logOnOptions from "../Interfaces/logOnOptions";
import SteamID64 from "../Interfaces/SteamID";
import SteamRelationship from "../Steam/Relationship";

export default function Account(accountConfig: AccountConfig){

    var client = new imports.SteamUser();
    var community = new imports.SteamCommunity();

    let logOnOptions: logOnOptions = {
        accountName: accountConfig.login,
        password: accountConfig.password,
        rememberPassword: accountConfig.rememberPassword,
        machineName: accountConfig.machineName,
        clientOS: accountConfig.clientOS,
        dontRememberMachine: accountConfig.dontRememberMachine
    };

    client.logOn(logOnOptions)

    client.on('loggedOn', () => {
        console.log(`Logged on as ${logOnOptions.accountName}!`);
        client.gamesPlayed(accountConfig.games)
        client.setPersona(accountConfig.persona);
    });

    client.on('error', (err: Error) => console.log(`New error occured on ${logOnOptions.accountName}! Error: ${err}`));
    client.on('friendRelationship', (steamID: SteamID64.ID, relationship: SteamRelationship["level"]) => {
        if(relationship == 2){
            client.addFriend(steamID);
            client.chat.sendFriendMessage(steamID, `/me Thanks for adding me! Don't disrupt me, I'm playing Spectre Divide!`);
        }
    });
}