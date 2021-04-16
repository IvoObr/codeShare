import { UserRole } from './enums';
import { Request, Response, NextFunction } from 'express';

export interface IRouteWrapper {
  (request: Request, response: Response, next: NextFunction) : void
}

export interface IClientData {
  _id: string;
  role: UserRole;
}

export interface IStrings {
  [key: string]: string
}

//#region User
export interface IUserReq {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface IUserModel extends IUserReq {
  tokens: string[]
}

export interface IUser extends IUserModel {
  _id: string;
}
//#endregion User