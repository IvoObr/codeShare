import { IClientData, Helpers } from '@lib';
import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';

export class JwtService {

    private readonly secret: string;
    private readonly VALIDATION_ERROR: string = 'JSON-web-token validation failed.';

    constructor() {
        this.secret = (process.env.JWT_SECRET || Helpers.genBase36Key(50));
    }

    public createJWT(data: IClientData): string {
        return jsonwebtoken.sign(data, this.secret, { expiresIn: '1 day' });
    }

    public async decodeJwt(jwt: string): Promise<IClientData> {
        return await jsonwebtoken.verify(jwt, this.secret);
        
        (err: VerifyErrors | null, decoded?: any) => {
            return err ? this.VALIDATION_ERROR : decoded);
        });
     
    }
}
