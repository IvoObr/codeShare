import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { ServerError } from '@lib';
import { UserRole, Errors, IUser, IUserReq, IUserModel } from '@utils';

export default class UserModel implements IUserModel {

    public tokens: string[];
    public email: string;
    public role: UserRole;
    public password: string;
    public name: string;

    constructor({ name, email, password, role }: IUserReq) { 
        this.email = email || '';
        this.role = role || UserRole.Member;
        this.password = password || '';
        this.name = name || '';
        this.tokens = [];
    }

    public async validate(): Promise<UserModel> {
        UserModel.validateName(this.name);
        UserModel.validateEmail(this.email);
        UserModel.validatePassword(this.password);
        await UserModel.checkIfUserExists(this.email);
        this.password = await UserModel.hashPassword(this.password);
        return this;
    }

    public static async hashPassword(password: string): Promise<string> {
        const salt: string = await bcrypt.genSalt(12); // rounds
        return await bcrypt.hash(password, salt);
    }

    public static validateName(name: string): void {
        if (typeof name !== 'string' || name.length < 1) {
            throw new ServerError(Errors.INVALID_NAME, `Username ${name} is invalid!`);
        }
    }

    public static validatePassword(password: string): void {
        const isValidPassword: boolean = UserModel.isPasswordStrong(password);

        if (!isValidPassword) {
            throw new ServerError(Errors.PASSWORD_CRITERIA_NOT_MET, `Password ${password} is not secure enough!`);
        }
    }
    public static async checkIfUserExists(email: string): Promise<void> {
        const user: IUser = await UserDal.getUserByEmail(email);

        if (user) {
            throw new ServerError(Errors.USER_EXISTS, `User ${email} already exists!`);
        }
    }

    public static validateEmail(email: string): void {
        const isValidEmail: boolean = UserModel.isEmailValid(email);

        if (!isValidEmail) {
            throw new ServerError(Errors.INVALID_EMAIL, `${email} is not a valid email!`);
        }
    }

    public static isPasswordStrong(password: string): boolean {
        const minLength: boolean = password.length > 8;
        const oneUppercase: boolean = new RegExp(/[A-Z]/).test(password);
        const oneLowercase: boolean = new RegExp(/[a-z]/).test(password);
        const oneNumber: boolean = new RegExp(/[0-9]/).test(password);
        const oneSymbol: boolean = new RegExp(/[-#!$@%^&*()_+|~=`{}\[\]:";'<>?,.\/]/).test(password);

        return minLength && oneUppercase && oneLowercase && oneNumber && oneSymbol;
    }

    public static isEmailValid(email: string): boolean {
        const regex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }
}
