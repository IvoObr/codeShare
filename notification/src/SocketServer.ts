import fs from 'fs';
import path from 'path';
import logger from './lib/logger';
import { Events } from './lib/enums';
import Event from './lib/EventEmitter';
import { ICerts, IMailInfo } from './lib/interfaces';
import tls, { TLSSocket, TlsOptions, Server } from 'tls';

export default class TLSServer {

    public start(): void {
        const port: number = Number(process.env.PORT) || 8085;
        const host: string = process.env.HOST || 'localhost';

        this.createServer().listen({ host, port }, (): void =>
            logger.success('TLSServer listening on port'.yellow, `${port}`.rainbow));
    }

    private setKeys(): ICerts | undefined {
        try {
            return {
                key: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.key')),
                cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.crt')),
                ca: fs.readFileSync(path.resolve(__dirname, '../../ssl/rootCA.crt'))
            };
        } catch (error) {
            logger.error(error);
        }
    }

    private createServer(): Server {
        const keys = this.setKeys() as TlsOptions;

        return tls.createServer(keys, (socket: TLSSocket): void => {
            logger.debug(`Client connected!`.bold);

            socket
                .on('end', (): void => logger.debug('Socket ended.'))
                .on('close', (): void => logger.debug('Socket closed.'))
                .on('error', (error: Error): void => logger.error(error))
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
        Event.once(Events.emailError, (error): void => {
            socket.write(JSON.stringify({ error }));
            socket.end();
        });
    }

}