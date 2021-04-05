import logger from '@logger';
import { Router, Response } from "express";
import { Errors, StatusCodes } from '@enums';

export default abstract class ApiRouter {

    protected abstract router: Router;

    public abstract getRouter(): Router; 

    protected abstract useMiddleware(): void;

    protected abstract initRoutes(): void;

    protected handleError(error: Error, response: Response): void {
        logger.error(error);
    
        if (error.message in Errors) {
            response
                .status(StatusCodes.BAD_REQUEST)
                .json({ error: error.message });
        } else {
            response
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: StatusCodes[500] });
        }
    }
}