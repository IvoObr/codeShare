import { IUser } from '@entities/User';
import { getRandomInt } from 'src/lib/utils';
import { IUserDal } from './UserDal';
import MockDaoMock from '../MockDb/MockDal.mock';

class UserDal extends MockDaoMock implements IUserDal {

    public async getOne(email: string): Promise<IUser | null> {
        const db = await super.openDb();
        for (const user of db.users) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    public async getAll(): Promise<IUser[]> {
        const db = await super.openDb();
        return db.users;
    }

    public async add(user: IUser): Promise<void> {
        const db = await super.openDb();
        user.id = getRandomInt();
        db.users.push(user);
        await super.saveDb(db);
    }

    public async update(user: IUser): Promise<void> {
        const db = await super.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[ i ].id === user.id) {
                db.users[ i ] = user;
                await super.saveDb(db);
                return;
            }
        }
        throw new Error('User not found');
    }

    public async delete(id: number): Promise<void> {
        const db = await super.openDb();
        for (let i = 0; i < db.users.length; i++) {
            if (db.users[ i ].id === id) {
                db.users.splice(i, 1);
                await super.saveDb(db);
                return;
            }
        }
        throw new Error('User not found');
    }
}

export default UserDal;
