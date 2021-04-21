import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import { Env } from '@utils';
import express, { Router } from 'express';
import { AuthRouter, UserRouter } from '@routers';
import * as core from "express-serve-static-core";
import { logExpress } from '@7dev-works/log-express';

class Server {

    constructor(private app: core.Express = express()) {}

    private useMiddleware(): this {
        this.app.use(logExpress);
        this.app.use(express.json()); 
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.static(path.join(__dirname, 'public')));       
        this.app.use(cors({ origin: `http://localhost` })); //, exposedHeaders: [Const.xAuth]}));

        if (process.env.NODE_ENV === Env.production) {
            this.app.use(helmet());
        }
        return this;
    }
    
    private useAPIs(): this {
        const router: Router = Router();
        router.use('/auth', AuthRouter);
        router.use('/user', UserRouter);
        this.app.use('/api/v1', router);
 
        return this;
    }

    public start(): core.Express {
        return this.useMiddleware().useAPIs().app;
    }
}

export default Server;