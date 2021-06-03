import fs from 'fs';
import path from 'path';
import helmet from 'helmet';
import logger from './lib/logger';
import cors, { CorsOptions } from 'cors';
import { Env, Headers } from './lib/enums';
import https, { RequestOptions } from 'https';
import * as core from "express-serve-static-core";
import { logExpress } from '@7dev-works/log-express';
import express, { Request, Response } from 'express';
import { ClientRequest, IncomingMessage } from 'http';
import AuthorizationService from './services/AuthorizationService';

export default class ExpressProxy {

    constructor(private app: core.Express = express()) { }

    private useMiddleware(): this {
        const corsOptions: CorsOptions = {
            origin: `https://localhost`,
            exposedHeaders: [Headers.Authorization]
        };

        this.app
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(cors(corsOptions))
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

        this.app.all('/api/v1/*', AuthorizationService.validateSSL, AuthorizationService.validateJwt,
            (request: Request, response: Response): void => this.send(request, response));
        
        return this;
    }

    private send(request: Request, response: Response): void {
        const body: string = JSON.stringify(request.body);

        const options: RequestOptions = {
            method: request.method,
            path: request.originalUrl,
            hostname: process.env.REST_API_HOST,
            port: Number(process.env.REST_API_PORT),
            rejectUnauthorized: Boolean(Number(process.env.SELF_SIGNED_CERT)),
            key: fs.readFileSync(path.resolve(__dirname, '../ssl/private-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../ssl/public-key.pem')),
            headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
        };

        const req: ClientRequest = https.request(options, (res: IncomingMessage): void => {
            console.log(`statusCode: ${res.statusCode}`);

            res.on('data', (data: Buffer): Response => response
                .header(Headers.Authorization, res.headers?.authorization)
                .status(Number(res?.statusCode))
                .json(data.toString())
            );
        });

        req.on('error', (error: unknown): void => {
            console.error(error);
        });

        req.write(body);
        req.end();

        // axios({
        //     method: request.method as Method,
        //     url: host + request.originalUrl,
        //     headers: request.headers,
        //     data: request.body

        // }).then((res): Response => response
        //     .header(Headers.Authorization, res.headers?.authorization)
        //     .status(res?.status)
        //     .json(res?.data)

        // ).catch((error): Response => response
        //     .status(error?.response?.status)
        //     .json({ error: error?.response?.data })
        // );
    }

    public start(): core.Express {
        return this.useMiddleware().forwardHttp().app;
    }
}