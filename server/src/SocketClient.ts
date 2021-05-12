import Net from 'net';
import { logger, Events, Event } from '@utils';

export default class SocketClient {

    public connect = (port: number): Net.Socket => 
        Net.createConnection({ port })
            .on('data', this.onData)
            .on('end', () => logger.info('Socket ended.'))
            .on('close', () => logger.info('Socket closed.'))
            .on('error', (error: Error) => logger.error(error))
            .on('timeout', () => logger.info('Socket timeout.'))
            .on('connect', () => logger.info('Socket connected.'))
    
    private onData = (data: Buffer) => {
        const info: any = JSON.parse(data.toString());

        if (info?.error) {
            Event.emit(Events.emailError, info?.error);
            logger.error('Message not delivered', info.error);
        } else {
            Event.emit(Events.emailSuccess, info);
            logger.success('Mail sent to: ', info?.accepted);
        }
    }
}