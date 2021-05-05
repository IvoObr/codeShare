import Net from 'net';
import logger from './lib/logger';

export default class SocketServer {

    public start(): void {
        const port: number = 8085;
        const host: string = 'localhost';
        const server: Net.Server = Net.createServer();

        server.listen({ host, port }, (): void => 
            logger.success(`SocketServer listening on port ${port}`.yellow)
        );

        server.on('connection', (socket: Net.Socket): void => {
            logger.success(`Client connected!`.bold);
            socket.write('Welcome to MailerSocket!'.cyan);

            socket.on('end', this.onEnd)
                .on('data', (data: Buffer) => this.onData(data, socket))
                .on('close', this.onClose)
                .on('error', this.onError)
                .on('timeout', this.onTimeout)
                .on('connect', this.onConnect)
    


        });

        server.on('data', (chunk): void => {
            logger.info(chunk);
            logger.info(`Data: `, chunk.toString());
        });

        server.on('end', function (data) {
            logger.info(data);
            logger.info('Closing connection with the client');
        });

        server.on('error', function (error) {
            logger.error(error)
            process.exit(0); /* clean exit */
        });
    }

    private onError = (error: Error) => logger.error(error)
    private onEnd = () => logger.info('MailerSocket ended.')
    private onClose = () => logger.info('MailerSocket closed.')
    private onTimeout = () => logger.info('MailerSocket timeout.')
    private onConnect = () => logger.info('MailerSocket connected.')

    private onData = (data: Buffer, socket: Net.Socket) => {
        logger.info(`MailerSocket data: ${data}`)
        socket.write('Poluchih!'.cyan);
    }

}