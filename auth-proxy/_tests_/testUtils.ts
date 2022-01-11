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

            // message.on('end', function(data: Buffer) {
            //     const result: any = data && JSON.parse(data?.toString());

            //     const endpoint: string = `${options.method} ${options.path}`.yellow;
            //     const status: string = `${message.statusCode} ${message.statusMessage}`.cyan;
            //     const notification: string = `${endpoint} ${status} \n ${result?.italic}`;

            //     logger.info('END'.cyan.bold, notification);
            //     // callback(message, result);
            //     // resolve();
            // });

            const data: Array<Buffer> = [];

            function tryParseData(data: string): unknown {
                try {
                    return JSON.parse(data);
                } catch (error: unknown) {
                    return data;
                }
            }

            message
                .on('data', (chunk: Buffer): number => data.push(chunk))
                .on('end', function() {
                    const dataString: string = Buffer.concat(data).toString();
                    const parsedData: unknown = tryParseData(dataString);
                    const endpoint: string = `${options.method} ${options.path}`.yellow;
                    const status: string = `${message.statusCode} ${message.statusMessage}`.cyan;
                
                    if (statusCode >= StatusCodes.BAD_REQUEST) {
                        logger.info('ERROR'.red.bold, endpoint, status, '\n', parsedData);
                        expect(statusCode).toBeLessThan(StatusCodes.BAD_REQUEST);
                        reject(statusCode);
                    }

                    logger.info('SUCCESS'.green.bold, endpoint, status, '\n', parsedData);
                    callback(message, dataString);
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