import { Request, Response, NextFunction } from "express";
import { Errors, logger, RouteHandler, StatusCodes } from '@lib';

class MiddlewareHandler {

    /** Enables Express route handlers to use async/await
     * @param - route handler function
     * @returns - Promise wrapping function
     **/
    public asyncWrap = (handler: any): RouteHandler => {
        return (request: Request, response: Response, next: NextFunction): void => {
            Promise
                .resolve(handler(request, response, next))
                .catch((error): void => next(error));
        };
    }

    public handleError(error: Error, response: Response): void {
        logger.error(error);
       
        if (error.message in Errors) {
            switch (error.message) {
                case Errors.ERROR_UNAUTHORIZED:
                    response
                        .status(StatusCodes.UNAUTHORIZED)
                        .json({ error: error.message });
                    break;
                
                case Errors.ERROR_LOGIN_FAILED:
                    response
                        .status(StatusCodes.UNAUTHORIZED)
                        .json({ error: error.message });
                    break;
                
                default:
                    response
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ error: error.message });
                    break;
            } 
        } else {
            response
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: StatusCodes[500] });
        }
    }
}

export default new MiddlewareHandler();