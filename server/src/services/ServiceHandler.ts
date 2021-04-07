import logger from '@logger';
import { Response } from "express";
import { Errors, StatusCodes } from '@enums';

export default abstract class ServiceHandler {

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