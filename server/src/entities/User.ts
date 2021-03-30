import bcrypt from 'bcrypt';
import validator from 'validator';
import { IUser, IUserReq } from "@interfaces";
import * as Const from '@constants';
import { UserRolesType, Errors } from '@enums';

export default class User implements IUser {

    public tokens: string[] = [];
    public _id: number = -1;
    public email: string;
    public role: UserRolesType;
    public password: string;
    public name: string;

    constructor({ name, email, password, role }: IUserReq) { 
        this.email = email;
        this.role = role;
        this.password = password;
        this.name = name;
    }

    set id(id: number) {
        if (typeof id === 'number') {
            this._id = id;
        }
    }
    
    public async validate(): Promise<User> {
        const isEmailValid: boolean = validator.isEmail(this.email);

        const isPassValid: boolean = validator.isStrongPassword(this.password,
            { minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 0 });
                
        if (!isEmailValid) {
            throw new Error(Errors.ERROR_INVALID_EMAIL);
        }

        if (!isPassValid) {
            throw new Error(Errors.ERROR_PASSWORD_CRITERIA_NOT_MET);
        }

        if (typeof this.name !== 'string' || this.name.length < 1) {
            throw new Error(Errors.ERROR_INVALID_NAME);
        }

        const salt: string = await bcrypt.genSalt(Const.saltRounds);
        this.password = await bcrypt.hash(this.password, salt);

        this.email = this.email || '';
        this.role = this.role || UserRolesType.Member;
        this.password = this.password || '';

        return this;
    }
}
