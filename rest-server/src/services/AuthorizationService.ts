import { ServerError } from '@services';
import { Request, Response, NextFunction } from 'express';
import { Errors, IStrings, UserRole, logger } from '@utils';

class AuthorizationService {

    public static authorizeAdmin(request: Request, response: Response, next: NextFunction): void {
        try {
            const { userRole, userId }: IStrings = request.body;

            if (userRole !== UserRole.Admin) {
                logger.debug(`${Errors.FORBIDDEN} userId: ${userId?.bold} is not Admin.`);
                throw new ServerError(Errors.FORBIDDEN, `User must be Admin.`);
            }

            next();

        } catch (error: any) {
            ServerError.handle(error, response);
        }
    }
}

export const { authorizeAdmin }: typeof AuthorizationService = AuthorizationService;