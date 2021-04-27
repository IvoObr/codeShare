import net from 'net';
import logger from './lib/logger';

export default class SocketServer {

    public start(): void {
        const port: number = 8085;
        const host: string = 'localhost';
        const server: net.Server = net.createServer();

        server.listen({ host, port }, (): void => {
            logger.success(`SocketServer listening on port ${port}`.yellow);
  
        });

        server.on('connection', (client: net.Socket): void => {
            logger.success(`Client connected!`);
            // logger.debug(client);
            client.write('Welcome to MailerSocket!'.cyan);

        });
    }

}