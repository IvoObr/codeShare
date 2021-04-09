import { JwtService } from '../lib/JwtService';
import MiddlewareHandler from './MiddlewareHandler';
import { Request, Response, NextFunction } from 'express';
import { UserRolesType, StatusCodes, IClientData, Headers, logger, Errors } from '@lib';

class AuthMiddleware {
    
    private jwtService = new JwtService(); // todo test
    private handleError = MiddlewareHandler.handleError;
    
    public authenticate = (request: Request<any>, response: Response, next: NextFunction): void => {
        try {

            const [type, token]: string[] = request.headers.authorization?.split(' ') as string[];

            logger.info(type);
            logger.info(token);

            if (!type || !token) {
                throw new Error(Errors.ERROR_UNAUTHORIZED);
            }

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
            this.handleError(new Error(Errors.ERROR_UNAUTHORIZED), response);
        }
    }

    /* Middleware to verify if user is an admin */
    public adminMW = async (req: Request, res: Response, next: NextFunction) => {
        try {
            /* Get json-web-token */
            const authHeader: string = req.header(Headers.Authorization) as string;
            const [type, jwt]: string[] = authHeader.split(' ');

            if (!jwt) {
                throw Error('JWT not present in request.');
            }
            /* Make sure user role is an admin */
            const clientData: IClientData = await this.jwtService.decodeJwt(jwt);
            if (clientData.role === UserRolesType.Admin) {
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

