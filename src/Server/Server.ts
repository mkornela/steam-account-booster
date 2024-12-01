import express = require('express');
import accountRouter from '../Constructors/AccountManager';
import Logger from '../Components/Logger';

const LOG_MODULE = `API_SERVER`;
const PORT = 3000;

export default function Server(this: any){

    this.app = express();

    this.app.use(express.json());
    this.app.use('/api', accountRouter);

    this.app.listen(PORT, () => Logger(`Server running on http://localhost:${PORT}`, LOG_MODULE, `${this.app.listen.name}()`, 'success'));
};