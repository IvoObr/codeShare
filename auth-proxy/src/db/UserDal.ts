import Mongo from './mongo';
import { IUser } from '../lib/interfaces';
import { Collections } from '../lib/enums';

class UserDal {

    public async getUserByToken(token: string): Promise<IUser> {
        const result: IUser[] = await Mongo.db
            .collection(Collections.USERS)
            .find({ tokens: token })
            .toArray();
        
        return result[0] || null;
    }
}

export default new UserDal();
