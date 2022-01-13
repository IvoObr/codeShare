import { IncomingMessage } from 'http';
import { UserRole } from '../src/lib/enums';
import { IStrings } from '../src/lib/interfaces';

export type IFunc = (value?: unknown) => void;

export type ICallback = (message: IncomingMessage, data: string) => void;

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
}

export interface ICerts {
    key: Buffer;
    cert: Buffer;
    ca: Buffer;
}

export enum Methods {
    'GET' = 'GET',
    'PUT' = 'PUT',
    'POST' = 'POST',
    'DELETE' = 'DELETE',

}

export enum Success {
    'SUCCESS' = 'green',
    'ERROR' = 'red'
}