export default interface AccountConfig {
    //Login details
    login: string,
    password: string,
    rememberPassword: boolean,
    machineName: string,
    clientOS: Number,
    dontRememberMachine: boolean,

    //Game and profile details
    games: Array<Number>,
    persona: Number,
    autoAcceptFriendRequests: boolean
}