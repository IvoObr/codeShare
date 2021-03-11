import 'module-alias/register';
import './lib/preStart';
import * as core from "express-serve-static-core";
import * as Consts  from "@constants"

console.log('===================')
console.log(Consts)

import Server from '@server';

console.log('------------------')
console.log(Server)

import logger from '@logger';
import { Mongo } from '@db';

class Main {

    static async startServer(): Promise<void> {
        try {
            await new Mongo().connect();
            const port = Number(process.env.PORT || 3000);

            const app: core.Express = new Server().initApp();
            app.listen(port, () => logger.success(
                'Express server started on port: ' + port.toString().rainbow));

        } catch (error) {
            logger.err(error);
        }
    }
} 

Main.startServer();
