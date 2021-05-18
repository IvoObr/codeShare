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
            .on('end', () => logger.info('Socket ended.'))
            .on('close', () => logger.info('Socket closed.'))
            .on('error', (error: Error) => logger.error(error))
            .on('timeout', () => logger.info('Socket timeout.'))
            .on('connect', () => logger.info('Socket connected.'))
    
    private onData = (data: Buffer) => {
        const info: IMailInfo = JSON.parse(data.toString());

        if (info?.error) {
            Event.emit(Events.emailError, info?.error);
            logger.error('Message not delivered', info);
        } else {
            Event.emit(Events.emailSuccess, info);
            logger.success('Mail sent to: ', info?.accepted);
        }
    }
}