import net from 'net';
import { logger } from '@utils';

export default class SocketClient {

    public connect = (port: number): net.Socket =>
        net.createConnection({ port })
            .on('data', this.onData)
            .on('close', this.onClose)
            .on('error', this.onError)
            .on('timeout', this.onTimeout)
            .on('connect', this.onConnect)

    private onError = (error: Error) => logger.error(error)
    private onTimeout = () => logger.info('MailerSocket timeout.')     
    private onConnect = () => logger.info('MailerSocket connected.')
    private onData = (data: Buffer) => logger.info(`MailerSocket data: ${data}`)
    private onClose = (hadError: boolean) => hadError ? logger.error(`MailerSocket error.`) : logger.info('MailerSocket closed.')
}