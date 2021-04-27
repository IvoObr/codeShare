import colors from 'colors';
import Mailer from "./Mailer";
import logger from './lib/logger';
import dotenv, { DotenvConfigOutput } from 'dotenv';
colors.enable();

class Main {

    public subscribeMailer(): void {
        try {
            const mailer: Mailer = new Mailer();

            // subscribe to keep the event loop busy
            // on
            // mailer.sendMail(msg)
            setTimeout(() => {
                mailer.sendMail({
                    to: 'ivo_obr@hotmail.com',
                    subject: 'mailer test',
                    body: '<p>Hello Man!<p/>'
                });
            }, 1000);

        
        } catch (error) {
            logger.error('Mailer unable to start'.red, error);
            process.exit(0); /* clean exit */
        }

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

new Main().setEnv().subscribeMailer();