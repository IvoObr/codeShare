import fs from 'fs';
import path from 'path';
import { Mongo } from './db';
import { Env } from './lib/enums';
import logger from './lib/logger';
import ExpressProxy from './ExpressProxy';
import * as core from "express-serve-static-core";
import dotenv, { DotenvConfigOutput } from 'dotenv';
import https, { Server, ServerOptions } from 'https';

export default class AuthProxy {

    public async start(): Promise<void> {
        try {
            const authProxy: AuthProxy = new AuthProxy();
            authProxy.setEnvVars();
            await new Mongo().connect();
            authProxy.startExpressProxy();

        } catch (error: unknown) {
            logger.error(error);
            process.exit(1); /* app crashed */
        }
    }

    private startExpressProxy(): void {
        const port: string = process.env.PORT || '3000';

        const options: ServerOptions = {
            rejectUnauthorized: Boolean(Number(process.env.SELF_SIGNED_CERT)),
            key: fs.readFileSync(path.resolve(__dirname, '../ssl/private-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../ssl/public-key.pem'))
        };

        const app: core.Express = new ExpressProxy().start();
        const proxy: Server = https.createServer(options, app);

        proxy.listen(port, (): void =>
            logger.success(('Auth-proxy server listening on port: '?.yellow + port.rainbow)?.bold)
        );

        proxy.on('error', this.onError);
        process.on('SIGTERM', (): void => this.closeServer(proxy));

        logger.info('process id:', process.pid.toString()?.cyan.bold);
        logger.info(`Auth-proxy running in ${process.env.NODE_ENV?.cyan.bold} mode.`);
    }

    private onError = (error: Error): void => {
        logger.error('Auth-proxy unable to start'.red, error);
        process.exit(0); /* clean exit */
    }

    private closeServer(proxy: Server): void {
        proxy.close((): void => {
            logger.success(('SIGTERM'.yellow), 'Auth-proxy gracefully terminated.');
            process.exit(0); /* clean exit */
        });
    }

    private setEnvVars(): void {
        if (process.argv[2] === Env.development) {
            process.env.NODE_ENV = Env.development;
        }

        const result: DotenvConfigOutput = dotenv.config();

        if (result.error) {
            logger.error('Auth-proxy unable to start'.red, result.error);
            process.exit(0); /* clean exit */
        }
    }
}