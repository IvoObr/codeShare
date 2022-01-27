import fs from 'fs';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import express from 'express';
import logger from './lib/logger';
import { Headers } from './lib/enums';
import { ICerts } from './lib/interfaces';
import { logExpress } from '@7util/log-express';
import { Express } from "express-serve-static-core";
import https, { Server, ServerOptions } from 'https';
/**
 *  
 */
export default class ExpressServer {
    
    private setKeys(): ICerts | undefined {

        // fixme: init keys
        // throw new ServerError(Errors.SSL_HANDSHAKE_FAILED, error.message);

        try {
            return {
                key: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.key')),
                cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.crt')),
                ca: fs.readFileSync(path.resolve(__dirname, '../../ssl/rootCA.crt'))
            };
        } catch (error) {
            logger.error(error);
        }
    }
    
    public start(): Express {
        const app: Express = this.setApp();
        const keys = this.setKeys() as ServerOptions;
        const port: string = process.env.PORT || '3000';

        const server = https.createServer(keys, app);
        server.listen(port, (): void => this.onListen(port));
        server.on('error', this.onError);

        process.on('SIGTERM', (): void => this.closeServer(server));
        logger.info('process id:', process.pid.toString().cyan.bold);
        logger.info(`Auth-proxy running in ${process.env.NODE_ENV?.cyan.bold} mode.`);
        return app;
    }

    private onListen(port: string): void {
        logger.success(('Auth-proxy server listening on port: '.yellow + port.rainbow)?.bold);
    }

    private onError(error: unknown): void {
        logger.error('Auth-proxy unable to start'.red, error);
        process.exit(0); /* clean exit */
    }

    private closeServer(server: Server): void {
        server.close((): void => {
            logger.success(('SIGTERM'.yellow), 'Auth-proxy gracefully terminated.');
            process.exit(0); /* clean exit */
        });
    }

    private setApp(): Express {
        return express()
            .use(helmet())
            .use(express.json())
            .use(express.urlencoded({ extended: true }))
            .use(cors({
                origin: `https://localhost`,
                exposedHeaders: [Headers.Authorization]
            }))
            .use(logExpress);
    }
}