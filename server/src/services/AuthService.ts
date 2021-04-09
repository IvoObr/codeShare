import bcrypt from 'bcrypt';
import { UserDal } from '@db';
import { Request, Response } from 'express';
import { MiddlewareHandler } from '@middlewares';
import { StatusCodes, IUser, JwtService, Errors, Headers, logger } from '@lib';

class AuthService {

    private jwtService = new JwtService();
    private handleError = MiddlewareHandler.handleError;

    public login = async (request: Request, response: Response): Promise<void> => {
        try {
            const { email, password }: any = request.body;

            if (!(email && password)) {
                throw new Error(Errors.ERROR_MISSING_PARAMETER);
            }

            const user: IUser = await UserDal.getUserByEmail(email);

            if (!user) {
                logger.debug(Errors.ERROR_INVALID_EMAIL, email);
                throw new Error(Errors.ERROR_LOGIN_FAILED);
            }
            const isPassValid: boolean = await bcrypt.compare(password, user.password);
           
            if (!isPassValid) {
                logger.debug(Errors.ERROR_INVALID_PASSWORD, password);
                throw new Error(Errors.ERROR_LOGIN_FAILED);
            }


            //todo 
            const jwt: string = await this.jwtService.createJWT({
                id: user._id as string,
                role: user.role
            });

            response.header(Headers.Authorization, jwt).send({ user });
            response.status(StatusCodes.OK).end();

        } catch (error) {
            this.handleError(error, response);
        }
    }

    public logout = async (request: Request, response: Response): Promise<void> => {
        try {
            // const { key, options } = cookieProps;
            // todo
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

