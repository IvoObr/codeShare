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
            .on('error', (error: Error) => logger.error(error))
            .listen(settings, () => logger.success(`SocketServer listening on port ${this.port}`.yellow));
    }

    private onConnection = (socket: Net.Socket): void => {
        logger.success(`Client connected!`.bold);

        socket
            .on('end', () => logger.info('Socket ended.'))
            .on('close', () => logger.info('Socket closed.'))
            .on('error', (error: Error) => logger.error(error))
            .on('timeout', () => logger.info('Socket timeout.'))
            .on('connect', () => logger.info('Socket connected.'))
            .on('data', (data: Buffer) => this.onData(data, socket));
    }

    private onData = (data: Buffer, socket: Net.Socket) => {
        logger.info(`Socket data: ${data}`);
        Event.emit(Events.newMail, JSON.parse(data.toString()));

        Event.on(Events.emailSend, (mailInfo: IMailInfo) => socket.write(JSON.stringify(mailInfo)));
        Event.on(Events.emailError, (error) => socket.write(JSON.stringify({ error })));
    }

}