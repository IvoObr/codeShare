import fs from 'fs';
import path from 'path';
import { logger, Events, Event } from '@utils';
import tls, { TLSSocket, ConnectionOptions } from 'tls';

export default class SocketClient {

    private socket!: TLSSocket;

    public mailerSocket(): this {
        const port: number = Number(process.env.MAILER_PORT);
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

    public connect = (port: number, host: string): TLSSocket => {
        const options: ConnectionOptions = {
            rejectUnauthorized: false, // accept self signed certificates
            key: fs.readFileSync(path.resolve(__dirname, '../ssl/private-key.pem')),
            cert: fs.readFileSync(path.resolve(__dirname, '../ssl/public-cert.pem'))
        };

        return tls.connect(port, host, options)
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