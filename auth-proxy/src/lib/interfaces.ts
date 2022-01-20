import { UserRole, UserStatus } from './enums';

export interface IUser {
    name: string;
    email: string;
    role: UserRole;
    _id: string;
    tokens: string[];
    password: string;
}

export interface ICerts {
    key: Buffer;
    cert: Buffer;
    ca: Buffer;
}

export interface IClientData {
    _id: string;
    role: UserRole;
    status: UserStatus;
}

export interface IStrings {
    [key: string]: string
} 