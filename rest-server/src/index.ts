import fs from 'fs';
import path from 'path';
import colors from 'colors';
import { Mongo } from '@db';
import { logger, Env, printLogo } from '@utils';
import ExpressServer from './ExpressServer';
import https, { Server, ServerOptions } from 'https';
import * as core from "express-serve-static-core";
import dotenv, { DotenvConfigOutput } from 'dotenv';
import 'module-alias/register';
colors.enable();
printLogo();

class Main {

    public async start(): Promise<void> {
        try {
            (await new Main()
                .setEnvVars()
                .connectDB())
                .startExpressServer();

        } catch (error) {
            logger.error(error);
            process.exit(1); /* app crashed */
        }
    }

    private startExpressServer(): this {
        const app: core.Express = new ExpressServer().start();
        const port: string = process.env.PORT || '3000';

        const options: ServerOptions = {
            // requestCert: true,
            rejectUnauthorized: Boolean(Number(process.env.SELF_SIGNED_CERT)),
            key: fs.readFileSync(path.resolve(__dirname, '../ssl/private-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../ssl/public-key.pem'))
        };

        const server: Server = https.createServer(options, app).listen(port, (): void =>
            logger.success(('Express server listening on port: '?.yellow + port.rainbow)?.bold)
        );

        server.on('error', this.onError);
        process.on('SIGTERM', (): void => this.closeServer(server));

        logger.info('process id:', process.pid.toString()?.cyan.bold);
        logger.info(`Server running in ${process.env.NODE_ENV?.cyan.bold} mode.`);
        return this;
    }

    private async connectDB(): Promise<this> {
        await new Mongo().connect();
        return this;
    }

    private onError = (error: Error): void => {
        logger.error('Server unable to start'.red, error);
        process.exit(0); /* clean exit */
    }

    private closeServer(server: Server): void {
        server.close((): void => {
            logger.success(('SIGTERM'.yellow), 'REST Server gracefully terminated.');
            process.exit(0); /* clean exit */
        });
    }

    private setEnvVars(): this {
        if (process.argv[2] === Env.development) {
            process.env.NODE_ENV = Env.development;
        }

        const result: DotenvConfigOutput = dotenv.config();

        if (result.error) {
            logger.error('Server unable to start'.red, result.error);
            process.exit(0); /* clean exit */
        }
        return this;
    }
}

new Main().start();