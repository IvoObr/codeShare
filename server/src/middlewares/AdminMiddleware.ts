import { JwtService } from '../lib/JwtService';
import { Request, Response, NextFunction } from 'express';
import { UserRolesType, StatusCodes, IClientData, Headers } from '@lib';

export default class AdminMiddleware {

    private static jwtService = new JwtService(); // todo test

    /* Middleware to verify if user is an admin */
    public static adminMW = async (req: Request, res: Response, next: NextFunction) => {
        try {
            /* Get json-web-token */
            const authHeader: string = req.header(Headers.Authorization) as string;
            const [type, jwt]: string[] = authHeader.split(' ');

            if (!jwt) {
                throw Error('JWT not present in request.');
            }
            /* Make sure user role is an admin */
            const clientData: IClientData = await AdminMiddleware.jwtService.decodeJwt(jwt);
            if (clientData.role === UserRolesType.Admin) {
                res.locals.userId = clientData.id;
                next();
            } else {
                throw Error('JWT not present in request.');
            }
        } catch (err) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: err.message
            });
        }
    }
}

