import UserDal from '../db/UserDal';
import { Errors } from '../lib/enums';
import JwtService from './JwtService';
import ServerError from './ServerError';
import { IClientData, IUser } from '../lib/interfaces';
import { Request, Response, NextFunction } from 'express';
    
export default class AuthorizationService {
    
    public static authorizeJWT(request: Request, response: Response, next: NextFunction): void {
        const tokenError: ServerError = new ServerError(Errors.UNAUTHORIZED, `Token not valid.`);
        try {
            if (request.url.includes('/pub/')) {
                next();
                return;
            }

            const token: string = request.headers.authorization?.split(' ')[1] || '';
            
            if (!token) {
                throw tokenError;
            }
       
            const clientData: IClientData = JwtService.verify(token);

            UserDal.getUserByToken(token).then((user: IUser): void => { 
                if (!user) {
                    ServerError.handle(tokenError, response);
                    return;
                }

                request.body.userId = clientData._id;
                request.body.userRole = clientData.role;

                next();
            });

        } catch (error) {
            ServerError.handle(tokenError, response); 
        }
    }
}