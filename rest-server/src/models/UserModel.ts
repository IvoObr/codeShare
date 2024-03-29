import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { ServerError } from '@services';
import { UserRole, UserStatus, Errors, IUser, INewUserReq, IUserModel, IPublicUser } from '@utils';

export default class UserModel implements IUserModel {

    public name: string;
    public email: string;
    public role: UserRole;
    public tokens: string[];
    public password: string;
    public loggedIn: boolean;
    public status: UserStatus;

    constructor({ name, email, password, role }: INewUserReq) {
        this.tokens = [];
        this.loggedIn = false;
        this.name = name || '';
        this.email = email || '';
        this.password = password || '';
        this.status = UserStatus.NotActive;
        this.role = role || UserRole.Member;
    }

    public async validate(): Promise<UserModel> {
        UserModel.validateRole(this.role);
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

    public static validateRole(role: UserRole): void {
        if (!(role in UserRole)) {
            throw new ServerError(Errors.INVALID_ROLE, `Role ${role} is invalid!`);
        }
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
        const oneNumber: boolean = new RegExp(/[0-9]/).test(password);
        const oneUppercase: boolean = new RegExp(/[A-Z]/).test(password);
        const oneLowercase: boolean = new RegExp(/[a-z]/).test(password);
        const oneSymbol: boolean = new RegExp(/[-#!$@%^&*()_+|~=`{}\[\]:";'<>?,.\/]/).test(password);

        return minLength && oneUppercase && oneLowercase && oneNumber && oneSymbol;
    }

    public static isEmailValid(email: string): boolean {
        const regex: RegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return regex.test(String(email).toLowerCase());
    }

    public static getPublicUser(user: IUser): IPublicUser {
        return {
            _id: user._id,
            name: user.name,
            role: user.role,
            email: user.email,
            status: user.status,
            loggedIn: user.loggedIn
        };
    }
}
