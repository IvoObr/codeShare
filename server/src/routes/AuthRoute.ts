import bcrypt from 'bcrypt';
import ApiRouter from './ApiRouter';
import { JwtService } from '../lib/JwtService';
import { StatusCodes, Errors, Headers, logger } from '@lib';
import { Request, Response, Router, NextFunction } from 'express';

// const userDal = new UserDal();

class AuthRouter extends ApiRouter {

    protected router: Router;
    private jwtService: JwtService;

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
        this.router.use((req: Request, res: Response, next: NextFunction): void => {
            // todo something
            logger.info('Auth middleware');
            next();
        });
    }

    protected initRoutes(): void {

        /* POST /api/auth/login */

        this.router.post('/login', async (req: Request, res: Response) => {
            const email: string = req.body.email;
            const password: string = req.body.password;

            if (!(email && password)) {
                return res.status(StatusCodes.BAD_REQUEST).json({ error: Errors.ERROR_MISSING_PARAMETER });
            }
            /* Fetch user */

            //@ts-ignore: TODO put interface
            const user: any = null;// TODO get user by email

            if (!user) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    error: Errors.ERROR_LOGIN_FAILED
                });
            }
            /* Check password */
            const pwdPassed = await bcrypt.compare(password, user.password);
            if (!pwdPassed) {
                return res.status(StatusCodes.UNAUTHORIZED).json({
                    error: Errors.ERROR_LOGIN_FAILED
                });
            }
            /* Setup Admin JWT */
            const jwt = await this.jwtService.createJWT({
                id: user.id,
                role: user.role
            });

            res.header(Headers.Authorization, jwt).send({ user });
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
