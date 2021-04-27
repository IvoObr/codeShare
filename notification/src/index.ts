import colors from 'colors';
import Mailer from "./Mailer";
import logger from './lib/logger';
import SocketServer from './SocketServer';
import dotenv, { DotenvConfigOutput } from 'dotenv';
colors.enable();

class Main {

    public subscribeMailer(): this {
        try {
            const mailer: Mailer = new Mailer();

            // on
            // mailer.sendMail(msg)
            setTimeout(() => {
                mailer.sendMail({
                    to: 'ivo_obr@hotmail.com',
                    subject: 'mailer test',
                    body: '<p>Hello Man!<p/>'
                });
            }, 1000);

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