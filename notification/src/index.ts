import colors from 'colors';
import Mailer from "./Mailer";
import logger from './lib/logger';
import { text } from './lib/text';
import { Events } from './lib/enums';
import Event from './lib/EventEmitter';
import SocketServer from './SocketServer';
import { IMessage } from './lib/interfaces';
import dotenv, { DotenvConfigOutput } from 'dotenv';
colors.enable();

class Main {

    public subscribeMailer(): this {
        try {
            console.log(text.rainbow);
            const mailer: Mailer = new Mailer();

            Event.on(Events.newMail, (data: IMessage): void => {
                mailer.sendMail(data);
            });

            return this;
        
        } catch (error) {
            logger.error('Mailer unable to start'.red, error);
            process.exit(0); /* clean exit */
        }

    }

    public startSocketServer(): void {
        const server: SocketServer = new SocketServer();
        server.start();
    }
    
    public setEnv(): this {
        const result: DotenvConfigOutput = dotenv.config();

        if (result.error) {
            logger.error('Mailer unable to start'.red, result.error);
            process.exit(0); /* clean exit */
        }
        return this;
    }
}

new Main()
    .setEnv()
    .subscribeMailer()
    .startSocketServer();