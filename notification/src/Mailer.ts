import logger from './lib/logger';
import nodemailer from "nodemailer";
import { Events } from './lib/enums';
import Event from './lib/EventEmitter';
import Mail from "nodemailer/lib/mailer";
import { IMessage, IMailInfo } from './lib/interfaces';

export default class Mailer {

    private transporter: Mail;

    constructor() {
        this.transporter = this.initTransporter();
    }

    private initTransporter(): Mail {

        const transporter: Mail = nodemailer.createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            }
        });
    
        transporter.verify(function(error) {
            if (error) {
                logger.error('Mailer unable to start'.red, error);
                process.exit(0); /* clean exit */
            } else {
                logger.success("Mailer started!".bold);
            }
        });
    
        return transporter;
    }

    public async sendMail(msg: IMessage): Promise<void> {
        try {
            const info: IMailInfo = await this.transporter.sendMail({
                from: msg?.from || '"CodeShare" <codeShare@example.com>',
                to: msg?.to,
                subject: msg?.subject,
                html: msg?.body,
                replyTo: msg?.replyTo,
                headers: msg?.headers
            });

            Event.emit(Events.emailSend, info);
            logger.success("Message sent: ", info);

        } catch (error) {
            Event.emit(Events.emailError, error.message);
            logger.error(error);
        }
    }
}