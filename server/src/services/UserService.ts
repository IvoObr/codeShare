import { UserDal } from '@db';
import { ServerError } from '@lib';
import { Request, Response } from 'express';
import { StatusCodes, IUser, Errors } from '@utils';

class UserService {

    public static async getAllUsers(request: Request, response: Response): Promise<void> {
        try {
            const users: IUser[] = await UserDal.getAllUsers();
            response.status(StatusCodes.OK).json(users);

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public static async deleteUser(request: Request, response: Response): Promise<void> {
        try {
            const id: string = request.params?.id;
                                    
            if (!id) {
                throw new ServerError(Errors.MISSING_PARAMETER, 'Missing id in the request');
            }

            const deletedCount: number = await UserDal.deleteUser(id);

            if (deletedCount < 1) {
                throw new ServerError(Errors.NOT_FOUND, `Could not delete user by id.`);
            }

            response.status(StatusCodes.OK).end();

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public static async updateUser(request: Request, response: Response): Promise<void> {
        const { id } = request.params;   
        const { user } = request.body;

        // name: string;
        // email: string;
        // password: string;
        // role: UserRole;

        // not fount if not found
        // return person 
        
        // if (!user) {
        //     response.status(StatusCodes.BAD_REQUEST).json({
        //         error: Errors.MISSING_PARAMETER
        //     });
        // }
        // user._id = Number(user._id);
        // // TODO user user
        // return response.status(StatusCodes.OK).end();
    }
}

export const { deleteUser, updateUser, getAllUsers }: typeof UserService = UserService;