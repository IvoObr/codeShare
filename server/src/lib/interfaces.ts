import { Request } from 'express';
import { UserRole } from '@lib';

export interface IUserRequest extends Request {
  user: IUser
  token: string;
}

/* IRequest object for express routes */
export interface IRequest extends Request {
  body: {
    user: IUser;
    email: string;
    password: string;
  }
} 

export interface IClientData {
  id: string;
  role: string;
}

export interface IUserReq extends IUserLogin {
  name: string;
  role: UserRole;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUser extends IUserReq {
  id: string;
  tokens: string[]
}