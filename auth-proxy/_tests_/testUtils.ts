import colors from 'colors';
import logger from '../src/lib/logger';
import https, { RequestOptions } from 'https';
import { StatusCodes } from '../src/lib/enums';
import { ICallback, IFunc } from './interfaces';
import { ClientRequest, IncomingMessage } from 'http';
colors.enable();

/**
 * Executes https request to Proxy, handles errors
 * @param options 
 * @param payload 
 * @param callback 
 * @returns response from Proxy via callback
 */
export async function httpsRequest(options: RequestOptions, payload: string, callback: ICallback, expectedCode?: StatusCodes): Promise<unknown> {
    return new Promise((resolve: IFunc, reject: IFunc): void => {
        
        const request: ClientRequest = https.request(options, (message: IncomingMessage): void => {
            const statusCode: StatusCodes = Number(message?.statusCode);
            const data: Array<Buffer> = [];

            function tryParseData(data: string): unknown {
                try {
                    return JSON.parse(data);
                } catch (error: unknown) {
                    return data;
                }
            }

            function log(result: string, parsedData: unknown): void {
                const endpoint: string = `${options.method} ${options.path}`.yellow;
                const status: string = `${message.statusCode} ${message.statusMessage}`.cyan;
                logger.info(result.bold, endpoint, status, '\n', parsedData);
            }

            message
                .on('data', (chunk: Buffer): number => data.push(chunk))
                .on('end', function() {
                    const dataString: string = Buffer.concat(data).toString();
                    const parsedData: unknown = tryParseData(dataString);
                    
                    // TODO: refactor repetitions

                    if (expectedCode && statusCode === expectedCode) {
                        const expected: string = ' EXPECT '.green + expectedCode + ' RECEIVE '.green + statusCode;
                        log('SUCCESS'.green + expected, parsedData);
                        expect(statusCode).toBe(expectedCode);
                        resolve();
                        return;
                    }

                    if (expectedCode && statusCode !== expectedCode) {
                        const expected: string = ' EXPECT '.red + expectedCode + ' RECEIVE '.red + statusCode;
                        log('ERROR'.red + expected, parsedData);
                        expect(statusCode).toBe(expectedCode);
                        resolve();
                        return;
                    }

                    if (statusCode < StatusCodes.BAD_REQUEST) {
                        log('SUCCESS'.green, parsedData);
                        callback(message, dataString);
                        resolve();
                        return;
                    }

                    if (statusCode >= StatusCodes.BAD_REQUEST) {
                        log('ERROR'.red, parsedData);
                        callback(message, dataString);
                        expect(statusCode).toBeLessThan(StatusCodes.BAD_REQUEST);
                        resolve();                     
                    }
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