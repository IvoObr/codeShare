import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { genBase36Key, ServerError } from '@lib';
import { UserRole, Errors, IUser, IUserReq, logger } from '@utils';

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
        this.id = genBase36Key();
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
            throw new ServerError(Errors.INVALID_NAME, `Username ${this.name.bold} is invalid!`);
        }
    }

    private validatePassword(): void {
        const isValidPassword: boolean = this.isPasswordStrong(this.password);

        if (!isValidPassword) {
            throw new ServerError(Errors.PASSWORD_CRITERIA_NOT_MET, `Password ${this.password.bold} is not secure enough!`);
        }
    }

    private async validateEmail(): Promise<void> {
        const user: IUser = await UserDal.getUserByEmail(this.email);
        
        if (user) {
            throw new ServerError(Errors.USER_EXISTS, `User ${this.email} already exists!`);
        }

        const isValidEmail: boolean = this.isEmailValid(this.email);

        if (!isValidEmail) {
            throw new ServerError(Errors.INVALID_EMAIL, `${this.email} is not a valid email!`);
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
