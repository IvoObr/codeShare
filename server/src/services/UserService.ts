import { UserDal } from '@db';
import { ServerError } from '@lib';
import { UserModel } from '@entities';
import { Request, Response } from 'express';
import { StatusCodes, IUser, Errors, IStrings, logger } from '@utils';

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
                throw new ServerError(Errors.BAD_REQUEST, 'Missing user id in the request.');
            }

            const deletedCount: number = await UserDal.deleteUser(id);

            if (deletedCount < 1) {
                throw new ServerError(Errors.NOT_FOUND, `Could not delete user by id: ${id}.`);
            }

            response.status(StatusCodes.OK).end();

        } catch (error) {
            ServerError.handle(error, response);
        }
    }

    public static async updateUser(request: Request, response: Response): Promise<void> {
        const { id }: IStrings = request.params;
        let { password }: IStrings = request.body;
        const { name, email }: IStrings = request.body;

        if (!id) {
            throw new ServerError(Errors.BAD_REQUEST, 'Missing user id in the request.');
        }

        const user: IUser = await UserDal.getUserById(id);

        logger.debug(user);

        if (!user) {
            throw new ServerError(Errors.NOT_FOUND, `User not found id: ${id}.`);
        }

        if (!(name || email || password)) {
            throw new ServerError(Errors.BAD_REQUEST, 'Missing user info for update.');
        }

        if (name) {
            UserModel.validateName(name);
        }

        if (email) {
            UserModel.validateEmail(email);
            await UserModel.checkIfUserExists(email);
        }

        if (password) {
            UserModel.validatePassword(password);
            password = await UserModel.hashPassword(password);
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.password = password || user.password;

        const didUpdate: boolean = await UserDal.updateUser(user);

        if (!didUpdate) {
            throw new ServerError(Errors.BAD_REQUEST, `Could not update user with id: ${id}.`);
        }

        response.status(StatusCodes.OK).json(user);
    }
}

export const { deleteUser, updateUser, getAllUsers }: typeof UserService = UserService;