import { RouteHandler } from '@lib';
import { Router, Request, Response, NextFunction } from "express";

export default abstract class ApiRouter {

    protected abstract router: Router;
    public abstract getRouter(): Router; 
    protected abstract initRoutes(): void;

    /** Enables Express route handlers to use async/await
     * @param - route handler function
     * @returns - Promise wrapping function
     **/
    protected asyncWrap = (handler: any): RouteHandler => {
        return (request: Request, response: Response, next: NextFunction): void => {
            Promise
                .resolve(handler(request, response, next))
                .catch((error): void => next(error));
        };
    }
}