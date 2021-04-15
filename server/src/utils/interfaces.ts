import { UserRole } from './enums';
import { Request, Response, NextFunction } from 'express';

export interface IRouteWrapper {
  (request: Request, response: Response, next: NextFunction) : void
}

export interface IClientData {
  _id: string;
  role: UserRole;
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
  _id: string;
  tokens: string[]
}

export interface IStrings {
  [key: string]: string
}
