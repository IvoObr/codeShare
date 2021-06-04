import logger from './lib/logger';
import SocketClient from './SocketClient';
import { IMailInfo } from './lib/interfaces';

export default class Notification {

    public notifyRenewal(timeout: Date): void {
        const message: string = JSON.stringify({
            to: process.env.USER_EMAIL,
            subject: 'CodeShare SSL Renewal',
            body: `<p>Dear Dev,</p>
                       <p>The SSL certificates for the codeChare project were successfully renewed!</p>
                       <p> Next renewal will be in ${timeout}.</p>
                       <p>All the Best!</p>
                       <p>And Happy Coding <🍺>< /p>`
        });

        this.sendMessage(message);
    }

    public notifyForExpire(timeout: Date): void {
        const message: string = JSON.stringify({
            to: process.env.USER_EMAIL,
            subject: 'CodeShare SSL Expiry',
            body: `<p>Dear Dev,</p>
                       <p>The SSL certificates for the codeChare project will expire in ${timeout}.</p>
                       <p>There will be automatic SSL renewal attempt. Nonetheless check the certificates.
                       <p>All the Best!</p>
                       <p>And Happy Coding <🍺>< /p>`
        });

        this.sendMessage(message);
    }

    private sendMessage(message: string): void {
        try {
            new SocketClient()
                .notificationSocket()
                .send(message)
                .onSuccess((info: IMailInfo): void => {
                    logger.success(`Email successfully send: ${info?.accepted?.[0] || info}`);
                })
                .onError((error: string): void => {
                    logger.error(error);
                });
        } catch (error: unknown) {
            logger.error(error);
        }
    }
}