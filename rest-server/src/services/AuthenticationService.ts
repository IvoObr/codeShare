import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { UserModel } from "@entities";
import SocketClient from '../SocketClient';
import { Request, Response } from 'express';
import { ServerError, JwtService } from '@services';
import {
    StatusCodes, IUser, Errors, Headers, IMailInfo,
    logger, IStrings, IUserModel, IPublicUser
} from '@utils';

class AuthenticationService {

    public static async register(request: Request, response: Response): Promise<void> {
        try {
            const newUser: IUserModel = await new UserModel(request.body).validate();
            const user: IUser = await UserDal.addUser(newUser);
            const publicUser: IPublicUser = UserModel.getPublicUser(user);

            response.status(StatusCodes.CREATED).json(publicUser);

        } catch (error: any) {
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

            const token: string = JwtService.sign({ _id: user._id, role: user.role });

            const isTokenSet: boolean = await UserDal.setToken(token, user._id);

            if (!isTokenSet) {
                logger.debug(`Could not set token in DB. UserID: ${user._id?.bold}`);
                throw loginError;
            }

            const publicUser: IPublicUser = UserModel.getPublicUser(user);

            response.header(Headers.Authorization, token).json(publicUser);
            response.status(StatusCodes.OK).end();

        } catch (error: any) {
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

        } catch (error: any) {
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

            const token: string = JwtService.sign({ _id: user._id, role: user.role });
            const isTokenSet: boolean = await UserDal.setToken(token, user._id);

            if (!isTokenSet) {
                logger.debug(`Could not set token in DB. UserID: ${user._id?.bold}`);
                throw new ServerError(Errors.COULD_NOT_SEND_EMAIL, 'Could not set token in DB.');
            }

            const message: string = JSON.stringify({
                to: user.email,
                subject: 'Password reset',
                body: `<p>Dear ${user.name},</p>
                       <p> Please follow the link to
                       <a style="color:blue" href="https://${process.env.host}:${process.env.port}/api/v1/auth/reset-password/${token}">
                       reset your password. </a>                     
                       </p>
                       <p>The link is valid for 24 hours.</p>
                       <p>All the Best!</p>`
            });

            // todo: change url to frontend

            new SocketClient()
                .notificationSocket()
                .send(message)
                .onSuccess((info: IMailInfo): void => {
                    response
                        .status(StatusCodes.CREATED)
                        .json({ result: `Email successfully send.`, receiver: info?.accepted?.[0] || info });
                })
                .onError((error: string): void => {
                    const err: ServerError = new ServerError(Errors.COULD_NOT_SEND_EMAIL, error);
                    ServerError.handle(err, response);
                });

        } catch (error: any) {
            ServerError.handle(error, response);
        }
    }

    public static async resetPassword(request: Request, response: Response): Promise<void> {
        try {
            const userId: string = request.body.userId;
            let password: string = request.body.password;

            const user: IUser = await UserDal.getUserById(userId);

            password && UserModel.validatePassword(password);
            password && (password = await UserModel.hashPassword(password));

            user.password = password || user.password;

            const didUpdate: boolean = await UserDal.updateUser(user);

            if (!didUpdate) {
                throw new ServerError(Errors.BAD_REQUEST, `Could not update user with id: ${userId}.`);
            }

            response.status(StatusCodes.OK).end();

        } catch (error: any) {
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

