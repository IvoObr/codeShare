import { Mongo } from '@db';
import { ServerError } from '@services';
import { IUser, Collections, IStrings, IUserModel, Errors } from '@utils';
import mongodb, { ObjectId, InsertOneWriteOpResult, UpdateQuery } from 'mongodb';

class UserDal {

    private validateId(id: string): void {
        if (!ObjectId.isValid(id)) {
            throw new ServerError(Errors.NOT_FOUND, `Invalid mongo id: ${id}`?.yellow);
        }
    }

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

    public async getUserById(userId: string): Promise<IUser> {
        this.validateId(userId);

        const _id: mongodb.ObjectID = new ObjectId(userId);

        const result: IUser[] = await Mongo.db
            .collection(Collections.USERS)
            .find({ _id })
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

    public async updateUser(user: IUser): Promise<boolean> {
        this.validateId(user._id);

        const _id: mongodb.ObjectID = new ObjectId(user._id);

        const result: mongodb.ReplaceWriteOpResult = await Mongo.db
            .collection(Collections.USERS)
            .replaceOne({ _id }, user);
        
        return result.modifiedCount === 1 || result.matchedCount === 1;
    }

    public async setToken(token: string, userId: string): Promise<boolean> {
        this.validateId(userId);

        const _id: mongodb.ObjectID = new ObjectId(userId);
        const updateToken: UpdateQuery<{ $push: IStrings}> = { $push: { 'tokens': token } };

        const result: mongodb.UpdateWriteOpResult = await Mongo.db
            .collection(Collections.USERS)
            .updateOne({ _id }, updateToken);
                
        return result?.result?.nModified === 1;
    }

    public async removeTokens(userId: string): Promise<boolean> {
        this.validateId(userId);

        const _id: mongodb.ObjectID = new ObjectId(userId);
        const updateToken: UpdateQuery<{ $set: IStrings }> = { $set: { 'tokens': []} };

        const result: mongodb.UpdateWriteOpResult = await Mongo.db
            .collection(Collections.USERS)
            .updateOne({ _id }, updateToken);
        
        return result?.result?.nModified === 1;
    }

    public async deleteUser(userId: string): Promise<number> {
        this.validateId(userId);

        const _id: mongodb.ObjectID = new ObjectId(userId);

        const result: mongodb.DeleteWriteOpResultObject = await Mongo.db
            .collection(Collections.USERS)
            .deleteOne({ _id });
        
        return result.deletedCount || 0;
    }
}

export default new UserDal();
