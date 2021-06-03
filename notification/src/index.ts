import colors from 'colors';
import Mailer from "./Mailer";
import logger from './lib/logger';
import {printLogo } from './lib/text';
import { Events } from './lib/enums';
import Event from './lib/EventEmitter';
import TLSServer from './SocketServer';
import { IMessage } from './lib/interfaces';
import dotenv, { DotenvConfigOutput } from 'dotenv';
colors.enable();
printLogo()

class Main {

    public start(): void {
        try {
            logger.info('process id:', process.pid.toString()?.cyan.bold);
            logger.info(`Notification running in ${process.env.NODE_ENV?.cyan.bold} mode.`);
            new Main()
                .setEnvVars()
                .subscribeMailer()
                .startSocketServer();

        } catch (error) {
            logger.error('Mailer unable to start'.red, error);
            process.exit(0); /* clean exit */
        }
    }

    public startSocketServer(): void {
        const server: TLSServer = new TLSServer();
        server.start();
    }

    private subscribeMailer(): this {
        const mailer: Mailer = new Mailer();

        Event.on(Events.newMail, (data: IMessage): void => {
            mailer.sendMail(data);
        });
        return this;
    }
    
    private setEnvVars(): this {
        const result: DotenvConfigOutput = dotenv.config();

        if (result.error) {
            logger.error('Mailer unable to start'.red, result.error);
            process.exit(0); /* clean exit */
        }
        return this;
    }
}

new Main().start();