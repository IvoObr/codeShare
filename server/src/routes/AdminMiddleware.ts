import { Request, Response, NextFunction } from 'express';
import { UserRolesType, StatusCodes, IUserRequest, IClientData, Headers } from '@lib';
import { JwtService } from '../lib/JwtService';

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

    // TODO use this middleware!!!
    public static authenticate = (req: IUserRequest, res: Response, next: NextFunction) => {
        const authHeader: string = req.header(Headers.Authorization) as string;
        const [type, token]: string[] = authHeader.split(' ');
        //@ts-ignore: TODO put interface
        const user: any; // TODO get user by token

        req.user = user;
        req.token = token;
        next();

        // }).catch((error) => {
        //     res.status(401).send();
        // });
    }
}

