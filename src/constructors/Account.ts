import SteamUser = require('steam-user');
import SteamCommunity = require('steamcommunity');
import TradeOfferManager = require('steam-tradeoffer-manager');
import SteamTotp = require('steam-totp');
import AccountConfig from "../Interfaces/AccountConfig";
import Logger from "../Components/Logger";
import EPersonaState from "../Enums/EPersonaState";
import EFriendRelationship from "../Enums/EFriendRelationship";
import ETradeOfferState from "../Enums/ETradeOfferState";
import EConfirmationMethod from "../Enums/EConfirmationMethod";

const LOG_MODULE = `ACCOUNT`;

export default class Account {
    private farmingCards: boolean = false;
    private farmingHours: boolean = true;

    private client: SteamUser;
    private community: SteamCommunity;
    private tradeOfferManager: TradeOfferManager;
    private cookies: any;

    private logOnOptions: any;

    constructor(private accountConfig: AccountConfig) {
        this.client = new SteamUser();
        this.community = new SteamCommunity();
        this.tradeOfferManager = new TradeOfferManager({
            community: this.community,
            language: 'en',
            pollInterval: 10000,
        });

        this.logOnOptions = {
            accountName: accountConfig.login,
            password: accountConfig.password,
            rememberPassword: accountConfig.rememberPassword,
            machineName: accountConfig.machineName,
            clientOS: accountConfig.clientOS,
            dontRememberMachine: accountConfig.dontRememberMachine
        };

        if (accountConfig.maFileData && accountConfig.maFileData.sharedSecret) {
            this.logOnOptions.twoFactorCode = SteamTotp.generateAuthCode(accountConfig.maFileData.sharedSecret);
            Logger(
                `Generated 2FA Code for ${accountConfig.login}: ${this.logOnOptions.twoFactorCode}`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'info'
            );
        } else {
            Logger(
                `Properties maFileData or sharedSecret is missing for account ${accountConfig.login}, guard input might be needed!`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'info'
            );
        }

        Logger(
            `Account ${this.logOnOptions.accountName} initiated.`,
            LOG_MODULE,
            `${this.constructor.name}()`,
            'info'
        );

        this.init();
    }

    private init() {
        try {
            this.client.logOn(this.logOnOptions);
        } catch (error) {
            Logger(
                `Account ${this.logOnOptions.accountName} could not log in! Error: ${error}`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'error'
            );
        }

        this.client.on('webSession', (sessionID: string, cookies: any) => {
            Logger(
                `We received webSession!`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'success'
            );
            this.handleWebSession(sessionID, cookies);
        });

        this.client.on('loggedOn', () => {
            this.handleLoggedOn();
        });

        this.client.on('error', (error: Error) => {
            Logger(
                `New error occurred on ${this.logOnOptions.accountName}! Error: ${error}`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'error'
            );
        });

        this.client.on('friendRelationship', (steamID: any, relationship: any) => {
            this.handleFriendRelationship(steamID, relationship);
        });

        this.tradeOfferManager.on('newOffer', (offer: any) => {
            this.handleSteamOffer(offer);
        });
    }

    private handleWebSession(sessionID: string, cookies: any) {
        Logger(
            `Account ${this.logOnOptions.accountName} session ID secured.`,
            LOG_MODULE,
            `${this.constructor.name}()`,
            'success'
        );

        this.cookies = cookies;

        const setCookiesCallback = (success: null | Error) => {
            if (!success) {
                return Logger(
                    `Account ${this.logOnOptions.accountName} cookies were not set properly.`,
                    LOG_MODULE,
                    `${this.constructor.name}()`,
                    'error'
                );
            }

            Logger(
                `Account ${this.logOnOptions.accountName} cookies were set properly.`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'success'
            );
        };

        this.community.setCookies(this.cookies);
        if(this.accountConfig.steam.parentalPin) this.tradeOfferManager.setCookies(this.cookies, `${this.accountConfig.steam.parentalPin}`, setCookiesCallback);
    }

    private handleLoggedOn() {
        Logger(
            `Account ${this.logOnOptions.accountName} logged in.`,
            LOG_MODULE,
            `${this.constructor.name}()`,
            'success'
        );

        if (this.accountConfig.steam.parentalPin) {
            this.tradeOfferManager.parentalUnlock(
                `${this.accountConfig.steam.parentalPin}`,
                (success: null | Error) => {
                    if (!success) {
                        return Logger(
                            `Account ${this.logOnOptions.accountName} parental pin unlock did not succeed! Error: ${success}`,
                            LOG_MODULE,
                            `${this.constructor.name}()`,
                            'error'
                        );
                    }

                    Logger(
                        `Account ${this.logOnOptions.accountName} parental pin unlock completed successfully.`,
                        LOG_MODULE,
                        `${this.constructor.name}()`,
                        'success'
                    );
                }
            );
        }

        if (!this.farmingHours) return;

        try {
            this.client.gamesPlayed(this.accountConfig.games);
            Logger(
                `Account ${this.logOnOptions.accountName} set to play ${this.accountConfig.games.length} games.`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'success'
            );

            this.client.setPersona(this.accountConfig.persona);
            Logger(
                `Account ${this.logOnOptions.accountName} set to ${EPersonaState(this.accountConfig.persona)}.`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'success'
            );
        } catch (error) {
            Logger(
                `Account ${this.logOnOptions.accountName} farming couldn't start! Error: ${error}`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'error'
            );
        }
    }

    private handleFriendRelationship(steamID: any, relationship: any) {
        const rel = EFriendRelationship(relationship);
        if (rel !== "RequestRecipient") return;
        if (!this.accountConfig.steam.autoAcceptFriendRequests) return;

        this.client.addFriend(steamID);
        this.client.chat.sendFriendMessage(
            steamID,
            `${this.accountConfig.steam.messagePrefixes.bot} ${this.accountConfig.steam.responses.friendAccepted}`
        );
    }

    private handleSteamOffer(offer: any) {
        console.log({
            offerID: offer.id,
            partnerID: offer.partner,
            message: offer.message,
            state: ETradeOfferState(offer.state),
            items: {
                give: offer.itemsToGive,
                get: offer.itemsToReceive
            },
            didWeSend: offer.isOurOffer,
            timestamps: {
                created: offer.created,
                updated: offer.updated,
                expire: offer.expire
            },
            tradeID: offer.tradeID ? offer.tradeID : null,
            confirmationMethod: EConfirmationMethod(offer.confirmationMethod),
            rawJson: offer.rawJson
        })
    }

    public restart() {
        try {
            this.client.relog();
        } catch (error) {
            Logger(
                `Account ${this.logOnOptions.accountName} couldn't be restarted! Error: ${error}`,
                LOG_MODULE,
                `${this.constructor.name}()`,
                'error'
            );
        }
    }

    public changeFarming(mode: string, change: boolean) {
        const before = this.farmingHours;

        switch (mode) {
            case 'hours':
                if (this.farmingHours === change) {
                    return Logger(
                        `Account ${this.logOnOptions.accountName} farming status change was not successful! Error: farmingHours is already ${change ? 'ON' : 'OFF'}`,
                        LOG_MODULE,
                        `${this.constructor.name}()`,
                        'error'
                    );
                }

                this.farmingHours = change;
                this.restart();
                break;

            case 'cards':
                if (this.farmingCards === change) {
                    return Logger(
                        `Account ${this.logOnOptions.accountName} farming status change was not successful! Error: farmingCards is already ${change ? 'ON' : 'OFF'}`,
                        LOG_MODULE,
                        `${this.constructor.name}()`,
                        'error'
                    );
                }

                this.farmingCards = change;
                this.restart();
                break;

            default:
                return Logger(
                    `Account ${this.logOnOptions.accountName} farming status change was not successful!`,
                    LOG_MODULE,
                    `${this.constructor.name}()`,
                    'error'
                );
        }

        Logger(
            `Account ${this.logOnOptions.accountName} farming status changed for ${mode} from ${before ? 'ON' : 'OFF'} to ${change ? 'ON' : 'OFF'}`,
            LOG_MODULE,
            `${this.constructor.name}()`,
            'success'
        );
    }

    public retrieveTradeOffers() {
        /** soon tba */
    }
}