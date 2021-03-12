import bcrypt from 'bcrypt';
import validator from 'validator';
import { IUser } from "@interfaces";
import * as Consts from '@constants';
import { UserError } from '../lib/Errors';
import { UserRoles, UserErrors } from '@enums';

export default class User implements IUser {

    public tokens: string[] = [];

    constructor(
        public email: string,
        public role: UserRoles,
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
            throw new UserError(UserErrors.INVALID_EMAIL, 'message');
        }

        if (!isPassValid) {
            throw new UserError(UserErrors.INVALID_PASSWORD);
        }

        if (typeof this.name !== 'string' || this.name.length < 1) {
            throw new UserError(UserErrors.INVALID_NAME);
        }

        const salt: string = await bcrypt.genSalt(Consts.saltRounds);
        this.password = await bcrypt.hash(this.password, salt);

        this.email = this.email || '';
        this.role = this.role || UserRoles.Member;
        this.password = this.password || '';
        this.id = this.id || -1;

        return this;
    }
}
