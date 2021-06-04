import fs from 'fs';
import path from 'path';
import { Mongo } from './db';
import logger from './lib/logger';
import { Headers, Env } from './lib/enums';
import ExpressServer from './ExpressServer';
import { Request, Response } from 'express';
import https, { RequestOptions } from 'https';
import { Express } from "express-serve-static-core";
import dotenv, { DotenvConfigOutput } from 'dotenv';
import { ClientRequest, IncomingMessage } from 'http';
import AuthorizationService from './services/AuthorizationService';
/**
 *
 */
export default class AuthProxy {

    public async start(): Promise<void> {
        try {
            new AuthProxy().setEnv();
            await new Mongo().connect();

            const app: Express = new ExpressServer().start();
            this.proxyHttps(app);

        } catch (error: unknown) {
            this.onError(error: unknown);
        }
    }

    private proxySocket(): this {

        // BIG TODO 

        return this;
    }

    private proxyHttps(app: Express): void {
        app.all('/api/v1/*', AuthorizationService.validateSSL, AuthorizationService.validateJwt,
            (request: Request, response: Response): void => this.send(request, response));
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
            console.error(error: unknown);
        });

        req.write(body);
        req.end();

        // ).catch((error: unknown): Response => response
        //     .status(error?.response?.status)
        //     .json({ error: error?.response?.data })
        // );
    }

    private setEnv(): void {
        if (process.argv[2] === Env.development) {
            (process.env.NODE_ENV = Env.development);
        }
        const result: DotenvConfigOutput = dotenv.config();
        result.error && this.onError(result.error);
    }

    private onError(error: unknown): void {
        logger.error('Auth-proxy unable to start'.red, error);
        process.exit(1); /* app crashed */
    }
}