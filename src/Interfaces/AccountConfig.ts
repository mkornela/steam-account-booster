export default interface AccountConfig {
    //Login details
    login: string,
    password: string,
    mail?: object,
    maFileData?: object,
    rememberPassword: boolean,
    machineName: string,
    clientOS: number,
    dontRememberMachine: boolean,

    //Game and profile details
    games: Array<number>,
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