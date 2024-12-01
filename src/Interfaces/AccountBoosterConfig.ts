export default interface AccountBoosterConfig {
    machineName: string,
    discord: {
        enabled: boolean,
        webhookChannel: string | null,
        webhookID: string | null
    }
}