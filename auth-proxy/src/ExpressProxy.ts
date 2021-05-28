import cors from 'cors';
import helmet from 'helmet';
import axios, { Method } from 'axios';
import { Env, Headers } from './lib/enums';
import * as core from "express-serve-static-core";
import { logExpress } from '@7dev-works/log-express';
import express, { Request, Response } from 'express';
import AuthorizationService from './services/AuthorizationService';
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

        this.app.all('/api/v1/*', AuthorizationService.validateJwt,
            (request: Request, response: Response): void => this.send(request, response));
        
        return this;
    }

    private send(request: Request, response: Response): void {
        const host: string = `${process.env.REST_API_HOST}:${process.env.REST_API_PORT}`;

        axios({
            method: request.method as Method,
            url: host + request.originalUrl,
            headers: request.headers,
            data: request.body

        }).then((res): Response => response
            .header(Headers.Authorization, res.headers?.authorization)
            .status(res?.status)
            .json(res?.data)

        ).catch((error): Response => response
            .status(error?.response?.status)
            .json({ error: error?.response?.data })
        );
    }

    public start(): core.Express {
        return this.useMiddleware().forwardHttp().app;
    }
}

export default ExpressProxy;