import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { UserModel } from "@entities";
import { Jwt, ServerError } from '@lib';
import { Request, Response } from 'express';
import {
    StatusCodes, IUser, Errors, Headers,
    logger, IStrings, IUserModel, IClientData, Event, Events
} from '@utils';

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

    public static async sendResetPassword(request: Request, response: Response): Promise<void> {
        try {
            const { email }: IStrings = request.body;

            if (!email) {
                throw new ServerError(Errors.MISSING_PARAMETER, `Missing email.`);
            }
            
            const user: IUser = await UserDal.getUserByEmail(email);

            if (!user) {
                logger.debug(`User ${email?.bold} not found.`);
                throw new ServerError(Errors.NOT_FOUND, 'User not found.');
            }

            const message: string = JSON.stringify({
                to: user.email,
                subject: 'Password reset',
                body: `<p>Dear ${user.name},</p>
                       <p>Please follow the link to reset your password:</p>
                       <href>${process.env.host}:${process.env.port}/api/v1/auth/reset-password/${user.tokens[0]}</href>
                       <p>The link is valid for 24 hours.</p>
                       <p>All the Best!</p>`
            });

            Event.emit(Events.sendEmail, message);

            Event.on(Events.emailError, (error: string) => {
                throw new ServerError(Errors.COULD_NOT_SEND_EMAIL, error);
            });

            Event.on(Events.emailSuccess, (info: string) => {
                response.status(StatusCodes.CREATED).json(info);
            });

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public static async resetPassword(request: Request, response: Response): Promise<void> {
        try {
            const token: string = request.params?.token;

            if (!token) {
                throw new ServerError(Errors.MISSING_PARAMETER, `Missing token.`);
            }

            const clientData: IClientData = Jwt.verify(token);
            const user: IUser = await UserDal.getUserById(clientData._id);
    
            if (!user) {
                throw new ServerError(Errors.NOT_FOUND, 'User not found.');
            }

            // todo change user password

        } catch (error) {
            ServerError.handle(error, response);
        }
    }
}

export const {
    login,
    logout,
    register,
    resetPassword,
    sendResetPassword
}: typeof AuthenticationService = AuthenticationService;

