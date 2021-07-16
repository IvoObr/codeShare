import fs from 'fs';
import path from 'path';
import { logger, Events, Event } from '@utils';
import tls, { TLSSocket, ConnectionOptions } from 'tls';

export default class SocketClient {

    private socket!: TLSSocket;

    public notificationSocket(): this {
        const port: number = Number(process.env.NOTIFICATION_PORT);
        const host: string = process.env.HOST || 'localhost';
        this.socket = new SocketClient().connect(port, host);
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

    private setKeys() {
        try {
            return {
                key: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.key')),
                cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.crt')),
                ca: fs.readFileSync(path.resolve(__dirname, '../../ssl/rootCA.crt'))
            }
        } catch (error) {
            logger.error(error)
        }
    }

    private connect = (port: number, host: string): TLSSocket => {
        const keys = this.setKeys() as ConnectionOptions;

        return tls.connect(port, host, keys)
            .on('data', this.onData)
            .on('end', (): void => logger.debug('Socket ended.'))
            .on('close', (): void => logger.debug('Socket closed.'))
            .on('error', (error: Error): void => logger.error(error))
            .on('timeout', (): void => logger.debug('Socket timeout.'))
            .on('connect', (): void => logger.debug('Socket connected.'));
    }

    private onData(data: Buffer): void {
        try {
            const response: any = JSON.parse(data.toString());

            if (response?.error) {
                throw response?.error;
            }

            Event.emit(Events.messageSuccess, response);
            logger.debug('Mail sent to: ', response?.accepted);

        } catch (error) {
            Event.emit(Events.messageError, error);
            logger.error('Message not delivered', data.toString());
        }
    }
}