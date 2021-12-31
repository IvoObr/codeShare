import { IncomingMessage } from 'http';
import { UserRole } from '../src/lib/enums';
import { IStrings } from '../src/lib/interfaces';

export type IFunc = (value?: unknown) => void;

export type ICallback = (response: IncomingMessage, data: Buffer) => void;

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
