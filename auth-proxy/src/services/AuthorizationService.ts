import { TLSSocket } from 'tls';
import logger from '../lib/logger';
import UserDal from '../db/UserDal';
import { Errors } from '../lib/enums';
import JwtService from './JwtService';
import ServerError from './ServerError';
import { IClientData, IUser } from '../lib/interfaces';
import { Request, Response, NextFunction } from 'express';
    
export default class AuthorizationService {

    public static validateSSL(request: Request, response: Response, next: NextFunction): void {
        try {

            logger.warn(request.body);

            // https://nodejs.org/dist/latest-v14.x/docs/api/tls.html#tls_tlssocket_getpeercertificate_detailed

            const cert = (request.socket as TLSSocket).getPeerCertificate();
            cert.raw = Buffer.from('1');
            (cert as any).pubkey = null;
            const cert2 = (request.socket as TLSSocket).getCertificate();

            // logger.debug(JSON.stringify(cert, null, 2));
            logger.warn('=============================================');
            // logger.debug(JSON.stringify(cert2, null ,2))

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