import UserDal from '../db/UserDal';
import { Errors } from '../lib/enums';
import JwtService from './JwtService';
import ServerError from './ServerError';
import { IClientData, IUser } from '../lib/interfaces';
import { Request, Response, NextFunction } from 'express';

export default class AuthorizationService {

    /** Generate self signed SSL
     *  openssl genrsa -out rootCA.key 4096
     *  openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.crt
     *  openssl genrsa -out codeShare.key 2048
     *  openssl req -new -sha256 -key codeShare.key -subj "/\.C=BG/ST=SF/O=7devWorks/CN=localhost" -out codeShare.csr
     *  openssl req -in codeShare.csr -noout -text
     *  openssl x509 -req -in codeShare.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out codeShare.crt -days 36500 -sha256
     *  openssl x509 -in codeShare.crt -text -noout
     */

    public static validateJwt(request: Request, response: Response, next: NextFunction): void {
        const tokenError: ServerError = new ServerError(Errors.UNAUTHORIZED, `Token not valid.`);
        try {
            if (request.url.includes('/pub/')) {
                next();
                return;
            }

            const token: string = request.headers.authorization?.split(' ')[1] || request.query.token as string;

            if (!token) {
                throw tokenError;
            }

            const clientData: IClientData = JwtService.verify(token);

            UserDal.getUserByToken(token).then((user: IUser): void => {
                if (!user) {
                    ServerError.handle(tokenError, response);
                    return;
                }

                request.body.userId = clientData._id;
                request.body.userRole = clientData.role;

                next();
            });

        } catch (error: unknown) {
            ServerError.handle(tokenError, response);
        }
    }
}