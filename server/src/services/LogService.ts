import { logger } from '@utils';
import { Request, Response, NextFunction } from 'express';

export default class LogService {

    private static getColoredStatus(statusCode: number): string {
        const status: string = statusCode.toString();

        if (statusCode >= 500) return status.red; 
        if (statusCode >= 400) return status.yellow; 
        if (statusCode >= 300) return status.cyan; 
        if (statusCode >= 200) return status.green; 

        return status;
    }

    public static logCalls(request: Request, response: Response, next: NextFunction): void {
        const startTime: number = new Date().valueOf();

        response.on('finish', (): void => { 
            const status: string = LogService.getColoredStatus(response.statusCode);
            const method: string = response?.req?.method as string;
            const url: string = response?.req?.originalUrl as string;
            const endTime: number = new Date().valueOf() - startTime;

            logger.info(method, url, status, endTime + 'ms');
        });

        next();
    }
}