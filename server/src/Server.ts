import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from '@logger';
import 'express-async-errors';
import BaseRouter from './routes';
import * as Consts from '@constants';
import bodyParser from 'body-parser';
import { StatusCodes } from '@enums';
import * as core from "express-serve-static-core";
import express, { Request, Response } from 'express';

class Server {

    private readonly app: core.Express;

    private readonly staticDir: string = path.join(__dirname, 'public');

    constructor() {
        this.app = express();
    }

    private useLibs(): Server {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(express.static(this.staticDir));
        this.app.use(cors({ origin: `http://localhost`, exposedHeaders: [Consts.xAuth] }));

        return this;
    }

    private prepareEnv(): Server {
        /* Show routes called in console during development */
        process.env.NODE_ENV === 'development' && this.app.use(morgan('dev'));
        /* Security */
        process.env.NODE_ENV === 'production' && this.app.use(helmet());

        return this;
    }

    private useAPIs(): Server {
        /* Add APIs */
        this.app.use('/api', BaseRouter);

        return this;
    }

    private printErrors(): Server {
        /* Print API errors */
        this.app.use((error: Error, req: Request, res: Response) => {
            logger.error(error);
            return res.status(StatusCodes.BAD_REQUEST)
                .json({ error: error.message });
        });

        return this;
    }

    public start(): core.Express {
        return this.useLibs().prepareEnv().useAPIs().printErrors().app;
    }
}

export default Server;