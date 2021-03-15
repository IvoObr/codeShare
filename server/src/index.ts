import { Mongo } from '@db';
import dotenv from 'dotenv';
import Server from '@server';
import logger from 'logger-mogger-js';
import 'module-alias/register';
import commandLineArgs from 'command-line-args';
import * as core from "express-serve-static-core";
import { UserError } from "@errors";
import { ErrorType } from "@enums";

class Main {

    public async startServer(): Promise<void> {
        try {
            await new Mongo().connect();
            const port: number = Number(process.env.PORT || 3000);

            const app: core.Express = new Server().start();
            app.listen(port, (): void => logger.success(
                'Express server started on port: ' + port.toString().rainbow));

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
        const result2: dotenv.DotenvConfigOutput = dotenv.config({
            path: `./env/${options.env as string}.env`
        });

        if (result2.error) {
            throw result2.error;
        }

        return this;
    }
} 

try {
    throw new UserError(ErrorType.INVALID_EMAIL);
} catch (error) {

    logger.inspect('inspect message');
    logger.info('info message');
    logger.warn('warn message');
    logger.success('success message');
    logger.error(error);
}

new Main().setEnv().startServer();