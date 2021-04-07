import Helpers from '@helpers';
import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';
import { IClientData } from '@interfaces';

export class JwtService {

    private readonly secret: string;
    private readonly VALIDATION_ERROR: string = 'JSON-web-token validation failed.';

    constructor() {
        this.secret = (process.env.JWT_SECRET || Helpers.genBase36Key(50));
    }

    public createJWT(data: IClientData): Promise<string> {
        return new Promise((resolve, reject) => {

            jsonwebtoken.sign(data, this.secret, { expiresIn: '1 day' }, (err, token) => {
                err ? reject(err) : resolve(token as string);
            });
        });
    }

    public decodeJwt(jwt: string): Promise<IClientData> {
        return new Promise((res, rej) => {
            jsonwebtoken.verify(jwt, this.secret, (err: VerifyErrors | null, decoded?: any) => {
                return err ? rej(this.VALIDATION_ERROR) : res(decoded as IClientData);
            });
        });
    }
}
