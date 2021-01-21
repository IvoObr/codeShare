import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import express, { Request, Response } from 'express';
import * as core from "express-serve-static-core";
import cors from 'cors';
import bodyParser from 'body-parser';
import 'express-async-errors';
import BaseRouter from './routes';
import logger from '@logger';
import { xAuth } from '@constants';

class Server {

    public app: core.Express; 

    private readonly staticDir: string = path.join(__dirname, 'public');

    constructor() {
        this.app = express();
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(express.static(this.staticDir));
        this.app.use(cors({ origin: `http://localhost`, exposedHeaders: [xAuth] }));
    
        /* Show routes called in console during development */
        process.env.NODE_ENV === 'development' && this.app.use(morgan('dev'));
        /* Security */
        process.env.NODE_ENV === 'production' && this.app.use(helmet());
        /* Add APIs */
        this.app.use('/api', BaseRouter);
        
        /* Print API errors */
        this.app.use((error: Error, req: Request, res: Response) => {
            logger.err(error, true);
            return res.status(StatusCodes.BAD_REQUEST)
                .json({ error: error.message });
        });
    }
}

export default new Server().app;