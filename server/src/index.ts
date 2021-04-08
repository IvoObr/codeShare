import http from 'http';
import colors from 'colors';
import { Mongo } from '@db';
import Server from '@server';
import { logger } from '@lib';
import 'module-alias/register';
import * as core from "express-serve-static-core";
import dotenv, { DotenvConfigOutput } from 'dotenv';
colors.enable();

class Main {

    public async startServer(): Promise<void> {
        try {
            await new Mongo().connect();
            const app: core.Express = new Server().start();
            const port: string = process.env.PORT || '3000';

            const server: http.Server = app.listen(port, (): void => 
                logger.success(('Express server started on port: '.yellow + port.rainbow).bold)
            );
            
            this.listenForError(server);
            this.listenForSIGTERM(server);
            logger.info('process id:', process.pid.toString().cyan.bold);
            logger.info(`Server running in ${process.env.NODE_ENV?.cyan.bold} mode.`);

        } catch (error: any) {
            logger.error(error);
            process.exit(1); /* app crashed */
        }
    }

    private listenForError(server: http.Server): void {
        server.on('error', (error: any): void => {
            logger.error('Server unable to start'.red, error);
            process.exit(0); /* clean exit */
        });
    }

    private listenForSIGTERM(server: http.Server): void {
        process.on('SIGTERM', (): void => {
            server.close((): void => {
                logger.success(('SIGTERM'.yellow),
                    'REST Server gracefully terminated.');
            });
        });
    }

    public setEnv(): this {
        const result: DotenvConfigOutput = dotenv.config();
        
        if (result.error) {
            logger.error('Server unable to start'.red, result.error);
            process.exit(0); /* clean exit */
        }
        return this;
    }
}

new Main().setEnv().startServer();