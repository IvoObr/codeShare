import jwt from 'jsonwebtoken';
import { Errors } from '../lib/enums';
import ServerError from './ServerError';
import { IClientData } from '../lib/interfaces';

class JwtService {

    private readonly secret: string = String(process.env.JWT_SECRET);

    public sign = (payload: IClientData): string => jwt.sign(payload, this.secret);

    public verify(token: string): IClientData {
        try {
            return jwt.verify(token, this.secret) as IClientData;

        } catch (error) {
            throw new ServerError(Errors.FORBIDDEN, 'Token not valid.');
        }
    }
}

export default new JwtService();