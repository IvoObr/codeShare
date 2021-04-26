import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { UserModel } from "@entities";
import { Jwt, ServerError } from '@lib';
import { Request, Response } from 'express';
import { StatusCodes, IUser, Errors, Headers, logger, IStrings, IUserModel } from '@utils';

class AuthenticationService {

    public static async register(request: Request, response: Response): Promise<void> {
        try {
            const newUser: IUserModel = await new UserModel(request.body).validate();
            const user: IUser = await UserDal.addUser(newUser);

            response.status(StatusCodes.CREATED).json(user);

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public static async login(request: Request, response: Response): Promise<void> {
        try {
            const { email, password }: IStrings = request.body;
            const loginError: ServerError = new ServerError(Errors.UNAUTHORIZED, 'Login failed.');

            if (!email || !password) {
                throw new ServerError(Errors.MISSING_PARAMETER, `Missing email or password.`);
            }

            const user: IUser = await UserDal.getUserByEmail(email);

            if (!user) {
                logger.debug(`User ${email?.bold} not found.`);
                throw loginError;
            }
            const isPassValid: boolean = await bcrypt.compare(password, user.password);

            if (!isPassValid) {
                logger.debug(`Invalid password ${password?.bold}`);
                throw loginError;
            }

            const token: string = Jwt.sign({ _id: user._id, role: user.role });

            const isTokenSet: boolean = await UserDal.setToken(token, user._id);

            if (!isTokenSet) {
                logger.debug(`Could not set token in DB. UserID: ${user._id?.bold}`);
                throw loginError;
            }

            user.tokens.push(token);

            response.header(Headers.Authorization, token).json(user);
            response.status(StatusCodes.OK).end();

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public static async logout(request: Request, response: Response): Promise<void> {
        try {
            const areTokensRemoved: boolean = await UserDal.removeTokens(request.body.userId);

            if (!areTokensRemoved) {
                throw new ServerError(Errors.LOGOUT_FAILED, `Logout failed.`);
            }

            response.status(StatusCodes.OK).end();

        } catch (error) {
            ServerError.handle(error, response);
        }
    }
}

export const { login, logout, register }: typeof AuthenticationService = AuthenticationService;

