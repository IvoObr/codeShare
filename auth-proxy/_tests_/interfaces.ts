import { IStrings } from '../src/lib/interfaces';
import { UserRole, UserStatus } from '../src/lib/enums';

export interface IHeaders {
    headers: IStrings
}

export interface INewUserReq {
    name: string;
    email: string;
    role: UserRole;
    password: string;
}

export interface IPublicUser {
    _id: string;
    name: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    loggedIn: boolean;
}

export interface IEmailResp {
    data: any
    notification: {
        receiver: string;
        result: string;
    },
}

export interface ICerts {
    key: Buffer;
    cert: Buffer;
    ca: Buffer;
}