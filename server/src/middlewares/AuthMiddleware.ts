import { UserDal } from '@db';
import { Jwt, ErrorHandler } from '@lib';
import { IClientData, Errors, logger, IUser } from '@utils';
import { Request, Response, NextFunction } from 'express';

class AuthMiddleware {

    private handleError = ErrorHandler;
    
    public authenticate = (request: Request, response: Response, next: NextFunction): void => {
        try {
            const token: string = request.headers.authorization?.split(' ')[1] || '';

            if (!token) {
                throw new Error(Errors.UNAUTHORIZED);
            }
       
            const clientData: IClientData = Jwt.verify(token);

            UserDal.getUserByToken(token)
                .then((user: IUser) => {
                    if (!user) {
                        throw new Error(Errors.UNAUTHORIZED);
                    }

                    request.body.userId = clientData.id;
                    request.body.userRole = clientData.role;

                    next();
                }).catch(error => {
                    this.handleError(new Error(Errors.UNAUTHORIZED), response); 
                });

        } catch (error) {
            this.handleError(new Error(Errors.UNAUTHORIZED), response);
        }
    }
}

export default new AuthMiddleware();

