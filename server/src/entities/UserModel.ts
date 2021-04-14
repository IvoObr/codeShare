import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { UserRole, Errors, IUser, IUserReq, Helpers } from '@lib';

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
        const isValidPassword: boolean = Helpers.isPasswordStrong(this.password);

        if (!isValidPassword) {
            throw new Error(Errors.PASSWORD_CRITERIA_NOT_MET);
        }
    }

    private async validateEmail(): Promise<void> {
        const user: IUser = await UserDal.getUserByEmail(this.email);
        
        if (user) {
            throw new Error(Errors.USER_EXISTS);
        }

        const isValidEmail: boolean = Helpers.isEmailValid(this.email);

        if (!isValidEmail) {
            throw new Error(Errors.INVALID_EMAIL);
        }
    }
}
