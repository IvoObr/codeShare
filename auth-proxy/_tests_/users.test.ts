import dotenv from 'dotenv';
import colors from 'colors';
import UsersTest from './UsersTest';
import { StatusCodes } from '../src/lib/enums';
colors.enable();
dotenv.config();

describe('Authorized 200 OK Users api tests', (): void => {

    it.only('POST /api/v1/auth/pub/register user in DB', UsersTest.register);

    it('POST /api/v1/auth/pub/login user in DB',
        async (): Promise<void> => await UsersTest.login(UsersTest.config.email, UsersTest.config.password));

    it('POST /api/v1/auth/pub/send-reset-password', UsersTest.sendResetPass);

    it('POST /api/v1/auth/reset-password',
        async (): Promise<void> => await UsersTest.resetPass());
   
    it('GET /api/v1/api/user/all returns all users',
        async (): Promise<void> => await UsersTest.getAllUsers());

    it('PUT /api/v1/user/update/:id user in DB',
        async (): Promise<void> => await UsersTest.updateUser());
    
    it('GET /api/v1/auth/logout user in DB',
        async (): Promise<void> => await UsersTest.logout());

    it('POST /api/v1/auth/pub/login user in DB',
        async (): Promise<void> => await UsersTest.login(UsersTest.config.email, UsersTest.config.password));
       
    it('DELETE /api/v1/user/delete/:id user in DB',
        async (): Promise<void> => await UsersTest.deleteUser());
    
});

describe('Unauthorized 401 Users api tests', (): void => {

    it('401 POST /api/v1/auth/pub/login user in DB',
        async (): Promise<void> => await UsersTest.login(UsersTest.config.email, 'incorrect password', StatusCodes.UNAUTHORIZED));

    it('401 GET /api/v1/api/user/all returns all users',
        async (): Promise<void> => await UsersTest.getAllUsers(StatusCodes.UNAUTHORIZED));

    it('401 PUT /api/v1/user/update/:id user in DB',
        async (): Promise<void> => await UsersTest.updateUser(StatusCodes.UNAUTHORIZED));

    it('401 DELETE /api/v1/user/delete/:id user in DB',
        async (): Promise<void> => await UsersTest.deleteUser(StatusCodes.UNAUTHORIZED));

    it('401 GET /api/v1/auth/logout user in DB',
        async (): Promise<void> => await UsersTest.logout(StatusCodes.UNAUTHORIZED));

    it('401 POST /api/v1/auth/reset-password',
        async (): Promise<void> => await UsersTest.resetPass(StatusCodes.UNAUTHORIZED));
});