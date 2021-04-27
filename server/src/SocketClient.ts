import net from 'net';
import { logger } from '@utils';

export default class SocketClient {

    public connect(): void {
        const client: net.Socket = net.createConnection({
            port: 8085
        });

        client.on('data', (data: Buffer): void => {
            logger.success(`Socket data received: ${data}`);
        });

        client.on('close', (had_error: boolean): void => {
            had_error && logger.error(`Socket closed with error.`);
        });

        client.on("close", listener: (had_error: boolean) => void): this;
        client.on("connect", listener: () => void): this;
        client.on("data", listener: (data: Buffer) => void): this;
        client.on("drain", listener: () => void): this;
        client.on("end", listener: () => void): this;
        client.on("error", listener: (err: Error) => void): this;
        client.on("lookup", listener: (err: Error, address: string, family: string | number, host: string) => void): this;
        client.on("timeout", listener: () => void): this;
    }
}