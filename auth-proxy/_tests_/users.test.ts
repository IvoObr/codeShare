import dotenv from 'dotenv';
import colors from 'colors';
import UsersTest from './UsersTest';
import genBase36Key from '../src/lib/genBase36Key';
import { StatusCodes, UserRole } from '../src/lib/enums';
colors.enable();
dotenv.config();

const INCORRECT_PASS: string = 'password111';
const INCORRECT_EMAIL: string = 'incorrect@email';

describe('SSL', (): void => {

    it('201   *          POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register(); });
    
    it('201   *          POST     /api/v1/auth/pub/send-confirm-registration',
        async function() { await UsersTest.sendConfirmRegistration(UsersTest.config.email); });
    
    it('201   *          POST     /api/v1/auth/confirm-registration',
        async function() { await UsersTest.confirmRegistration(); });

    it('200   *          POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(UsersTest.config.email, UsersTest.config.password); });

    it.skip('200   *          POST     /api/v1/auth/pub/send-reset-password',
        async function() { await UsersTest.sendResetPass(); });
});

describe('OK 200 <Users api tests>', (): void => {

    it('201   *          POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register(); });
    
    it('201   *         POST     /api/v1/auth/pub/send-confirm-registration',
        async function() { await UsersTest.sendConfirmRegistration(UsersTest.config.email); });

    it('201   *         POST     /api/v1/auth/confirm-registration',
        async function() { await UsersTest.confirmRegistration(); });

    it('200   *          POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(UsersTest.config.email, UsersTest.config.password); });

    it('200   *          POST     /api/v1/auth/pub/send-reset-password',
        async function() { await UsersTest.sendResetPass(); });

    it('200   *          POST     /api/v1/auth/reset-password',
        async function() { await UsersTest.resetPass(); });
   
    it('200   *          GET      /api/v1/api/user/all',
        async function() { await UsersTest.getAllUsers(false); });

    it('200   *          PUT      /api/v1/user/update/:id',
        async function() { await UsersTest.updateUser(); });
    
    it('200   *          GET      /api/v1/auth/logout',
        async function() { await UsersTest.logout(); });

    it('200   *          POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(UsersTest.config.email, UsersTest.config.password); });
       
    it('200   *          DELETE   /api/v1/user/delete/:id',
        async function() { await UsersTest.deleteUser(); });
    
});

describe('Bad Request 400 <Users api tests>', (): void => {
    
    it('400   Name       POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register('', UserRole.Admin, 'Password123@', `${genBase36Key(8)}@yopmail.com`, StatusCodes.BAD_REQUEST); });
    
    it('400   Role       POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register('ivoObr', {} as UserRole, 'Password123@', `${genBase36Key(8)}@yopmail.com`, StatusCodes.BAD_REQUEST); });

    it('400   Password   POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register('ivoObr', UserRole.Admin, INCORRECT_PASS, `${genBase36Key(8)}@yopmail.com`, StatusCodes.BAD_REQUEST); });
        
    it('400   Email      POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register('ivoObr', UserRole.Admin, 'Password123@', INCORRECT_EMAIL, StatusCodes.BAD_REQUEST); });
        
    it('201   *          POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register(); });
    
    it('201   *         POST     /api/v1/auth/pub/send-confirm-registration',
        async function() { await UsersTest.sendConfirmRegistration(UsersTest.config.email); });

    it('201   *         POST     /api/v1/auth/confirm-registration',
        async function() { await UsersTest.confirmRegistration(); });
    
    it('200   *          POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(UsersTest.config.email, UsersTest.config.password); });
    
    it('400   Name       PUT      /api/v1/user/update/:id',
        async function() { await UsersTest.updateUser([] as any as string, 'Password123@', `${genBase36Key(8)}@yopmail.com`, StatusCodes.BAD_REQUEST); });
    
    it('400   Password   PUT      /api/v1/user/update/:id',
        async function() { await UsersTest.updateUser('IvoG', INCORRECT_PASS, `${genBase36Key(8)}@yopmail.com`, StatusCodes.BAD_REQUEST); });
    
    it('400   Email      PUT      /api/v1/user/update/:id',
        async function() { await UsersTest.updateUser('IvoG', 'Password123@', INCORRECT_EMAIL, StatusCodes.BAD_REQUEST); });

    it('403   Email      POST     /api/v1/auth/pub/send-reset-password',
        async function() { await UsersTest.sendResetPass(INCORRECT_EMAIL, StatusCodes.FORBIDDEN); });

    it('400   Password   POST     /api/v1/auth/reset-password',
        async function() { await UsersTest.resetPass(INCORRECT_PASS, StatusCodes.BAD_REQUEST); });

    it('200   *          DELETE   /api/v1/user/delete/:id',
        async function() { await UsersTest.deleteUser(); });

});

describe('Unauthorized 401 <Users api tests>', (): void => {

    it('201   *         POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register(); });

    it('201   *         POST     /api/v1/auth/pub/send-confirm-registration',
        async function() { await UsersTest.sendConfirmRegistration(UsersTest.config.email); });

    it('201   *         POST     /api/v1/auth/confirm-registration',
        async function() { await UsersTest.confirmRegistration(); });
    
    it('401   Password  POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(UsersTest.config.email, INCORRECT_PASS, StatusCodes.UNAUTHORIZED); });
    
    it('403   Email     POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(INCORRECT_EMAIL, UsersTest.config.password, StatusCodes.FORBIDDEN); });
  
    it('401   *         GET      /api/v1/api/user/all',
        async function() { await UsersTest.getAllUsers(false, StatusCodes.UNAUTHORIZED); });

    it('401   *         PUT      /api/v1/user/update/:id',
        async function() { await UsersTest.updateUser(undefined, undefined, undefined, StatusCodes.UNAUTHORIZED); });

    it('401   *         DELETE   /api/v1/user/delete/:id',
        async function() { await UsersTest.deleteUser(StatusCodes.UNAUTHORIZED); });

    it('401   *         GET      /api/v1/auth/logout',
        async function() { await UsersTest.logout(StatusCodes.UNAUTHORIZED); });

    it('401   *         POST     /api/v1/auth/reset-password',
        async function() { await UsersTest.resetPass(undefined, StatusCodes.UNAUTHORIZED); });
    
    it('200   *         POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(UsersTest.config.email, UsersTest.config.password); });

    it('200   *         DELETE   /api/v1/user/delete/:id',
        async function() { await UsersTest.deleteUser(); });
});

describe('Forbidden 403 <Users api tests>', (): void => {
    
    it('201   *         POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register(); });

    it('201   *         POST     /api/v1/auth/pub/send-confirm-registration',
        async function() { await UsersTest.sendConfirmRegistration(UsersTest.config.email); });

    it('403   *n        POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(UsersTest.config.email, UsersTest.config.password, StatusCodes.FORBIDDEN); });

    it('403   *         GET      /api/v1/api/user/all',
        async function() { await UsersTest.getAllUsers(false, StatusCodes.FORBIDDEN); });

    it('403   *         PUT      /api/v1/user/update/:id',
        async function() { await UsersTest.updateUser(undefined, undefined, undefined, StatusCodes.FORBIDDEN); });

    it('403   *         DELETE   /api/v1/user/delete/:id',
        async function() { await UsersTest.deleteUser(StatusCodes.FORBIDDEN); });

    it('403   *         GET      /api/v1/auth/logout',
        async function() { await UsersTest.logout(StatusCodes.FORBIDDEN); });

    it('403   *         POST     /api/v1/auth/reset-password',
        async function() { await UsersTest.resetPass(undefined, StatusCodes.FORBIDDEN); });

    it('201   *         POST     /api/v1/auth/confirm-registration',
        async function() { await UsersTest.confirmRegistration(); });
   
    it('200   *         POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(UsersTest.config.email, UsersTest.config.password); });

    it('200   *         DELETE   /api/v1/user/delete/:id',
        async function() { await UsersTest.deleteUser(); });
});

describe.skip('Delete all users <Users api tests>', (): void => {

    it('201   *         POST     /api/v1/auth/pub/register',
        async function() { await UsersTest.register(); });

    it('201   *         POST     /api/v1/auth/pub/send-confirm-registration',
        async function() { await UsersTest.sendConfirmRegistration(UsersTest.config.email); });
    
    it('201   *         POST     /api/v1/auth/confirm-registration',
        async function() { await UsersTest.confirmRegistration(); });

    it('200   *         POST     /api/v1/auth/pub/login',
        async function() { await UsersTest.login(UsersTest.config.email, UsersTest.config.password); });

    it('200   *         GET      /api/v1/api/user/all delete all users',
        async function() { await UsersTest.getAllUsers(true); });
});