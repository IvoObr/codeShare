import { UserDal } from '@db';
import { Jwt, ServerError } from '@lib';
import { IClientData, Errors, IUser } from '@utils';
import { Request, Response, NextFunction } from 'express';
    
export default async function authenticate(request: Request, response: Response, next: NextFunction): Promise<void> {
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

        request.body.userId = clientData.id;
        request.body.userRole = clientData.role;

        next();

    } catch (error) {
        ServerError.handle(tokenError, response); 
    }
}