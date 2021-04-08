import { IUserRequest, Headers } from '@lib';
import { JwtService } from '../lib/JwtService';
import { Response, NextFunction } from 'express';

export default class AuthMiddleware {

    private static jwtService = new JwtService(); // todo test

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

