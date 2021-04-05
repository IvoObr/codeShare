import { Mongo } from '@db';
import logger from '@logger';
import User from "@entities/User";
import ApiRouter from './ApiRouter';
import UserDal from '@dals/UserDal';
import { StatusCodes, Errors, UserRolesType } from '@enums';
import { Request, Response, Router, NextFunction } from 'express';
import { UserRequest, IRequest, IUser, IUserReq } from '@interfaces';

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

        this.router.get('/all', async (req: Request, res: Response): Promise<void> => {
            try {
                const users: IUser[] = await UserDal.getAllUsers();

                res.status(StatusCodes.OK).send(users);

            } catch (error) {
                this.handleError(error, res);
            }
        });

        this.router.post('/register', async (req: Request, res: Response): Promise<void> => {
            try {
                const newUser: User = await new User(req.body).validate();
                const user: IUser = await UserDal.addUser(newUser);

                // todo login!!!

                res.status(StatusCodes.CREATED).send(user);

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

        this.router.delete('/delete', async (req: Request, res: Response): Promise<void> => {
            try {
                const id: string = req.query?.id as string;
                
                if (!id) {
                    throw new Error(Errors.ERROR_MISSING_PARAMETER);
                }

                const deletedCount: number = await UserDal.deleteUser(id);

                if (deletedCount < 1) {
                    throw new Error(Errors.ERROR_COULD_NOT_DELETE_USER_BY_ID);
                }

                res.status(StatusCodes.OK).end();

            } catch (error) {
                console.error(error)
                this.handleError(error, res);
            }
        });
    }
}

export default new UserRouter().getRouter();
