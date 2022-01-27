import { Response } from "express";
import { Errors, logger, ResType, StatusCodes } from '@utils';

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
    static handle(error: ServerError, response: Response, type?: ResType): void {
        const errorMessage: string = `${error.type || ''} - ${error.message}`;

        if (error.type in Errors) {
            switch (error.type) {
                case Errors.UNAUTHORIZED:
                    response.status(StatusCodes.UNAUTHORIZED);
                    break;
                
                case Errors.FORBIDDEN:
                    response.status(StatusCodes.FORBIDDEN);
                    break;

                case Errors.NOT_FOUND:
                    response.status(StatusCodes.NOT_FOUND);
                    break;
                
                case Errors.SSL_HANDSHAKE_FAILED:
                    response.status(StatusCodes.SSL_HANDSHAKE_FAILED);
                    break;

                default:
                    response.status(StatusCodes.BAD_REQUEST);
                    break;                
            }

            if (type === ResType.html) {
                response.send(`<h4 style='font-family: cursive'> ${errorMessage}</h4>`);
            } else {
                response.json({ error: errorMessage });
            }

        } else {
            logger.error(error);
            response
                .status(StatusCodes.INTERNAL_SERVER_ERROR)
                .json({ error: StatusCodes[500] });
        }
    }
}