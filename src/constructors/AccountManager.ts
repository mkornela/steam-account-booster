import { Request, Response } from 'express';
import express = require('express');

const ACCOUNTS = [
    { id: '1', username: 'user1', status: 'Online', farming: true, guardCode: 'ABC123' },
    { id: '2', username: 'user2', status: 'Offline', farming: false, guardCode: null }
];

// Tworzymy router Expressa
const accountRouter = express.Router();

// account list enpoint
accountRouter.get('/accounts', (req: Request, res: Response) => { res.json(ACCOUNTS) });

// start farming endpoint
accountRouter.post('/start-farming/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const account = ACCOUNTS.find(acc => acc.id === id);
    if (account) {
        account.farming = true;
        res.json({ message: `Started farming for account ${id}` });
    } else {
        res.status(404).json({ error: 'Account not found' });
    }
});

// stop farming endpoint
accountRouter.post('/stop-farming/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const account = ACCOUNTS.find(acc => acc.id === id);
    if (account) {
        account.farming = false;
        res.json({ message: `Stopped farming for account ${id}` });
    } else {
        res.status(404).json({ error: 'Account not found' });
    }
});

export default accountRouter;