import randomString from 'randomstring';
import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';

interface IClientData {
    id: number;
    role: number;
}

export class JwtService {

    private readonly secret: string;
    private readonly VALIDATION_ERROR: string = 'JSON-web-token validation failed.';

    constructor() {
        this.secret = (process.env.JWT_SECRET || randomString.generate(100));
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
