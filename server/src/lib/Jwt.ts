import jwt from 'jsonwebtoken';
import { ServerError } from '@lib';
import genBase36Key from './genBase36Key';
import { Errors, IClientData } from '@utils';

class Jwt {

    private readonly secret: string = process.env.JWT_SECRET || genBase36Key();

    public sign(payload: IClientData): string {
        return jwt.sign(payload, this.secret);
    }

    public verify(token: string): IClientData {
        try {
            return jwt.verify(token, this.secret) as IClientData;

        } catch (error) {
            throw new ServerError(Errors.FORBIDDEN, 'Token not valid.');
        }
    }
}

export default new Jwt();