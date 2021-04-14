import { UserDal } from '@db';
import { UserModel } from "@entities";
import { Request, Response } from 'express';
import { MiddlewareHandler } from '@middlewares';
import { StatusCodes, Errors, IUser, logger } from '@lib';

class UserService {

    private handleError = MiddlewareHandler.handleError;

    public getAll = async (request: Request, response: Response): Promise<void> => {
        try {
            const users: IUser[] = await UserDal.getAllUsers();
            response.status(StatusCodes.OK).send(users);

        } catch (error) {
            this.handleError(error, response);
        }
    }

    public register = async (request: Request, response: Response): Promise<void> => {
        try {
            const newUser: UserModel = await new UserModel(request.body).validate();
            const user: IUser = await UserDal.addUser(newUser);

            // todo login!!!

            response.status(StatusCodes.CREATED).send(user);

        } catch (error) {
            this.handleError(error, response);
        }
    }

    public delete = async (request: Request, response: Response): Promise<void> => {
        try {
            const id: string = request.query?.id as string;

            // todo authenticated admin users only can delete !!!!
            
            if (!id) {
                throw new Error(Errors.MISSING_PARAMETER);
            }

            const deletedCount: number = await UserDal.deleteUser(id);

            if (deletedCount < 1) {
                throw new Error(Errors.COULD_NOT_DELETE_USER_BY_ID);
            }

            response.status(StatusCodes.OK).end();

        } catch (error) {
            this.handleError(error, response);
        }
    }

    public update = async (request: Request, response: Response): Promise<Response | void> => {
        
        // name: string;
        // email: string;
        // password: string;
        // role: UserRole;
        // TODO.....
        
        const { user } = request.body;
        if (!user) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                error: Errors.MISSING_PARAMETER
            });
        }
        user.id = Number(user.id);
        // TODO user user
        return response.status(StatusCodes.OK).end();
    }
}

export default new UserService();
        
