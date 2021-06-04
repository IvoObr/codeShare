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

                case Errors.NOT_FOUND:
                    response
                        .status(StatusCodes.NOT_FOUND)
                        .json({ error: errorMessage });
                    break;

                default:
                    response
                        .status(StatusCodes.BAD_REQUEST)
                        .json({ error: errorMessage });
                    break;
            }
        } else {
            logger.error(error: unknown);
            response
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: StatusCodes[500] });
        }
    }
}