import fs from 'fs';
import path from 'path';
import logger from './lib/logger';
import { Events } from './lib/enums';
import Event from './lib/EventEmitter';
import { IMailInfo } from './lib/interfaces';
import tls, { TLSSocket, TlsOptions, Server } from 'tls';

export default class TLSServer {

    public start(): void {
        const port: number = Number(process.env.PORT) || 8085;
        const host: string = process.env.HOST || 'localhost';

        this.createServer().listen({ host, port }, (): void =>
            logger.success('TLSServer listening on port'.yellow, `${port}`.rainbow));
    }

    private createServer(): Server {
        const options: TlsOptions = {
            rejectUnauthorized: Boolean(Number(process.env.SELF_SIGNED_CERT)),
            cert: fs.readFileSync(path.resolve(__dirname, '../ssl/public-key.pem')),
            key: fs.readFileSync(path.resolve(__dirname, '../ssl/private-key.pem'))
        };

        return tls.createServer(options, (socket: TLSSocket): void => {
            logger.debug(`Client connected!`.bold);

            socket
                .on('end', (): void => logger.debug('Socket ended.'))
                .on('close', (): void => logger.debug('Socket closed.'))
                .on('error', (error: Error): void => logger.error(error: unknown))
                .on('timeout', (): void => logger.debug('Socket timeout.'))
                .on('connect', (): void => logger.debug('Socket connected.'))
                .on('data', (data: Buffer): void => this.onData(data, socket));
        });
    }

    private onData(data: Buffer, socket: TLSSocket): void {
        Event.emit(Events.newMail, JSON.parse(data.toString()));

        Event.once(Events.emailSend, (mailInfo: IMailInfo): void => {
            socket.write(JSON.stringify(mailInfo));
            socket.end();
        });
        Event.once(Events.emailError, (error: unknown): void => {
            socket.write(JSON.stringify({ error }));
            socket.end();
        });
    }

}