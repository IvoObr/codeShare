import { UserDal } from '@db';
import { ServerError } from '@services';
import { Request, Response, NextFunction } from 'express';
import { Errors, IStrings, UserRole, logger, UserStatus, IUser } from '@utils';

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

    public static async validateAccountStatus(request: Request, response: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, email }: IStrings = request.body;
            let user: IUser | null = null;

            if (userId) {
                user = await UserDal.getUserById(userId);
            }
            else if (email) {
                user = await UserDal.getUserByEmail(email);
            }
                
            if (!user) {
                logger.debug(`${Errors.FORBIDDEN} User email: ${email?.bold} id: ${userId} not found.`);
                throw new ServerError(Errors.FORBIDDEN, `User email: ${email} id: ${userId} not found.`);
            }

            if (user.status !== UserStatus.Active) {
                logger.debug(`${Errors.FORBIDDEN} userId: ${userId?.bold} is not Active.`);
                throw new ServerError(Errors.FORBIDDEN, `User account must be active. Email: ${email}`);
            }

            next();

        } catch (error: any) {
            ServerError.handle(error, response);
        }
    }

    public static async validateLogin(request: Request, response: Response, next: NextFunction): Promise<void> {
        const loginError: ServerError = new ServerError(Errors.UNAUTHORIZED, `User not logged in.`);
        try {
            if (request.url.includes('/pub/')) {
                next();
                return;
            }

            const isLoggedIn: boolean = await UserDal.getUserLogin(request.body.userId);

            if (!isLoggedIn) {
                ServerError.handle(loginError, response);
                return;
            }

            next();

        } catch (error: unknown) {
            ServerError.handle(loginError, response);
        }
    }
}

export const {
    validateLogin,
    authorizeAdmin,
    validateAccountStatus
}: typeof AuthorizationService = AuthorizationService;