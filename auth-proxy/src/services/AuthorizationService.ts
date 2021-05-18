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
}

export const { authorizeJWT }: typeof AuthorizationService = AuthorizationService;