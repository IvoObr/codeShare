import { IRouteWrapper } from '@utils';
import { Request, Response, NextFunction } from "express";

/** Enables Express middleware to use async/await by wrapping the function in Promise
 * @param route handler function
 * @returns Promise wrapped function
 */
export default function async(handler: any): IRouteWrapper {
    return (request: Request, response: Response, next: NextFunction): void => {
        Promise
            .resolve(handler(request, response, next))
            .catch((error): void => next(error));
    };
}