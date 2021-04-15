import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { Jwt, ServerError } from '@lib';
import { Request, Response } from 'express';
import { StatusCodes, IUser, Errors, Headers, logger, IStrings } from '@utils';

class AuthService {

    public login = async (request: Request, response: Response): Promise<void> => {
        try {
            const { email, password }: IStrings = request.body;
            const loginFailed: ServerError = new ServerError(Errors.LOGIN_FAILED, 'Login failed.');

            if (!(email && password)) {
                throw new ServerError(Errors.MISSING_PARAMETER, `Missing email or password.`);
            }

            const user: IUser = await UserDal.getUserByEmail(email);

            if (!user) {
                logger.debug(`User ${email.bold} not found.`);
                throw loginFailed;
            }
            const isPassValid: boolean = await bcrypt.compare(password, user.password);
           
            if (!isPassValid) {
                logger.debug(`Invalid password ${user.password.bold}`);
                throw loginFailed;
            }

            const token: string = Jwt.sign({ id: user.id, role: user.role });

            const isTokenSet: boolean = await UserDal.setToken(token, user.id);

            if (!isTokenSet) {
                logger.debug(`Could not set token in DB. UserID: ${user.id.bold}`);
                throw loginFailed;
            }

            user.tokens.push(token);

            response.header(Headers.Authorization, token).send(user);
            response.status(StatusCodes.OK).end();

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public logout = async (request: Request, response: Response): Promise<void> => {
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

export default new AuthService();

