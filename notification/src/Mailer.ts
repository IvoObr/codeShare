import logger from './lib/logger';
import nodemailer from "nodemailer";
import { IMessage } from './lib/interfaces';
import Mail from "nodemailer/lib/mailer";

export default class Mailer {

    private transporter: Mail;

    constructor() {
        this.transporter = this.initTransporter();
    }

    private initTransporter(): Mail {

        const transporter: Mail = nodemailer.createTransport({
            service: 'gmail',
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
            const info: any = await this.transporter.sendMail({
                from: msg?.from || '"CodeShare" <codeShare@example.com>',
                to: msg?.to,
                subject: msg?.subject,
                html: msg?.body,
                replyTo: msg?.replyTo,
                headers: msg?.headers
            });

            logger.success("Message sent: ", info);

        } catch (error) {
            logger.error(error);
        }
    }
}