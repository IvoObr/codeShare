import logger from '@logger';
import { Mongo } from '@db';
import { IUser, IUserDal } from '@interfaces';
import * as Const from '@constants';

class UserDal {

    public async getUserByEmail(email: string): Promise<IUser> {
        const result: IUser[] = await Mongo.db
            .collection(Const.USERS)
            .find({ email })
            .toArray();
        
        return result[0] || null;
    }

    public async getAllUsers(): Promise<IUser[]> {
        return await Mongo.db
            .collection(Const.USERS)
            .find()
            .toArray();
    }

    public async add(user: IUser): Promise<void> {
        // TODO
        return Promise.resolve(undefined);
    }

    public async update(user: IUser): Promise<void> {
        // TODO
        return Promise.resolve(undefined);
    }

    public async delete(id: number): Promise<void> {
        // TODO
        return Promise.resolve(undefined);
    }
}

export default new UserDal();
