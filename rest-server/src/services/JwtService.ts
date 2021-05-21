import jwt from 'jsonwebtoken';
import { genBase36Key } from '@lib';
import { ServerError } from '@services';
import { Errors, IClientData } from '@utils';

class JwtService {

    private readonly secret: string = process.env.JWT_SECRET || genBase36Key();

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