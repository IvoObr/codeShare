import { UserDal } from '@db';
import { Jwt, ServerError } from '@lib';
import { Request, Response, NextFunction } from 'express';
import { IClientData, Errors, IUser, IStrings, UserRole, logger } from '@utils';
    
class AuthorizationService {
    
    public static async authorizeJWT(request: Request, response: Response, next: NextFunction): Promise<void> {
        const tokenError: ServerError = new ServerError(Errors.UNAUTHORIZED, `Token not valid.`);
        try {
            const token: string = request.headers.authorization?.split(' ')[1] || '';
            
            if (!token) {
                throw tokenError;
            }
       
            const clientData: IClientData = Jwt.verify(token);
            const user: IUser = await UserDal.getUserByToken(token);

            if (!user) {
                throw tokenError;
            }

            request.body.userId = clientData._id;
            request.body.userRole = clientData.role;

            next();

        } catch (error) {
            ServerError.handle(tokenError, response); 
        }
    }

    public static authorizeAdmin(request: Request, response: Response, next: NextFunction): void {
        try {
            const { userRole, userId }: IStrings = request.body;

            if (userRole !== UserRole.Admin) {
                logger.debug(`${Errors.FORBIDDEN} userId: ${userId.bold} is not Admin.`);
                throw new ServerError(Errors.FORBIDDEN, `User must be Admin.`);
            }

            next();
            
        } catch (error) {
            ServerError.handle(error, response);
        }
    }
}

export const { authorizeJWT, authorizeAdmin }: typeof AuthorizationService = AuthorizationService;