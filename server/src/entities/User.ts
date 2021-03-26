import bcrypt from 'bcrypt';
import validator from 'validator';
import { IUser } from "@interfaces";
import * as Const from '@constants';
import { UserError } from '../lib/Errors';
import { UserRolesType, ErrorType } from '@enums';

export default class User implements IUser {

    public tokens: string[] = [];

    constructor(
        public email: string,
        public role: UserRolesType,
        public password: string,
        public id: number,
        public name: string
    ) { }
    
    public async validate(): Promise<User> {
        const isEmailValid: boolean = validator.isEmail(this.email);

        const isPassValid: boolean = validator.isStrongPassword(
            this.password, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1
            });
        
        if (!isEmailValid) {
            throw new UserError(ErrorType.INVALID_EMAIL);
        }

        if (!isPassValid) {
            throw new UserError(ErrorType.INVALID_PASSWORD);
        }

        if (typeof this.name !== 'string' || this.name.length < 1) {
            throw new UserError(ErrorType.INVALID_NAME);
        }

        const salt: string = await bcrypt.genSalt(Const.saltRounds);
        this.password = await bcrypt.hash(this.password, salt);

        this.email = this.email || '';
        this.role = this.role || UserRolesType.Member;
        this.password = this.password || '';
        this.id = this.id || -1;

        return this;
    }
}
