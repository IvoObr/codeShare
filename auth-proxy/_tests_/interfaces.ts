import { IStrings } from '../src/lib/interfaces';
import { UserRole } from '../src/lib/enums';

export interface IHeaders {
    headers: IStrings
}

export interface INewUserReq {
    name: string;
    email: string;
    role: UserRole;
    password: string;
}

export interface ICerts {
    key: Buffer;
    cert: Buffer;
    ca: Buffer;
}