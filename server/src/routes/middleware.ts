import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';
import { UserRolesType } from '@enums';
import { JwtService } from '../lib/JwtService';
import { UserRequest, IRequest } from '@interfaces';
import * as Consts from '@constants';

const jwtService = new JwtService();
const { UNAUTHORIZED } = StatusCodes;

export default class Middleware {
    /* Middleware to verify if user is an admin */
    public static adminMW = async (req: Request, res: Response, next: NextFunction) => {
        try {
            /* Get json-web-token */
            const jwt = req.header(Consts.xAuth);

            if (!jwt) {
                throw Error('JWT not present in request.');
            }
            /* Make sure user role is an admin */
            const clientData = await jwtService.decodeJwt(jwt);
            if (clientData.role === UserRolesType.Admin) {
                res.locals.userId = clientData.id;
                next();
            } else {
                throw Error('JWT not present in request.');
            }
        } catch (err) {
            return res.status(UNAUTHORIZED).json({
                error: err.message
            });
        }
    }

    // TODO use this middleware!!!
    public static authenticate = (req: UserRequest, res: Response, next: NextFunction) => {
        const token = req.header(Consts.xAuth) as string;

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

