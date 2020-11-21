import { IUser } from '@entities/User';
import { Request } from 'express';

export interface UserRequest extends Request { user: IUser }
