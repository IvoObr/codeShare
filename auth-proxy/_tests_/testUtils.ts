import colors from 'colors';
import logger from '../src/lib/logger';
import https, { RequestOptions } from 'https';
import { StatusCodes } from '../src/lib/enums';
import { ICallback, IFunc } from './interfaces';
import { ClientRequest, IncomingMessage } from 'http';
colors.enable();

export function handleError(path: string, error: any, statusCode?: StatusCodes): void {
    
    // const response: AxiosResponse | undefined = error?.response;
    // const status: string = response?.status?.toString()?.cyan || 'NOT_HERE';

    // if (statusCode === StatusCodes.UNAUTHORIZED) {
    //     expect(response?.status).toBe(statusCode);
    //     return;
    // }

    // logger.info(path, status, response?.data?.error || error);
    // expect(typeof error).not.toBeDefined();
}

/**
 * Executes https request to Proxy
 * @param options 
 * @param payload 
 * @param callback 
 * @returns response from Proxy
 */
export async function httpsRequest(options: RequestOptions, payload: string, callback: ICallback): Promise<unknown> {
    return new Promise((resolve: IFunc, reject: IFunc): void => {
        
        const request: ClientRequest = https.request(options, (response: IncomingMessage): void => {
            if (Number(response?.statusCode) >= 400) {
                const error: Error = new Error(`${Number(response?.statusCode)}: ${response.statusMessage}`);
                callback(error, response, null);
                reject(error);
            }

            response.on('data', function(data: Buffer) {
                callback(null, response, data);
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