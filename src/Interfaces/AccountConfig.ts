export default interface AccountConfig {
    //Login details
    login: string,
    password: string,
    steamID: string,
    mail?: object,
    maFileData?: {
        sharedSecret: string,
        identitySecret: string,
        secret1: string,
        tokenGid: string
    },
    rememberPassword: boolean,
    machineName: string,
    clientOS: number,
    dontRememberMachine: boolean,

    //Game and profile details
    games: Array<string | number>,
    persona: number,

    steam: {
        autoAcceptFriendRequests: boolean,
        messagePrefixes: {
            bot: string,
            user: string
        },
        responses: {
            friendAccepted: string
        },
        parentalPin: number | null
    }
}