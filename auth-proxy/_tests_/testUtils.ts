import colors from 'colors';
import logger from '../src/lib/logger';
import https, { RequestOptions } from 'https';
import { StatusCodes } from '../src/lib/enums';
import { ClientRequest, IncomingMessage } from 'http';
import { ICallback, IFunc } from './interfaces';
colors.enable();

/**
 * Executes https request to Proxy, handles errors
 * @param options 
 * @param payload 
 * @param callback 
 * @returns response from Proxy via callback
 */
export async function httpsRequest(options: RequestOptions, payload: string, callback: ICallback): Promise<unknown> {
    return new Promise((resolve: IFunc, reject: IFunc): void => {
        
        const request: ClientRequest = https.request(options, (message: IncomingMessage): void => {
            const statusCode: number = Number(message?.statusCode);

            // Todo: handle UNAUTHORIZED
            // const response: AxiosResponse | undefined = error?.response;
            // const status: string = response?.status?.toString()?.cyan || 'NOT_HERE';

            // if (statusCode === StatusCodes.UNAUTHORIZED) {
            //     expect(response?.status).toBe(statusCode);
            //     return;
            // }

            // logger.info(path, status, response?.data?.error || error);
            // expect(typeof error).not.toBeDefined();

            message.on('end', function(data: Buffer) {
                const endpoint: string = `${options.method} ${options.path}`.yellow;
                const status: string = `${message.statusCode} ${message.statusMessage}`.cyan;
                const notification: string = `${endpoint} ${status}`;

                logger.info('SUCCESS'.green.bold, notification);
                callback(message, data);
                resolve();
            });
            
            message.on('data', function(data: Buffer) {
                const endpoint: string = `${options.method} ${options.path}`.yellow;
                const status: string = `${message.statusCode} ${message.statusMessage}`.cyan;
                const notification: string = `${endpoint} ${status} \n ${data.toString().italic}`;
                
                if (statusCode >= StatusCodes.BAD_REQUEST) {
                    logger.info('ERROR'.red.bold, notification);
                    expect(statusCode).toBeLessThan(StatusCodes.BAD_REQUEST);
                    reject(statusCode);
                }

                logger.info('SUCCESS'.green.bold, notification);
                callback(message, data);
                resolve();
            });
        });

        request.on('error', function(error: Error) {
            logger.error(error);
            reject(error);
        });

        request.write(payload);
        request.end();
    });
}