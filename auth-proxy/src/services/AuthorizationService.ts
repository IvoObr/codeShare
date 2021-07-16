import logger from '../lib/logger';
import UserDal from '../db/UserDal';
import { Errors } from '../lib/enums';
import JwtService from './JwtService';
import ServerError from './ServerError';
import tls, { TLSSocket, PeerCertificate } from 'tls';
import { IClientData, IUser } from '../lib/interfaces';
import { Request, Response, NextFunction } from 'express';

export default class AuthorizationService {

    public static validateSSL(request: Request, response: Response, next: NextFunction): void {
        try {

            logger.warn(request.body);

            const socket = request.socket as TLSSocket;
            const certificate = socket.getCertificate() as PeerCertificate;




            logger.success(Object.entries(certificate));
            logger.success(certificate.valid_from)
            logger.success(certificate.valid_to)


            /**
             * openssl genrsa -out rootCA.key 4096
             * openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -out rootCA.crt
             * openssl genrsa -out localhost.key 2048
             * openssl req -new -sha256 -key localhost.key -subj "/\.C=BG/ST=SF/O=7devWorks/CN=localhost" -out localhost.csr
             * openssl req -in localhost.csr -noout -text
             * openssl x509 -req -in localhost.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out localhost.crt -days 3650 -sha256
             * openssl x509 -in localhost.crt -text -noout
             */


            if (!(request as any)?.client?.authorized) {
                // throw  new ServerError(Errors.UNAUTHORIZED, `SSL not valid.`);
            }

            next();

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public static validateJwt(request: Request, response: Response, next: NextFunction): void {
        const tokenError: ServerError = new ServerError(Errors.UNAUTHORIZED, `Token not valid.`);
        try {
            if (request.url.includes('/pub/')) {
                next();
                return;
            }

            const token: string = request.headers.authorization?.split(' ')[1] || '';

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

        } catch (error) {
            ServerError.handle(tokenError, response);
        }
    }
}