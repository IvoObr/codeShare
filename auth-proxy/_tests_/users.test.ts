import dotenv from 'dotenv';
import colors from 'colors';
import UsersTest from './UsersTest';
import { StatusCodes } from '../src/lib/enums';
colors.enable();
dotenv.config();

describe('Authorized 200 OK Users api tests', (): void => {

    it('POST /api/v1/auth/pub/register user in DB', UsersTest.register);

    it('POST /api/v1/auth/pub/login user in DB',
        function() { UsersTest.login(UsersTest.config.email, UsersTest.config.password); });

    it.skip('POST /api/v1/auth/pub/send-reset-password', UsersTest.sendResetPass);

    it.skip('POST /api/v1/auth/reset-password',
        function() { UsersTest.resetPass(); });
   
    it.skip('GET /api/v1/api/user/all returns all users',
        function() { UsersTest.getAllUsers(); });

    it.skip('PUT /api/v1/user/update/:id user in DB',
        function() { UsersTest.updateUser(); });
    
    it.skip('GET /api/v1/auth/logout user in DB',
        function() { UsersTest.logout(); });

    it.skip('POST /api/v1/auth/pub/login user in DB',
        function() { UsersTest.login(UsersTest.config.email, UsersTest.config.password); });
       
    it.skip('DELETE /api/v1/user/delete/:id user in DB',
        function() { UsersTest.deleteUser(); });
    
});

describe('Unauthorized 401 Users api tests', (): void => {

    it.skip('401 POST /api/v1/auth/pub/login user in DB',
        function() { UsersTest.login(UsersTest.config.email, 'incorrect password', StatusCodes.UNAUTHORIZED); });

    it.skip('401 GET /api/v1/api/user/all returns all users',
        function() { UsersTest.getAllUsers(StatusCodes.UNAUTHORIZED); });

    it.skip('401 PUT /api/v1/user/update/:id user in DB',
        function() { UsersTest.updateUser(StatusCodes.UNAUTHORIZED); });

    it.skip('401 DELETE /api/v1/user/delete/:id user in DB',
        function() { UsersTest.deleteUser(StatusCodes.UNAUTHORIZED); });

    it.skip('401 GET /api/v1/auth/logout user in DB',
        function() { UsersTest.logout(StatusCodes.UNAUTHORIZED); });

    it.skip('401 POST /api/v1/auth/reset-password',
        function() { UsersTest.resetPass(StatusCodes.UNAUTHORIZED); });
});