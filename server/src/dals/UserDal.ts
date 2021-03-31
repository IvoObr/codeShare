import logger from '@logger';
import { Mongo } from '@db';
import mongodb from 'mongodb';
import { InsertOneWriteOpResult } from 'mongodb';
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

    public async addUser(user: IUser): Promise<IUser> {
        const result: InsertOneWriteOpResult<any> = await Mongo.db
            .collection(Const.USERS)
            .insertOne(user); 
        
        return result.ops[0] as IUser;
    }

    public async update(user: IUser): Promise<void> {
        // TODO
        return Promise.resolve(undefined);
    }

    public async deleteUser(id: string): Promise<number> {
        const result: mongodb.DeleteWriteOpResultObject = await Mongo.db
            .collection(Const.USERS)
            .deleteOne({ _id: new mongodb.ObjectID(id) });
        
        return result.deletedCount || 0;
    }
}

export default new UserDal();
