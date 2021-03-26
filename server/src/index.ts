import http from 'http';
import { Mongo } from '@db';
import dotenv from 'dotenv';
import Server from '@server';
import logger from '@logger';
import colors from 'colors';
import 'module-alias/register';
import commandLineArgs from 'command-line-args';
import * as core from "express-serve-static-core";
import { UserError } from "@errors";
import { ErrorType } from "@enums";

class Main {

    // private server: http.Server;

    public async startServer(): Promise<void> {
        try {
            colors.enable();
            await new Mongo().connect();
            const port: number = Number(process.env.PORT || 3000);

            const app: core.Express = new Server().start();
            const server: http.Server = app.listen(port, (): void => logger.success(
                'Express server started on port: '.yellow + port.toString().rainbow));
                
            this.gracefulShutDownOnError(server);
            logger.info('process id:', process.pid.toString().yellow);

        } catch (error) {
            logger.error(error);
            process.exit(1);
        }
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
    
    private gracefulShutDownOnError(server: http.Server): void {
        
        process.on('SIGTERM', (): void => {
            server.close((): void => {
                logger.success('SIGTERM:'.yellow, 'REST Server gracefully terminated.');
            });
        });
    }
}

new Main().setEnv().startServer();