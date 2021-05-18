import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import { Env, Headers } from '@utils';
import express, { Router } from 'express';
import { AuthRouter, UserRouter } from '@routers';
import * as core from "express-serve-static-core";
import { logExpress } from '@7dev-works/log-express';

class ExpressServer {

    constructor(private app: core.Express = express()) { }

    private useMiddleware(): this {
        this.app
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(cors({ origin: `http://localhost`, exposedHeaders: [Headers.Authorization] }))
            .use(logExpress);

        if (process.env.NODE_ENV === Env.production) {
            this.app.use(helmet());
        }
        return this;
    }

    private useAPIs(): this {
        const router: Router = Router()
            /*
            POST /api/v1/auth/login
            POST /api/v1/auth/register
            POST /api/v1/auth/send-reset-password
            
            AUTH POST /api/v1/auth/reset-password
            AUTH GET /api/v1/auth/logout
            AUTH GET /api/v1/api/user/all
            AUTH PUT /api/v1/user/update/:id
            AUTH DELETE /api/v1/user/delete/:id
            */
            
            .use('/auth', AuthRouter)
            .use('/user', UserRouter);

        this.app.use('/api/v1', router);
        return this;
    }

    public start(): core.Express {
        return this.useMiddleware().useAPIs().app;
    }
}

export default ExpressServer;