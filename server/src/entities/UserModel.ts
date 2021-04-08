import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { UserRolesType, Errors, IUser, IUserReq, Helpers } from '@lib';

export default class UserModel implements IUser {

    public tokens: string[] = [];
    public email: string;
    public role: UserRolesType;
    public password: string;
    public name: string;

    constructor({ name, email, password, role }: IUserReq) { 
        this.email = email || '';
        this.role = role || UserRolesType.Member;
        this.password = password || '';
        this.name = name || '';
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
            throw new Error(Errors.ERROR_INVALID_NAME);
        }
    }

    private validatePassword(): void {
        const isValidPassword: boolean = Helpers.isPasswordStrong(this.password);

        if (!isValidPassword) {
            throw new Error(Errors.ERROR_PASSWORD_CRITERIA_NOT_MET);
        }
    }

    private async validateEmail(): Promise<void> {
        const user: IUser = await UserDal.getUserByEmail(this.email);
        
        if (user) {
            throw new Error(Errors.ERROR_USER_EXISTS);
        }

        const isValidEmail: boolean = Helpers.isEmailValid(this.email);

        if (!isValidEmail) {
            throw new Error(Errors.ERROR_INVALID_EMAIL);
        }
    }
}
