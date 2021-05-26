import Net, { Socket } from 'net';
import { logger, Events, Event } from '@utils';

export default class SocketClient {

    private client!: Socket;

    public connectMailerClient(): this {
        const port: number = Number(process.env.MAILER_PORT);
        this.client = new SocketClient().connect(port);
        return this;
    }

    public send(message: string): this {
        this.client.write(message);
        return this;
    }

    public onSuccess(callback: (info: any) => void): this {
        Event.once(Events.messageSuccess, callback);
        return this;
    }
    
    public onError(callback: (error: string) => void): this {
        Event.once(Events.messageError, callback);
        return this;
    }

    public connect = (port: number): Socket => 
        Net.createConnection({ port })
            .on('data', this.onData)
            .on('end', () => logger.debug('Socket ended.'))
            .on('close', () => logger.debug('Socket closed.'))
            .on('error', (error: Error) => logger.error(error))
            .on('timeout', () => logger.debug('Socket timeout.'))
            .on('connect', () => logger.debug('Socket connected.'))
    
    private onData = (data: Buffer) => {
        const response = JSON.parse(data.toString());

        if (response?.error) {
            Event.emit(Events.messageError, response?.error);
            logger.error('Message not delivered', response);
        } else {
            Event.emit(Events.messageSuccess, response);
            logger.debug('Mail sent to: ', response?.accepted);
        }
    }
}