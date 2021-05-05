import Net from 'net';
import logger from './lib/logger';
import Event from './lib/EventEmitter';

export default class SocketServer {
    private port: number = 8085;
    private host: string = 'localhost';

    public start(): void {
        const settings = {
            host: this.host,
            port: this.port
        };
            
        Net.createServer()
            .listen(settings, this.onListen)
            .on('connection', this.onConnection)
            .on('error', this.onError);
    }

    private onError = (error: Error) => logger.error(error)
    private onEnd = () => logger.info('Socket ended.')
    private onClose = () => logger.info('Socket closed.')
    private onTimeout = () => logger.info('Socket timeout.')
    private onConnect = () => logger.info('Socket connected.')
    private onListen = () => logger.success(`SocketServer listening on port ${this.port}`.yellow)

    private onConnection = (socket: Net.Socket): void => {
        logger.success(`Client connected!`.bold);

        socket
            .on('end', this.onEnd)
            .on('close', this.onClose)
            .on('error', this.onError)
            .on('timeout', this.onTimeout)
            .on('connect', this.onConnect)
            .on('data', (data: Buffer) => this.onData(data, socket));
    }

    private onData = (data: Buffer, socket: Net.Socket) => {
        logger.info(`Socket data: ${data}`);
        Event.emit('newMail', JSON.parse(data.toString()));
        socket.write('Message received!'.green);
        // socket.end()
    }

}