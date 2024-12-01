import { Request, Response } from 'express';
import express = require('express');

const ACCOUNTS: Array<any> = [];
const accountRouter = express.Router();

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