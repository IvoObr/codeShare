import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { Jwt, ErrorHandler } from '@lib';
import { Request, Response } from 'express';
import { StatusCodes, IUser, Errors, Headers, logger } from '@utils';

class AuthService {

    private handleError = ErrorHandler;

    public login = async (request: Request, response: Response): Promise<void> => {
        try {
            const { email, password }: any = request.body;

            if (!(email && password)) {
                throw new Error(Errors.MISSING_PARAMETER);
            }

            const user: IUser = await UserDal.getUserByEmail(email);

            if (!user) {
                logger.debug(Errors.INVALID_EMAIL, email);
                throw new Error(Errors.LOGIN_FAILED);
            }
            const isPassValid: boolean = await bcrypt.compare(password, user.password);
           
            if (!isPassValid) {
                logger.debug(Errors.INVALID_PASSWORD, password);
                throw new Error(Errors.LOGIN_FAILED);
            }

            const token: string = Jwt.sign({ id: user.id, role: user.role });

            const isTokenSet: boolean = await UserDal.setToken(token, user.id);

            if (!isTokenSet) {
                throw new Error(Errors.COULD_NOT_LOGIN);
            }

            user.tokens.push(token);

            response.header(Headers.Authorization, token).send(user);
            response.status(StatusCodes.OK).end();

        } catch (error) {
            this.handleError(error, response);
        }
    }

    public logout = async (request: Request, response: Response): Promise<void> => {
        try {
            const areTokensRemoved: boolean = await UserDal.removeTokens(request.body.userId);

            if (!areTokensRemoved) {
                throw new Error(Errors.COULD_NOT_LOGOUT);
            }

            response.status(StatusCodes.OK).end();

        } catch (error) {
            this.handleError(error, response);
        }
    }
}

export default new AuthService();

