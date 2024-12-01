import SteamUser = require('steam-user');
import SteamCommunity = require('steamcommunity');
import TradeOfferManager = require('steam-tradeoffer-manager');
import AccountConfig from "../Interfaces/AccountConfig";
import Logger from "../Components/Logger";
import EPersonaState from "../Enums/EPersonaState";
import EFriendRelationship from "../Enums/EFriendRelationship";

export default function Account(this: any, accountConfig: AccountConfig){

    this.farmingCards = false;
    this.farmingHours = true;

    this.client = new SteamUser();
    this.community = new SteamCommunity();
    this.tradeOfferManager = new TradeOfferManager({
        community: this.community,
        language: 'en',
        pollInterval: 10000
    });

    let logOnOptions = {
        accountName: accountConfig.login,
        password: accountConfig.password,
        rememberPassword: accountConfig.rememberPassword,
        machineName: accountConfig.machineName,
        clientOS: accountConfig.clientOS,
        dontRememberMachine: accountConfig.dontRememberMachine
    };

    Logger(`Account ${logOnOptions.accountName} initiated.`, Account.name, 'info');

    try { this.client.logOn(logOnOptions);
    } catch(error) { Logger(`Account ${logOnOptions.accountName} could not log in! Error: ${error}`, Account.name, 'error'); };

    this.client.on('webSession', (sessionID: string, cookies: any) => {
        Logger(`Account ${logOnOptions.accountName} session ID secured.`, Account.name, 'success');
        this.cookies = cookies;
        if(accountConfig.steam.parentalPin) {
            this.community.setCookies(this.cookies, accountConfig.steam.parentalPin, (success: null | Error) => {
                if(!success) return Logger(`Account ${logOnOptions.accountName} cookies were not set properly.`, Account.name, 'error');
                return Logger(`Account ${logOnOptions.accountName} cookies were set properly.`, Account.name, 'success');
            })
        } else {
            this.community.setCookies(this.cookies, (success: null | Error) => {
                if(!success) return Logger(`Account ${logOnOptions.accountName} cookies were not set properly.`, Account.name, 'error');
                return Logger(`Account ${logOnOptions.accountName} cookies were set properly.`, Account.name, 'success');
            })
        }
    });

    this.client.on('loggedOn', () => {
        Logger(`Account ${logOnOptions.accountName} logged in.`, Account.name, 'success');
        if(accountConfig.steam.parentalPin){
            this.tradeOfferManager.parentalUnlock(accountConfig.steam.parentalPin, (success: null | Error) => {
                if(!success) return Logger(`Account ${logOnOptions.accountName} parental pin unlock did not succed! Error: ${success}`, Account.name, 'error');
                return Logger(`Account ${logOnOptions.accountName} parental pin unlock completed successfully.`, Account.name, 'success');
            });
        }
        if(!this.farmingHours) return;
        try {
            this.client.gamesPlayed(accountConfig.games);
            Logger(`Account ${logOnOptions.accountName} set to play ${accountConfig.games.length} games.`, Account.name, 'success');
            this.client.setPersona(accountConfig.persona);
            Logger(`Account ${logOnOptions.accountName} set to ${EPersonaState(accountConfig.persona)}.`, Account.name, 'success');
        } catch(error) {
            Logger(`Account ${logOnOptions.accountName} farming couldn't start! Error: ${error}`, Account.name, 'error');
        }
    });

    this.client.on('error', (error: Error) => {
        Logger(`New error occured on ${logOnOptions.accountName}! Error: ${error}`, Account.name, 'error');
    });

    this.client.on('friendRelationship', (steamID: any, relationship: any) => {
        let rel = EFriendRelationship(relationship);
        if(rel != "RequestRecipient") return; if(!accountConfig.steam.autoAcceptFriendRequests) return;
        this.client.addFriend(steamID);
        this.client.chat.sendFriendMessage(steamID, `${accountConfig.steam.messagePrefixes.bot} ${accountConfig.steam.responses.friendAccepted}`);
    });

    this.control = {
        restart: () => {
            try { this.client.relog();
            } catch(error) { return Logger(`Account ${logOnOptions.accountName} couldn't be restarted! Error: ${error}`, Account.name, 'error'); };
        },
        changeFarming: (mode: string, change: boolean) => { //changeFarming('hours', true) -> start farming hours
            let before = this.farmingHours;
            switch(mode){
                case 'hours':
                    if(this.farmingHours == change) return Logger(
                        `Account ${logOnOptions.accountName} farming status change was not successful! Error: farmingHours is already ${change ? 'ON' : 'OFF'}`,
                        Account.name,
                        'error'
                    );
                    this.farmingHours = change;
                    this.control.restart();
                    break;
                case 'cards':
                    if(this.farmingCards == change) return Logger(
                        `Account ${logOnOptions.accountName} farming status change was not successful! Error: farmingCards is already ${change ? 'ON' : 'OFF'}`,
                        Account.name,
                        'error'
                    );
                    this.farmingCards = change;
                    this.control.restart();
                    break;
                default:
                    return Logger(
                        `Account ${logOnOptions.accountName} farming status change was not successful!`,
                        Account.name,
                        'error'
                    );
            }
            Logger(
                `Account ${logOnOptions.accountName} farming status changed for ${mode} from ${before ? 'ON' : 'OFF'} to ${change ? 'ON' : 'OFF'}`,
                Account.name,
                'success'
            );
        },
        retrieveTradeOffers: () => {
            
        },
    }

};