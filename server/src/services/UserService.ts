import { UserDal } from '@db';
import { UserModel } from "@entities";
import { ServerError } from '@lib';
import { Request, Response } from 'express';
import { StatusCodes, IUser, Errors, IUserModel, logger } from '@utils';

class UserService {

    public getAll = async (request: Request, response: Response): Promise<void> => {
        try {
            const users: IUser[] = await UserDal.getAllUsers();
            response.status(StatusCodes.OK).send(users);

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public register = async (request: Request, response: Response): Promise<void> => {
        try {
            const newUser: IUserModel = await new UserModel(request.body).validate();
            const user: IUser = await UserDal.addUser(newUser);

            response.status(StatusCodes.CREATED).send(user);

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public delete = async (request: Request, response: Response): Promise<void> => {
        try {
            const id: string = request.params?.id;
                                    
            if (!id) {
                throw new ServerError(Errors.MISSING_PARAMETER, 'Missing id in the request');
            }

            const deletedCount: number = await UserDal.deleteUser(id);

            if (deletedCount < 1) {
                throw new ServerError(Errors.COULD_NOT_DELETE_USER_BY_ID, `Could not delete user by id.`);
            }

            response.status(StatusCodes.OK).end();

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public update = async (request: Request, response: Response): Promise<void> => {
        
        // name: string;
        // email: string;
        // password: string;
        // role: UserRole;
        
        const { user } = request.body;
        if (!user) {
            response.status(StatusCodes.BAD_REQUEST).json({
                error: Errors.MISSING_PARAMETER
            });
        }
        user._id = Number(user._id);
        // TODO user user
        return response.status(StatusCodes.OK).end();
    }
}

export default new UserService();
        
