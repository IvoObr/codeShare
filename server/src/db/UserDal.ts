import { Mongo } from '@db';
import { IUser, Collections, IStrings, IUserModel, Errors, StatusCodes } from '@utils';
import mongodb, { ObjectId, InsertOneWriteOpResult, UpdateQuery } from 'mongodb';
import { ServerError } from 'src/lib';

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

    public async addUser(user: IUserModel): Promise<IUser> {
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
        const _id: mongodb.ObjectID = new ObjectId(userId);
        const updateToken: UpdateQuery<{ $push: IStrings}> = { $push: { 'tokens': token } };

        const result: mongodb.UpdateWriteOpResult = await Mongo.db
            .collection(Collections.USERS)
            .updateOne({ _id }, updateToken);
                
        return result?.result?.nModified === 1;
    }

    public async removeTokens(userId: string): Promise<boolean> {
        const _id: mongodb.ObjectID = new ObjectId(userId);
        const updateToken: UpdateQuery<{ $set: IStrings }> = { $set: { 'tokens': []} };

        const result: mongodb.UpdateWriteOpResult = await Mongo.db
            .collection(Collections.USERS)
            .updateOne({ _id }, updateToken);
        
        return result?.result?.nModified === 1;
    }

    public async deleteUser(userId: string): Promise<number> {
        const isValid: boolean = ObjectId.isValid(userId);

        if (!isValid) {
            throw new ServerError(Errors.NOT_FOUND, `invalid userId: ${userId}`);
        }
        const _id: mongodb.ObjectID = new ObjectId(userId);

        const result: mongodb.DeleteWriteOpResultObject = await Mongo.db
            .collection(Collections.USERS)
            .deleteOne({ _id });
        
        return result.deletedCount || 0;
    }
}

export default new UserDal();
