import UserModel from "@entities/UserModel";
import UserDal from '@dals/UserDal';
import { IUser } from '@interfaces';
import { Request, Response } from 'express';
import { StatusCodes, Errors } from '@enums';
import ServiceHandler from './ServiceHandler';

class UserService extends ServiceHandler {

    constructor() {
        super(); 
    }

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

            if (!id) {
                throw new Error(Errors.ERROR_MISSING_PARAMETER);
            }

            const deletedCount: number = await UserDal.deleteUser(id);

            if (deletedCount < 1) {
                throw new Error(Errors.ERROR_COULD_NOT_DELETE_USER_BY_ID);
            }

            response.status(StatusCodes.OK).end();

        } catch (error) {
            this.handleError(error, response);
        }
    }

    public update = async (request: Request, response: Response): Promise<Response | void> => {
        
        // TODO.....
        
        const { user } = request.body;
        if (!user) {
            return response.status(StatusCodes.BAD_REQUEST).json({
                error: Errors.ERROR_MISSING_PARAMETER
            });
        }
        user._id = Number(user._id);
        // TODO user user
        return response.status(StatusCodes.OK).end();
    }
}

export default new UserService();
        
