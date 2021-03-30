import http from 'http';
import { Mongo } from '@db';
import dotenv from 'dotenv';
import Server from '@server';
import logger from '@logger';
import 'module-alias/register';
import commandLineArgs from 'command-line-args';
import * as core from "express-serve-static-core";
import colors from 'colors';
colors.enable();


class Main {

    public async startServer(): Promise<void> {
        try {
            await new Mongo().connect();
            const port: string = process.env.PORT || '3000';

            const app: core.Express = new Server().start();
            const server: http.Server = app.listen(Number(port), (): void => {
                logger.success(('Express server started on port: '.yellow + port.rainbow).bold);
            });
           
            this.listenForError(server);
            this.listenForSIGTERM(server);
            logger.info('process id:', process.pid.toString().yellow);

        } catch (error: any) {
            logger.error(error);
            process.exit(1); // app crashed
        }
    }

    private listenForError(server: http.Server): void {
        server.on('error', (error: Error): void => {
            logger.error('Server unable to start'.red.bold, error);
            process.exit(0); // clean exit
        });
    }

    private listenForSIGTERM(server: http.Server): void {
        process.on('SIGTERM', (): void => {
            server.close((): void => {
                logger.success('SIGTERM:'.yellow, 'REST Server gracefully terminated.');
            });
        });
    }

    public setEnv(): this {
        /* Setup command line options */
        const options: commandLineArgs.CommandLineOptions =
            commandLineArgs([{
                name: 'env',
                alias: 'e',
                defaultValue: 'development',
                type: String
            }]);

        /* Set the env file  */
        const result: dotenv.DotenvConfigOutput = dotenv.config({
            path: `./env/${options.env as string}.env`
        });

        if (result.error) {
            throw result.error;
        }

        return this;
    }
}

new Main().setEnv().startServer();