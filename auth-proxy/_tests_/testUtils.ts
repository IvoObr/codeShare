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

            if (statusCode >= StatusCodes.BAD_REQUEST) {
                logger.info(options.path?.red, statusCode.toString().yellow, message?.statusMessage?.yellow);
                expect(statusCode).toBeLessThan(StatusCodes.BAD_REQUEST);
                reject(statusCode);
            }

            // Todo: handle UNAUTHORIZED
            // const response: AxiosResponse | undefined = error?.response;
            // const status: string = response?.status?.toString()?.cyan || 'NOT_HERE';

            // if (statusCode === StatusCodes.UNAUTHORIZED) {
            //     expect(response?.status).toBe(statusCode);
            //     return;
            // }

            // logger.info(path, status, response?.data?.error || error);
            // expect(typeof error).not.toBeDefined();

            message.on('data', function(data: Buffer) {
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