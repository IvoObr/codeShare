import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { Helpers } from '@lib';
import { UserRole, Errors, IUser, IUserReq } from '@utils';

export default class UserModel implements IUser {

    public tokens: string[] = [];
    public email: string;
    public role: UserRole;
    public password: string;
    public name: string;
    public id: string;

    constructor({ name, email, password, role }: IUserReq) { 
        this.email = email || '';
        this.role = role || UserRole.Member;
        this.password = password || '';
        this.name = name || '';
        this.id = Helpers.genBase36Key();
    }

    public async validate(): Promise<UserModel> {
        this.validateName();
        this.validatePassword();
        await this.validateEmail();
        await this.hashPassword();
        return this;
    }

    private async hashPassword(): Promise<void> {
        const salt: string = await bcrypt.genSalt(12); // rounds
        this.password = await bcrypt.hash(this.password, salt);
    }

    private validateName(): void {
        if (typeof this.name !== 'string' || this.name.length < 1) {
            throw new Error(Errors.INVALID_NAME);
        }
    }

    private validatePassword(): void {
        const isValidPassword: boolean = this.isPasswordStrong(this.password);

        if (!isValidPassword) {
            throw new Error(Errors.PASSWORD_CRITERIA_NOT_MET);
        }
    }

    private async validateEmail(): Promise<void> {
        const user: IUser = await UserDal.getUserByEmail(this.email);
        
        if (user) {
            throw new Error(Errors.USER_EXISTS);
        }

        const isValidEmail: boolean = this.isEmailValid(this.email);

        if (!isValidEmail) {
            throw new Error(Errors.INVALID_EMAIL);
        }
    }

    private isPasswordStrong(password: string): boolean {
        const minLength: boolean = password.length > 8;
        const oneUppercase: boolean = new RegExp(/[A-Z]/).test(password);
        const oneLowercase: boolean = new RegExp(/[a-z]/).test(password);
        const oneNumber: boolean = new RegExp(/[0-9]/).test(password);
        const oneSymbol: boolean = new RegExp(/[-#!$@%^&*()_+|~=`{}\[\]:";'<>?,.\/]/).test(password);

        return minLength && oneUppercase && oneLowercase && oneNumber && oneSymbol;
    }

    private isEmailValid(email: string): boolean {
        const regex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }
}
