import { IMiddleware } from '@utils';
import { Request, Response, NextFunction } from "express";

/** Enables Express middleware to use async/await by wrapping the function in Promise
 * @param > async middleware function
 * @returns > sync middleware function
 */
export const async = (handler: IMiddleware['async']): IMiddleware['sync'] =>
    (request: Request, response: Response, next: NextFunction): Promise<void> =>
        Promise.resolve(handler(request, response, next)).catch((error) => next(error));