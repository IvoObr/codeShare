import { Mongo } from '@db';
import { UserModel } from "@entities";
import { IUser, logger, Collections } from '@utils';
import mongodb, { InsertOneWriteOpResult } from 'mongodb';

class UserDal {

    public async getUserByEmail(email: string): Promise<IUser> {
        const result: IUser[] = await Mongo.db
            .collection(Collections.USERS)
            .find({ email })
            .toArray();
        
        return result[0] || null;
    }

    public async getUserByToken(token: string): Promise<IUser> {
        const result: IUser[] = await Mongo.db
            .collection(Collections.USERS)
            .find({ tokens: token })
            .toArray();
        
        return result[0] || null;
    }

    public async getAllUsers(): Promise<IUser[]> {
        const result: IUser[] = await Mongo.db
            .collection(Collections.USERS)
            .find()
            .toArray();
        
        return result;
    }

    public async addUser(user: UserModel): Promise<IUser> {
        const result: InsertOneWriteOpResult<any> = await Mongo.db
            .collection(Collections.USERS)
            .insertOne(user); 
        
        return result.ops[0] as IUser;
    }

    public async update(user: IUser): Promise<void> {
        // TODO
        return Promise.resolve(undefined);
    }

    public async setToken(token: string, userId: string): Promise<boolean> {
        const query: any = { id: userId };
        const updateToken: any = { $push: { 'tokens': token } };

        const result: mongodb.UpdateWriteOpResult = await Mongo.db
            .collection(Collections.USERS)
            .updateOne(query, updateToken);
                
        return result?.result?.nModified === 1;
    }

    public async removeTokens(userId: string): Promise<boolean> {
        const query: any = { id: userId };
        const updateToken: any = { $set: { 'tokens': []} };

        const result: mongodb.UpdateWriteOpResult = await Mongo.db
            .collection(Collections.USERS)
            .updateOne(query, updateToken);
        
        return result?.result?.nModified === 1;
    }

    public async deleteUser(id: string): Promise<number> {   
        const result: mongodb.DeleteWriteOpResultObject = await Mongo.db
            .collection(Collections.USERS)
            .deleteOne({ id });
        
        return result.deletedCount || 0;
    }
}

export default new UserDal();
