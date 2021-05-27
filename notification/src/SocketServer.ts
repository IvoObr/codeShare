import Net from 'net';
import logger from './lib/logger';
import { Events } from './lib/enums';
import Event from './lib/EventEmitter';
import { IMailInfo } from './lib/interfaces';

export default class SocketServer {
    private port: number = Number(process.env.PORT) || 8085;
    private host: string = process.env.HOST || 'localhost';

    public start(): void {
        const settings = {
            host: this.host,
            port: this.port
        };
            
        Net.createServer()
            .on('connection', this.onConnection)
            .on('error', (error: Error): void => logger.error(error))
            .listen(settings, (): void => logger.success(`SocketServer listening on port ${this.port}`.yellow));
    }

    private onConnection = (socket: Net.Socket): void => {
        logger.debug(`Client connected!`.bold);

        socket
            .on('end', (): void => logger.debug('Socket ended.'))
            .on('close', (): void => logger.debug('Socket closed.'))
            .on('error', (error: Error): void => logger.error(error))
            .on('timeout', (): void => logger.debug('Socket timeout.'))
            .on('connect', (): void => logger.debug('Socket connected.'))
            .on('data', (data: Buffer): void => this.onData(data, socket));
    }

    private onData(data: Buffer, socket: Net.Socket): void {
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