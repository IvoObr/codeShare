export enum UserRoles {
    Member,
    Admin,
}

export interface IUser {
    id: number;
    name: string;
    email: string;
    pwdHash: string;
    role: UserRoles;
    tokens: string[]
}

export class User implements IUser {

    public tokens: string[] = [];

    constructor(
        public email: string,
        public role: UserRoles,
        public pwdHash: string,
        public id: number,
        public name: string
    ) {
        // if (typeof nameOrUser === 'string' || typeof nameOrUser === 'undefined') {
        //     this.email = email || '';
        //     this.role = role || UserRoles.Member;
        //     this.pwdHash = pwdHash || '';
        //     this.id = id || -1;
        // } else {
        //     this.name = nameOrUser.name;
        //     this.email = nameOrUser.email;
        //     this.role = nameOrUser.role;
        //     this.pwdHash = nameOrUser.pwdHash;
        //     this.id = nameOrUser.id;
        // }
    }
}
