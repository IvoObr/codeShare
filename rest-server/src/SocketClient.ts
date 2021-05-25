import Net, { Socket } from 'net';
import { logger, Events, Event, IMailInfo } from '@utils';

export default class SocketClient {

    public static connectMailerClient(callback: () => void) {
        const mailerClient: Socket = new SocketClient()
            .connect(Number(process.env.MAILER_PORT));

        Event.once(Events.sendEmail, (message: string) => {
            mailerClient.write(message);
        });
        
        callback();
    }

    public connect = (port: number): Net.Socket => 
        Net.createConnection({ port })
            .on('data', this.onData)
            .on('end', () => logger.debug('Socket ended.'))
            .on('close', () => logger.debug('Socket closed.'))
            .on('error', (error: Error) => logger.error(error))
            .on('timeout', () => logger.debug('Socket timeout.'))
            .on('connect', () => logger.debug('Socket connected.'))
    
    private onData = (data: Buffer) => {
        const info: IMailInfo = JSON.parse(data.toString());

        if (info?.error) {
            Event.emit(Events.emailError, info?.error);
            logger.error('Message not delivered', info);
        } else {
            Event.emit(Events.emailSuccess, info);
            logger.debug('Mail sent to: ', info?.accepted);
        }
    }
}