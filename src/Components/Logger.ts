const colors = require('colors');
const moment = require('moment');
const { WebhookClient } = require('discord.js');
import { boosterConfig } from '../Configs/AccountBooster';

const webhookClient = new WebhookClient({ id: boosterConfig.discord.webhookChannel, token: boosterConfig.discord.webhookID });

export default (LOG_DATA: string, LOG_MODULE: string, LOG_FUNCTION: string, LOG_LEVEL: string) => {
    let DATE = moment().format('MM/DD/YYYY hh:mm:ss');

    switch(LOG_LEVEL.toLowerCase()){
        
        case 'success':
            console.log(`${colors.green.bold(DATE)} | ${colors.green.bold(LOG_MODULE)} | ${colors.green.bold(LOG_FUNCTION)} | ${colors.green.bold('SUCCESS')} | ${colors.green(LOG_DATA)}`);
            break;
            
        case 'error':
            console.log(`${colors.red.bold(DATE)} | ${colors.red.bold(LOG_MODULE)} | ${colors.red.bold(LOG_FUNCTION)} | ${colors.red.bold('  ERROR')} | ${colors.red(LOG_DATA)}`);
            break;

        case 'warning':
            console.log(`${colors.red.bold(DATE)} | ${colors.red.bold(LOG_MODULE)} | ${colors.red.bold(LOG_FUNCTION)} | ${colors.red.bold('WARNING')} | ${colors.red(LOG_DATA)}`);
            break;

        case 'info':
            console.log(`${colors.yellow.bold(DATE)} | ${colors.yellow.bold(LOG_MODULE)} | ${colors.yellow.bold(LOG_FUNCTION)} | ${colors.yellow.bold('   INFO')} | ${colors.yellow(LOG_DATA)}`);
            break;

        case 'system':
            console.log(`${colors.magenta.bold(DATE)} | ${colors.magenta.bold(LOG_MODULE)} | ${colors.magenta.bold(LOG_FUNCTION)} | ${colors.magenta.bold(' SYSTEM')} | ${colors.magenta(LOG_DATA)}`);
            break;

        default:
            console.log(`${colors.cyan.bold(DATE)} | ${colors.cyan.bold(LOG_MODULE)} | ${colors.cyan(LOG_FUNCTION).bold} | ${colors.cyan.bold('DEFAULT')} | ${colors.cyan(LOG_DATA)}`);
    }

    if(!boosterConfig.discord.enabled) return;
    webhookClient.send({
        content: `<t:${moment().format('X')}:R> ${LOG_DATA}`,
        username: 'Steam Account Booster',
        avatarURL: 'https://cdn.icon-icons.com/icons2/2428/PNG/512/steam_black_logo_icon_147078.png'
    });

}