import { Mongo } from '@db';
import { UserRequest, IRequest, IUser } from '@interfaces';
import { StatusCodes } from '@enums';
import ApiRouter from './ApiRouter';
import { Request, Response, Router, NextFunction } from 'express';
import * as Const from '@constants';
import User from "@entities/User";
import logger from '@logger';
import { UserError } from '../lib/Errors';

// todo instance of user dal

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
        this.router.use((req: IRequest, res: Response, next: NextFunction): void => {
            // todo something
            logger.info('User middleware');
            next();
        }); 
    }

    protected initRoutes(): void {
        this.router.get('/all', async (req: Request, res: Response): Promise<Response> => {
            const users = await Mongo.db.collection(Const.USERS).find().toArray(); // todo goes to UserDal

            return res.status(StatusCodes.OK).send(users);
        });

        this.router.post('/add', async (req: IRequest, res: Response): Promise<Response | void> => {
            try {
                const { user } = req.body;
                if (!user) {
                    return res.status(StatusCodes.BAD_REQUEST).json({
                        error: Const.ERR_MISSING_PARAMETER
                    });
                }

                // TODO add user

                const newUser: User = await new User(
                    user?.email,
                    user?.role,
                    user?.password,
                    user?.id,
                    user?.name
                ).validate();

                // = await Mongo.db.collection(Consts.USER).insertOne(newUser); // todo goes to UserDal

                return res.status(StatusCodes.CREATED).end();
            } catch (error) {
                logger.error(error);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
        });

        this.router.put('/update', async (req: IRequest, res: Response): Promise<Response | void> => {
            const { user } = req.body;
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: Const.ERR_MISSING_PARAMETER
                });
            }
            user.id = Number(user.id);
            // TODO user user
            return res.status(StatusCodes.OK).end();
        });

        this.router.delete('/delete/:id', async (req: IRequest, res: Response): Promise<void> => {
            const { id } = req.params;
            // TODO delete user by id
            return res.status(StatusCodes.OK).end();
        });
    }
}

export default new UserRouter().getRouter();
