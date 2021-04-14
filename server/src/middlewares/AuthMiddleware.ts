import { Jwt, ErrorHandler } from '@lib';
import { IClientData, Errors } from '@utils';
import { Request, Response, NextFunction } from 'express';

class AuthMiddleware {

    private handlerError = ErrorHandler.handle;
    
    public authenticate = (request: Request, response: Response, next: NextFunction): void => {
        try {
            const token: string = request.headers.authorization?.split(' ')[1] || '';

            if (!token) {
                throw new Error(Errors.UNAUTHORIZED);
            }
       
            const clientData: IClientData = Jwt.verify(token);

            request.body.userId = clientData.id;
            request.body.userRole = clientData.role;

            next();

        } catch (error) {
            this.handlerError(new Error(Errors.UNAUTHORIZED), response);
        }
    }
}

export default new AuthMiddleware();

