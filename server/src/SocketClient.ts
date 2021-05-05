import Net from 'net';
import { logger } from '@utils';

export default class SocketClient {

    public connect = (port: number): Net.Socket => 
        Net.createConnection({ port })
            .on('end', this.onEnd)
            .on('data', this.onData)
            .on('close', this.onClose)
            .on('error', this.onError)
            .on('timeout', this.onTimeout)
            .on('connect', this.onConnect)
    
    private onError = (error: Error) => logger.error(error)
    private onEnd = () => logger.info('Socket ended.')
    private onClose = () => logger.info('Socket closed.')
    private onTimeout = () => logger.info('Socket timeout.')     
    private onConnect = () => logger.info('Socket connected.')
    private onData = (data: Buffer) => logger.info(`Socket data: ${data}`)
}