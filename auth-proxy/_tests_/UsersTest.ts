import fs from 'fs';
import path from 'path';
import logger from '../src/lib/logger';
import { RequestOptions } from 'https';
import { IncomingMessage } from 'http';
import { httpsRequest } from './testUtils';
import genBase36Key from '../src/lib/genBase36Key';
import { IUser, IStrings } from '../src/lib/interfaces';
import { ICerts, Methods, IPublicUser } from './interfaces';
import { UserRole, StatusCodes, Headers } from '../src/lib/enums';

export default class UsersTest {

    public static config = {
        userId: '-1',
        email: '',
        password: 'Password123@',
        headers: { headers: { Authorization: 'Bearer ' } }
    };

    private static setKeys(): ICerts | undefined {
        try {
            return {
                key: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.key')),
                cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.crt')),
                ca: fs.readFileSync(path.resolve(__dirname, '../../ssl/rootCA.crt'))
            };
        } catch (error: unknown) {
            logger.error(error);
        }
    }

    private static getOptions(method: string, path: string, payload: string): RequestOptions {
        return {
            path: path,
            method: method,
            hostname: 'localhost',
            port: Number(process.env.PORT),
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload),
                [Headers.Authorization]: UsersTest.config.headers.headers.Authorization
            }, ...UsersTest.setKeys() as ICerts
        };
    }

    public static async register(): Promise<void> {
        // for (let index: number = 0; index < 50; index++) { /*** register multiple users ***/
        const name: string = 'ivoObr';
        const role: UserRole = UserRole.Admin;
        const password: string = 'Password123@';
        const path: string = '/api/v1/auth/pub/register';
        const email: string = `${genBase36Key(8)}@yopmail.com`;
        const payload: string = JSON.stringify({ name, email, role, password });
        const options: RequestOptions = UsersTest.getOptions(Methods.POST, path, payload);

        await httpsRequest(options, payload, function(message: IncomingMessage, data: string) {
            const user: IUser = JSON.parse(data);
            UsersTest.config.email = user.email;
            UsersTest.config.userId = user._id;

            expect(user.role).toBe(role);
            expect(user.email).toBe(email);
        });
        // }
    }

    public static async login(email: string, password: string, statusCode?: StatusCodes): Promise<void> {
        const path: string = '/api/v1/auth/pub/login';
        const payload: string = JSON.stringify({ email, password });
        const options: RequestOptions = UsersTest.getOptions(Methods.POST, path, payload);

        await httpsRequest(options, payload, function(message: IncomingMessage, data: string) {
            const user: IUser = JSON.parse(data);
            const token: string = message.headers.authorization || '';
            
            /* authorize next requests */
            UsersTest.config.headers.headers.Authorization = `Bearer ${token}`;
            logger.info("TOKEN:".cyan, token);

            expect(user.email).toBe(UsersTest.config.email);
            expect(typeof user.name).toBe('string');
            expect(typeof user.role).toBe('string');
        }, statusCode);
    }

    public static async logout(statusCode?: StatusCodes): Promise<void> {
        const path: string = '/api/v1/auth/logout';
        const options: RequestOptions = UsersTest.getOptions(Methods.GET, path, '');

        await httpsRequest(options, '', function(message: IncomingMessage) {
            expect(message.statusCode).toBe(StatusCodes.OK);
        }, statusCode);
    }

    public static async getAllUsers(statusCode?: StatusCodes): Promise<void> {
        const path: string = '/api/v1/user/all';
        const options: RequestOptions = UsersTest.getOptions(Methods.GET, path, '');
        let users: IPublicUser[] = [];

        await httpsRequest(options, '', function(message: IncomingMessage, data: string) {
            expect(message.statusCode).toBe(StatusCodes.OK);
            users = JSON.parse(data);
            
            if (users.length > 0) { 
                expect(typeof users[0]._id).toBe('string');
                expect(typeof users[0].email).toBe('string');
                expect(typeof users[0].name).toBe('string');
                expect(typeof users[0].role).toBe('string');
            }

            expect(typeof users.length).toBe('number');
        }, statusCode);

        /* await UsersTest.deleteAllUsers(users);  */
    }

    public static async updateUser(statusCode?: StatusCodes): Promise<void> {
        const path: string = '/api/v1/user/update/';
        const userData: IStrings = {
            email: `${genBase36Key(8)}@yopmail.com`,
            name: 'IvoG',
            password: 'Password123@'
        };

        const payload: string = JSON.stringify(userData);
        const options: RequestOptions = UsersTest.getOptions(Methods.PUT, path + UsersTest.config.userId, payload);

        await httpsRequest(options, payload, function(message: IncomingMessage, data: string) {
            const user: IPublicUser = JSON.parse(data);
            UsersTest.config.email = userData.email;

            expect(message.statusCode).toBe(StatusCodes.OK);
            expect(typeof user.role).toBe('string');
            expect(typeof user._id).toBe('string');

            userData?.email && expect(user.email).toBe(userData.email);
            userData?.name && expect(user.name).toBe(userData.name);

            UsersTest.config.email = userData.email;
            UsersTest.config.password = userData.password;
        }, statusCode); 
    }

    public static async deleteUser(statusCode?: StatusCodes): Promise<void> {
        const path: string = '/api/v1/user/delete/';
        const options: RequestOptions = UsersTest.getOptions(Methods.DELETE, path + UsersTest.config.userId, '');

        await httpsRequest(options, '', function(message: IncomingMessage) {
            expect(message.statusCode).toBe(StatusCodes.OK);
        }, statusCode);
    }

    public static async sendResetPass(): Promise<void> {
        const path: string = '/api/v1/auth/pub/send-reset-password';
        const payload: string = JSON.stringify({ email: UsersTest.config.email });
        const options: RequestOptions = UsersTest.getOptions(Methods.POST, path, payload);

        await httpsRequest(options, payload, function(message: IncomingMessage, data: string) {
            expect(message.statusCode).toBe(StatusCodes.CREATED);
            expect(JSON.parse(data).receiver).toBe(UsersTest.config.email);
        });
    }
    
    public static async resetPass(statusCode?: StatusCodes): Promise<void> {
        const path: string = '/api/v1/auth/reset-password';
        const newPass: string = '4Password#';
        const payload: string = JSON.stringify({ password: newPass });
        const options: RequestOptions = UsersTest.getOptions(Methods.POST, path, payload);

        await httpsRequest(options, payload, function(message: IncomingMessage) {
            expect(message.statusCode).toBe(StatusCodes.OK);
            UsersTest.config.password = newPass;
        }, statusCode);
    }

    /**************************************************************************************/
    public static async deleteAllUsers(users: IPublicUser[]): Promise<void> {     
        const path: string = '/api/v1/user/delete/';
        const options: RequestOptions = UsersTest.getOptions(Methods.DELETE, path, '');
        
        for (let index: number = 0; index < users.length; index++) {
            const user: IPublicUser = users[index];
            options.path = path + user._id;

            await httpsRequest(options, '', function() { null;});
        }
    }
    /**************************************************************************************/
}