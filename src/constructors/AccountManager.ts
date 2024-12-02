import { Request, Response } from 'express';
import express = require('express');

const ACCOUNTS: Array<any> = [];
const accountRouter = express.Router();

import { promises as fs } from 'fs';
import path = require('path');
import Logger from '../Components/Logger';
import Account from './Account';

(async () => {
    const configsDir = path.join(__dirname, '../Configs');
    let accountConfigs: any[] = [];

    try {
        const files = await fs.readdir(configsDir);
        const accountFiles = files.filter(file => /^7.*\.js$/.test(file));

        for (const file of accountFiles) {
            const filePath = path.join(configsDir, file);
            const module = await import(filePath);

            if (module?.config) {
                Logger(`Loaded ${module.config.login} account!`, 'ACC_MANAGER', `AccountManager()`, 'success');
                accountConfigs.push(module.config);
            } else {
                Logger(`Error loading account configurations! Error: File ${file} does not export a "config" object.`, 'ACC_MANAGER', `AccountManager()`, 'error');
            }
        }

        Logger(`Loaded ${accountConfigs.length} accounts!`, 'ACC_MANAGER', `AccountManager()`, 'success');
    } catch (error) { Logger(`Error loading accounts configurations! Error: ${error}`, 'ACC_MANAGER', `AccountManager()`, 'error'); };

    try {
        const files = await fs.readdir(configsDir);
        const accountFiles = files.filter(file => /^7.*\.js$/.test(file));

        for (const accountConfig of accountConfigs) {
            let account = new Account(accountConfig);
            ACCOUNTS.push(account);
        }

    } catch (error) { Logger(`Error logging in onto the accounts! Error: ${error}`, 'ACC_MANAGER', `AccountManager()`, 'error'); };

})();

accountRouter.get('/accounts', (req: Request, res: Response) => { res.json(ACCOUNTS) });

accountRouter.post('/start-farming/:type/:id', (req: Request, res: Response) => {
    const { type, id } = req.params;
    const account = ACCOUNTS.find(acc => acc.id === id);
    if (account) {
        account.changeFarming(type, true);
        res.json({ message: `Started farming for account ${id}` });
    } else {
        res.status(404).json({ error: 'Account not found' });
    }
});

accountRouter.post('/stop-farming/:type/:id', (req: Request, res: Response) => {
    const { type, id } = req.params;
    const account = ACCOUNTS.find(acc => acc.id === id);
    if (account) {
        account.changeFarming(type, false);
        res.json({ message: `Stopped farming for account ${id}` });
    } else {
        res.status(404).json({ error: 'Account not found' });
    }
});

export default accountRouter;