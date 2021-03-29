import bcrypt from 'bcrypt';
import { Request, Response, Router, NextFunction } from 'express';
import { StatusCodes } from '@enums';
import ApiRouter from './ApiRouter';
import { JwtService } from '../lib/JwtService';
import { UserRequest, IRequest } from '@interfaces';
import * as Const from '@constants';
import logger from '@logger';

// const userDal = new UserDal();

class AuthRouter extends ApiRouter {

    protected router: Router;
    protected jwtService: JwtService;

    constructor() {
        super();
        this.router = Router();
        this.jwtService = new JwtService();
        this.useMiddleware();
        this.initRoutes();
    }

    public getRouter(): Router {
        this.router.use('/auth', this.router);
        return this.router;
    }

    protected useMiddleware(): void {
        this.router.use((req: IRequest, res: Response, next: NextFunction): void => {
            // todo something
            logger.info('Auth middleware');
            next();
        });
    }

    protected initRoutes(): void {

        /* POST /api/auth/login */

        this.router.post('/login', async (req: IRequest, res: Response) => {
            const email: string = req.body.email;
            const password: string = req.body.password;

            if (!(email && password)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: Const.ERR_MISSING_PARAMETER });
            }
            /* Fetch user */

            //@ts-ignore: TODO put interface
            const user: any = null;// TODO get user by email

            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    error: Const.ERR_LOGIN_FAILED
                });
            }
            /* Check password */
            const pwdPassed = await bcrypt.compare(password, user.password);
            if (!pwdPassed) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    error: Const.ERR_LOGIN_FAILED
                });
            }
            /* Setup Admin JWT */
            const jwt = await this.jwtService.createJWT({
                id: user.id,
                role: user.role
            });

            res.header(Const.xAuth, jwt).send({ user });
            return res.status(StatusCodes.OK).end();
        });

        /* GET /api/auth/logout */

        this.router.get('/logout', (req: Request, res: Response) => {
            // const { key, options } = cookieProps;
            // todo
            // res.clearCookie(key, options);

            // req.user.removeToken(req.token).then(() => {
            //     res.status(200).send();

            return res.status(StatusCodes.OK).end();
        });
    }
}

export default new AuthRouter().getRouter();
