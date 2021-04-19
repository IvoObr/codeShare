import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import { Env } from '@utils';
import express from 'express';
import * as core from "express-serve-static-core";
import { AuthRouter, UserRouter } from '@routers';

class Server {

    private readonly app: core.Express;
    private readonly staticDir: string = path.join(__dirname, 'public');

    constructor() {
        this.app = express();
    }

    private useMiddleware(): this {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(this.staticDir));
        this.app.use(cors({ origin: `http://localhost` })); //, exposedHeaders: [Const.xAuth]}));
        return this;
    }

    private prepareEnv(): this {
        (process.env.NODE_ENV === Env.development) && this.app.use(morgan('dev'));
        (process.env.NODE_ENV === Env.production) && this.app.use(helmet());
        return this;
    }

    private useAPIs(): this {
        this.app.use('/auth', AuthRouter);
        this.app.use('/user', UserRouter);
        return this;
    }

    public start(): core.Express {
        return this.useMiddleware().prepareEnv().useAPIs().app;
    }
}

export default Server;