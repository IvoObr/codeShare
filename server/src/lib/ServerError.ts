import { Response } from "express";
import { Errors, logger, StatusCodes } from '@utils';

export default class ServerError extends Error {
   
    constructor(
        public type: Errors,
        public message: string) {
        super();
    }

    /** Handles all api errors and sends response
     * @param Error
     * @param Response
     * @returns void
     */
    static handle(error: ServerError, response: Response): void {
        
        const errorMessage: string = `${error.type || ''} - ${error.message}`;
        logger.debug(errorMessage);

        if (error.type in Errors) {
            switch (error.type) {
                case Errors.UNAUTHORIZED:
                    response
                        .status(StatusCodes.UNAUTHORIZED)
                        .json({ error: errorMessage });
                    break;

                case Errors.FORBIDDEN:
                    response
                        .status(StatusCodes.FORBIDDEN)
                        .json({ error: errorMessage });
                    break;

                case Errors.LOGIN_FAILED:
                    response
                        .status(StatusCodes.UNAUTHORIZED)
                        .json({ error: errorMessage });
                    break;

                default:
                    response
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ error: errorMessage });
                    break;
            }
        } else {
            logger.error(error);
            response
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: StatusCodes[500] });
        }
    }
}