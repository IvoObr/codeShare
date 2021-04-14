import { IRouteWrapper } from '@utils';
import { Request, Response, NextFunction } from "express";

class AsyncWrapper {

    /** Enables Express route handlers to use async/await
     * @param route handler function
     * @returns Promise wrapped function
     **/
    public wrap = (handler: any): IRouteWrapper => {
        return (request: Request, response: Response, next: NextFunction): void => {
            Promise
                .resolve(handler(request, response, next))
                .catch((error): void => next(error));
        };
    }
}

export default new AsyncWrapper();