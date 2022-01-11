import { UserRole } from './enums';
import { Request, Response, NextFunction } from 'express';

export interface IMiddleware {
  sync: (request: Request, response: Response, next: NextFunction) => void;
  async: (request: Request, response: Response, next: NextFunction) => Promise<void>;
}

export interface IMailInfo {
  accepted: string[];
  rejected: string[];
  envelopeTime: number;
  messageTime: number;
  messageSize: number;
  response: string;
  envelope: { [key: string]: string };
  messageId: string;
  error?: string;
}

export interface IClientData {
  _id: string;
  role: UserRole;
}

export interface IStrings {
  [key: string]: string
}

export interface ICerts {
  key: Buffer;
  cert: Buffer;
  ca: Buffer;
}

//#region User
export interface IBaseUser {
  name: string;
  email: string;
  role: UserRole;
}

export interface IPublicUser extends IBaseUser {
  _id: string;
}

export interface INewUserReq extends IBaseUser {
  password: string;
}

export interface IUserModel extends IBaseUser {
  tokens: string[];
  password: string;
}

export interface IUser extends IBaseUser {
  _id: string;
  tokens: string[];
  password: string;
}
//#endregion User