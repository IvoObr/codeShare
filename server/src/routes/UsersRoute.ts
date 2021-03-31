import { Mongo } from '@db';
import { UserRequest, IRequest, IUser, IUserReq } from '@interfaces';
import { StatusCodes, Errors, UserRolesType } from '@enums';
import ApiRouter from './ApiRouter';
import UserDal from '@dals/UserDal';

import { Request, Response, Router, NextFunction } from 'express';
import * as Const from '@constants';
import User from "@entities/User";
import logger from '@logger';

class UserRouter extends ApiRouter {

    protected router: Router;

    constructor() {
        super();
        this.router = Router();
        this.useMiddleware();
        this.initRoutes();
    }

    public getRouter(): Router {
        this.router.use('/user', this.router);
        return this.router;
    }

    protected useMiddleware(): void {
        // this.router.use((req: Request, res: Response, next: NextFunction): void => {
        //     // todo something
        //     logger.info('User middleware', req.body);
        //     next();
        // }); 
    }

    protected initRoutes(): void {

        // todo login

        this.router.get('/all', async (req: Request, res: Response): Promise<Response | void> => {
            try {
                const users: IUser[] = await UserDal.getAllUsers();

                return res.status(StatusCodes.OK).send(users);

            } catch (error) {
                this.handleError(error, res);
            }
        });

        this.router.post('/register', async (req: Request, res: Response): Promise<Response | void> => {
            try {
                const newUser: User = await new User(req.body).validate();
                const user: IUser = await UserDal.addUser(newUser);

                // todo login!!!

                return res.status(StatusCodes.CREATED).send(user);

            } catch (error) {
                this.handleError(error, res);
            }
        });

        this.router.put('/update', async (req: Request, res: Response): Promise<Response | void> => {
            const { user } = req.body;
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: Errors.ERROR_MISSING_PARAMETER
                });
            }
            user._id = Number(user._id);
            // TODO user user
            return res.status(StatusCodes.OK).end();
        });

        this.router.delete('/delete/:id', async (req: Request, res: Response): Promise<void> => {
            try {

                logger.info('###########################', req);

                const id: any = req.params.id;

              

                const result: boolean = await UserDal.deleteUser(id);

                // logger.success('result: ', result);

                return res.end();
                // return res.status(StatusCodes.OK).end();

            } catch (error) {
                this.handleError(error, res);
            }
        });
    }
}

export default new UserRouter().getRouter();
