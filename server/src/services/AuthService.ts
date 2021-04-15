import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { Jwt, ServerError } from '@lib';
import { Request, Response } from 'express';
import { StatusCodes, IUser, Errors, Headers, logger } from '@utils';

class AuthService {

    public login = async (request: Request, response: Response): Promise<void> => {
        try {
            const { email, password }: any = request.body;

            if (!(email && password)) {
                throw new ServerError(Errors.MISSING_PARAMETER, `Missing email or password.`);
            }

            const user: IUser = await UserDal.getUserByEmail(email);

            if (!user) {
                throw new ServerError(Errors.LOGIN_FAILED, `User not found.`);
            }
            const isPassValid: boolean = await bcrypt.compare(password, user.password);
           
            if (!isPassValid) {
                throw new ServerError(Errors.LOGIN_FAILED, `Invalid password.`);
            }

            const token: string = Jwt.sign({ id: user.id, role: user.role });

            const isTokenSet: boolean = await UserDal.setToken(token, user.id);

            if (!isTokenSet) {
                throw new ServerError(Errors.COULD_NOT_LOGIN, `Could not set token in DB.`);
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
                throw new ServerError(Errors.COULD_NOT_LOGOUT, `Could not logout.`);
            }

            response.status(StatusCodes.OK).end();

        } catch (error) {
            ServerError.handle(error, response);
        }
    }
}

export default new AuthService();

