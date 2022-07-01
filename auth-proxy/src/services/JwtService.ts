import jwt from 'jsonwebtoken';
import logger from '../lib/logger';
import { Errors } from '../lib/enums';
import ServerError from './ServerError';
import genBase36Key from '../lib/genBase36Key';
import { IClientData } from '../lib/interfaces';

class JwtService {

    private readonly secret: string = process.env.JWT_SECRET || genBase36Key();

    public verify(token: string): IClientData {
        try {
            return jwt.verify(token, this.secret) as IClientData;

        } catch (error) {
            logger.error(error);
            throw new ServerError(Errors.FORBIDDEN, 'Token not valid.');
        }
    }
}

export default new JwtService();