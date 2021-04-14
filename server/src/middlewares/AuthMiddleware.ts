import MiddlewareHandler from './MiddlewareHandler';
import { Request, Response, NextFunction } from 'express';
import { UserRole, StatusCodes, IClientData, Jwt, logger, Errors } from '@lib';

class AuthMiddleware {
    
    private handleError = MiddlewareHandler.handleError;
    
    public authenticate = (request: Request<any>, response: Response, next: NextFunction): void => {
        try {

            const token: string = request.headers.authorization?.split(' ')[1] || '';

            if (!token) {
                throw new Error(Errors.UNAUTHORIZED);
            }
       
            const clientData: IClientData = Jwt.verify(token);

            logger.debug('IClientData:', clientData);
            // const [type, token]: string[] = authHeader.split(' ');
            // //@ts-ignore: TODO put interface
            // const user: any; // TODO get user by token

            // req.user = user;
            // req.token = token;
            next();

            // }).catch((error) => {
            //     res.status(401).send();
            // });
        } catch (error) {
            this.handleError(new Error(Errors.UNAUTHORIZED), response);
        }
    }

    /* Middleware to verify if user is an admin */
    public adminMW = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const token: string = req.headers.authorization?.split(' ')[1] || '';

            if (!token) {
                throw Error('JWT not present in request.');
            }
            /* Make sure user role is an admin */
            const clientData: any = Jwt.verify(token);
            
            if (clientData.role === UserRole.Admin) {
                res.locals.userId = clientData.id;
                next();
            } else {
                throw Error('JWT not present in request.');
            }
        } catch (err) {
            // todo this.handleError(error, response);

            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: err.message
            });
        }
    }
}

export default new AuthMiddleware();

