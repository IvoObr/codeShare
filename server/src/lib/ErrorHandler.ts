import { Response } from "express";
import { Errors, logger, StatusCodes } from '@utils';

// export default class ErrorHandler {

/** Handles all api errors and sends response
    * @param Error
    * @param Response
    * @returns void
    **/
export default function handle(error: Error, response: Response): void {
    logger.error(error);

    if (error.message in Errors) {
        switch (error.message) {
            case Errors.UNAUTHORIZED:
                response
                    .status(StatusCodes.UNAUTHORIZED)
                    .json({ error: error.message });
                break;

            case Errors.FORBIDDEN:
                response
                    .status(StatusCodes.FORBIDDEN)
                    .json({ error: error.message });
                break;

            case Errors.LOGIN_FAILED:
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
// }