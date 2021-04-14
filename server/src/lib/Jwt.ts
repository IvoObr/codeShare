import jwt from 'jsonwebtoken';
import Helpers from './Helpers';
import { Errors, IClientData, logger } from '@utils';

class Jwt {

    private readonly secret: string = process.env.JWT_SECRET || Helpers.genBase36Key();

    public sign(payload: IClientData): string {
        return jwt.sign(payload, this.secret);
    }

    public verify(token: string): IClientData {
        try {
            return jwt.verify(token, this.secret) as IClientData;

        } catch (error) {
            logger.error(error);
            throw new Error(Errors.FORBIDDEN);
        }
    }
}

export default new Jwt();