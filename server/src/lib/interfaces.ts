import { Request } from 'express';
import { UserRolesType } from '@lib';

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
  id: number;
  role: number;
}

export interface IUserReq {
  name: string;
  email: string;
  password: string;
  role: UserRolesType;
}

export interface IUser extends IUserReq {
  _id?: string;
  tokens: string[]
}