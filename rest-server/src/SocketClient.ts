import fs from 'fs';
import path from 'path';
import { Response } from 'express';
import { ServerError } from '@services';
import tls, { TLSSocket, ConnectionOptions } from 'tls';
import { logger, Events, Event, ICerts, StatusCodes, IMailInfo, Errors } from '@utils';

export default class SocketClient {

    private socket!: TLSSocket;

    public static sendEmail(message: string, response: Response, data: any): void { 
        new SocketClient()
            .notificationSocket()
            .send(message)
            .onSuccess((info: IMailInfo): void => {
                response
                    .status(StatusCodes.CREATED)
                    .json({ ...data, notification: {
                        result: `Email successfully send.`,
                        receiver: info?.accepted?.[0] || info }
                    });
            })
            .onError((error: any): void => {
                if (!(error instanceof ServerError)) {
                    error = new ServerError(Errors.COULD_NOT_SEND_EMAIL, error.message);
                }
                ServerError.handle(error, response);
            });
    }

    private notificationSocket(): this {
        const port: number = Number(process.env.NOTIFICATION_PORT);
        const host: string = process.env.HOST || 'localhost';
        this.socket = this.connect(port, host);
        return this;
    }

    private send(message: string): this {
        this.socket.write(message);
        return this;
    }

    private onSuccess(callback: (info: any) => void): this {
        Event.once(Events.messageSuccess, callback);
        return this;
    }

    private onError(callback: (error: string) => void): this {
        Event.once(Events.messageError, callback);
        return this;
    }

    private setKeys(): ICerts | undefined {
        try {

            // fixme: init keys
            // throw new ServerError(Errors.SSL_HANDSHAKE_FAILED, error.message);

            return {
                key: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.key')),
                cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.crt')),
                ca: fs.readFileSync(path.resolve(__dirname, '../../ssl/rootCA.crt'))
            };
        } catch (error: any) {
            throw new ServerError(Errors.SSL_HANDSHAKE_FAILED, error.message);
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
    };

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