import cors from 'cors';
import http from 'http';
import axios, { Method } from 'axios';
import helmet from 'helmet';
import { Env, Headers } from './lib/enums';
import * as core from "express-serve-static-core";
import { logExpress } from '@7dev-works/log-express';
import express, { Request, Response, NextFunction } from 'express';
import logger from './lib/logger';

class ExpressProxy {

    constructor(private app: core.Express = express()) { }

    private useMiddleware(): this {
        this.app
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(cors({ origin: `http://localhost`, exposedHeaders: [Headers.Authorization]}))
            .use(logExpress);

        if (process.env.NODE_ENV === Env.production) {
            this.app.use(helmet());
        }
        return this;
    }

    private forwardSocket(): this {

        // TODO 

        return this;
    }

    private forwardHttp(): this {            
 
        this.app.all('/api/v1/*', (request: Request, response: Response, next: NextFunction) => {

            enum publicRoutes {
                '/api/v1/auth/login',
                '/api/v1/auth/register',
                '/api/v1/auth/send-reset-password'
            }

            enum privateRoutes {
                '/api/v1/auth/logout',
                '/api/v1/api/user/all',
                '/api/v1/user/update/:id',
                '/api/v1/user/delete/:id',
                '/api/v1/auth/reset-password',
            }

            if (request.url in publicRoutes) {
                // send to express rest-server
                this.send(request, response);
            }
           
            if (request.url in privateRoutes) {
                // authorize and send to rest-server
            }

        });

        return this;
    }

    private send(request: Request, response: Response) {
        axios({
            method: request.method as Method,
            url: 'http://localhost:8080' + request.originalUrl,
            headers: request.headers,
            data: request.body
        }).then(res => response
            .header('authorization', res.headers?.authorization)
            .status(res?.status)
            .json(res?.data)

        ).catch(error => response
            .status(error?.response?.status)
            .json({ error: error?.response?.data })
        );
    }

    public start(): core.Express {
        return this.useMiddleware().forwardHttp().app;
    }
}

export default ExpressProxy;