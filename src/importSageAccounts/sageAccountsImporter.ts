import * as fs from 'fs';
import * as path from 'path';

// Load the JSON file
const accounts = JSON.parse(fs.readFileSync('./sageAccounts.json', 'utf-8'));

// Iterate through each account and generate a TypeScript file
accounts.forEach((account: any, index: number) => {
    const configTemplate = `
import AccountConfig from "../src/Interfaces/AccountConfig"
import freeApps from "../src/Steam/freeApps"

export const config: Config = {
    login: "${account.user.username}",
    password: "${account.user.password}",
    steamID: ${account.id},
    mail: {
        address: "${account.email.address}",
        password: "${account.email.password}"
    },
    maFileData: {
        sharedSecret: "${account.steamguard.shared_secret}",
        identitySecret: "${account.steamguard.identity_secret}",
        secret1: "${account.steamguard.secret_1}",
        tokenGid: "${account.steamguard.token_gid}"
    },
    rememberPassword: true,
    machineName: "deeM's Hours",
    clientOS: 16,
    dontRememberMachine: false,

    // Game and profile details
    games: freeApps,
    persona: 1,
    autoAcceptFriendRequests: true
};`;

    // Define the file path and write the content
    const filePath = path.join(__dirname, `${account.id}.ts`);
    fs.writeFileSync(filePath, configTemplate.trim(), 'utf-8');
    console.log(`Created: ${filePath}`);
});