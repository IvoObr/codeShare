import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { Request, Response } from 'express';
import { MiddlewareHandler } from '@middlewares';
import { StatusCodes, IUser, Errors, Headers, logger, Jwt } from '@lib';

class AuthService {

    private handleError = MiddlewareHandler.handleError;

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

            const didSetToken: boolean = await UserDal.setToken(token, user.id);

            if (!didSetToken) {
                throw new Error(Errors.COULD_NOT_INSERT_TOKEN_IN_DB);
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
            // const { key, options } = cookieProps;
            // todo delete token
            // res.clearCookie(key, options);

            // req.user.removeToken(req.token).then(() => {
            //     res.status(200).send();

            response.status(StatusCodes.OK).end();

        } catch (error) {
            this.handleError(error, response);
        }
    }
}

export default new AuthService();

