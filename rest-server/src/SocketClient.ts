import Net, { Socket } from 'net';
import { logger, Events, Event } from '@utils';

export default class SocketClient {

    private socket!: Socket;

    public mailerSocket(): this {
        const port: number = Number(process.env.MAILER_PORT);
        this.socket = new SocketClient().connect(port);
        return this;
    }

    public send(message: string): this {
        this.socket.write(message);
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
            .on('end', (): void => logger.debug('Socket ended.'))
            .on('close', (): void => logger.debug('Socket closed.'))
            .on('error', (error: Error): void => logger.error(error))
            .on('timeout', (): void => logger.debug('Socket timeout.'))
            .on('connect', (): void => logger.debug('Socket connected.'))
    
    private onData(data: Buffer): void {
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