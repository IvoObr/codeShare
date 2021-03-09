import { IUser } from '@entities/User';


export interface IUserDal {
    getOne: (email: string) => Promise<IUser | null>;
    getAll: () => Promise<IUser[]>;
    add: (user: IUser) => Promise<void>;
    update: (user: IUser) => Promise<void>;
    delete: (id: number) => Promise<void>;
}

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

    public async update(user: IUser): Promise<void> {z
        // TODO
        return Promise.resolve(undefined);
    }

    public async delete(id: number): Promise<void> {
        // TODO
        return Promise.resolve(undefined);
    }
}

export default UserDal;
