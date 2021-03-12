import { Request } from 'express';
import { UserRolesType } from '@enums';

export interface UserRequest extends Request {
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

export interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRolesType;
  tokens: string[]
}
