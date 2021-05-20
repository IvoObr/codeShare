import http from 'http';
import colors from 'colors';
import { Mongo } from './db';
import { Env } from './lib/enums';
import logger from './lib/logger';
import ExpressServer from './ExpressServer';
import * as core from "express-serve-static-core";
import dotenv, { DotenvConfigOutput } from 'dotenv';
colors.enable();

class Main {

    public async start() {
        try {
            const main = new Main();
            main.setEnv();
            await main.connectDB();
            main.startExpressServer();

        } catch (error) {
            logger.error(error);
            process.exit(1); /* app crashed */
        }
    }

    private startExpressServer(): this {
        const app: core.Express = new ExpressServer().start();
        const port: string = process.env.PORT || '3000';

        const server: http.Server = app.listen(port, (): void =>
            logger.success(('Auth-proxy server started on port: '?.yellow + port.america)?.bold)
        );

        server.on('error', this.onError);
        process.on('SIGTERM', () => this.closeServer(server));

        logger.info('process id:', process.pid.toString()?.cyan.bold);
        logger.info(`Auth-proxy running in ${process.env.NODE_ENV?.cyan.bold} mode.`);
        return this;
    }

    private async connectDB(): Promise<this> {
        await new Mongo().connect();
        return this;
    }

    private onError = (error: Error): void => {
        logger.error('Auth-proxy unable to start'.red, error);
        process.exit(0); /* clean exit */
    }

    private closeServer(server: http.Server) {
        server.close((): void => {
            logger.success(('SIGTERM'.yellow), 'Auth-proxy gracefully terminated.');
            process.exit(0); /* clean exit */
        });
    }

    private setEnv(): this {
        if (process.argv[2] === Env.development) {
            process.env.NODE_ENV = Env.development;
        }

        const result: DotenvConfigOutput = dotenv.config();

        if (result.error) {
            logger.error('Auth-proxy unable to start'.red, result.error);
            process.exit(0); /* clean exit */
        }
        return this;
    }
}

new Main().start();