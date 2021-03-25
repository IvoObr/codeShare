import { IUser, IUserDal } from '@interfaces';

class UserDal implements IUserDal {

    public getOne(email: string): Promise<IUser | null> {
        // TODO
        return Promise.resolve(null);
    }

    public getAll(): Promise<IUser[]> {
        // TODO
        return Promise.resolve([]);
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

export default UserDal;
