import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import { Env } from '@utils';
import express from 'express';
import { AuthRouter, UserRouter } from '@routers';
import * as core from "express-serve-static-core";
import { logExpress } from '@7dev-works/log-express';

class Server {

    private readonly app: core.Express;
    private readonly staticDir: string = path.join(__dirname, 'public');

    constructor() {
        this.app = express();
    }

    private useMiddleware(): this {
        this.app.use(logExpress);
        this.app.use(express.json()); 
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(this.staticDir));       
        this.app.use(cors({ origin: `http://localhost` })); //, exposedHeaders: [Const.xAuth]}));
        
        if (process.env.NODE_ENV === Env.production) {
            this.app.use(helmet());
        }
        return this;
    }
    
    private useAPIs(): this {
        this.app.use('/auth', AuthRouter);
        this.app.use('/user', UserRouter);
        return this;
    }

    public start(): core.Express {
        return this.useMiddleware().useAPIs().app;
    }
}

export default Server;