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
  id: number;
  tokens: string[]
}

export interface IUserDal {
  getOne: (email: string) => Promise<IUser | null>;
  getAll: () => Promise<IUser[]>;
  add: (user: IUser) => Promise<void>;
  update: (user: IUser) => Promise<void>;
  delete: (id: number) => Promise<void>;
}
