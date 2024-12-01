import SteamUser = require('steam-user');
import SteamCommunity = require('steamcommunity');
import AccountConfig from "../Interfaces/AccountConfig";
import { SteamID64 } from "../Interfaces/SteamID";
import SteamRelationship from "../Steam/Relationship";

export default function Account(accountConfig: AccountConfig){

    var client = new SteamUser();
    //var community = new SteamCommunity(); -> unused for now

    let logOnOptions = {
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
    client.on('friendRelationship', (steamID: any, relationship: any) => {
        if(relationship == 2){
            client.addFriend(steamID);
            client.chat.sendFriendMessage(steamID, `/me Thanks for adding me! Don't disrupt me, I'm playing Spectre Divide!`);
        }
    });
}