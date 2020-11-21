/* eslint-disable @typescript-eslint/ban-ts-comment */
import StatusCodes from 'http-status-codes';
import { Request, Response, NextFunction } from 'express';

import { UserRoles } from '@entities/User';
import { JwtService } from '@shared/JwtService';
// import { IRequest } from '@shared/constants';
import { UserRequest } from '@lib/interfaces';

const jwtService = new JwtService();
const { UNAUTHORIZED } = StatusCodes;

export default class Middleware {
    /* Middleware to verify if user is an admin */
    public static adminMW = async (req: Request, res: Response, next: NextFunction) => {
        try {
            /* Get json-web-token */
            const jwt = req.header('x-auth');

            if (!jwt) {
                throw Error('JWT not present in request.');
            }
            /* Make sure user role is an admin */
            const clientData = await jwtService.decodeJwt(jwt);
            if (clientData.role === UserRoles.Admin) {
                res.locals.userId = clientData.id;
                next();
            } else {
                throw Error('JWT not present in request.');
            }
        } catch (err) {
            return res.status(UNAUTHORIZED).json({
                error: err.message,
            });
        }
    }

    // todo use this middleware!!!
    public static authenticate = (req: any, res: Response, next: NextFunction) => {
        const token = req.header('x-auth');

        //@ts-ignore
        const user: any // todo get user by token

        req.user = user;
        req.token = token;
        next();

        // }).catch((error) => {
        //     res.status(401).send();
        // });
    }
}

