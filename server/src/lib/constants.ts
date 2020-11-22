import { Request } from 'express';
import { IUser } from '@entities/User';


/* Strings */
export const paramMissingError: string = 'One or more of the required parameters was missing.';
export const loginFailedErr: string = 'Login failed';
export const dbName: string = 'codeShare';

/* Numbers */
export const pwdSaltRounds: number = 12;

/* IRequest object for express routes */
export interface IRequest extends Request {
    body: {
        user: IUser;
        email: string;
        password: string;
    }
} 
