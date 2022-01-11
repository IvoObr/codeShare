import fs from 'fs';
import path from 'path';
import logger from '../src/lib/logger';
import { RequestOptions } from 'https';
import { httpsRequest } from './testUtils';
import genBase36Key from '../src/lib/genBase36Key';
import { ClientRequest, IncomingMessage } from 'http';
import { IUser, IStrings } from '../src/lib/interfaces';
import { UserRole, StatusCodes, Headers } from '../src/lib/enums';
import { IHeaders, INewUserReq, ICerts, Methods, IPublicUser } from './interfaces';

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
        // for (let index = 0; index < 50; index++) { /*** register multiple users ***/
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
        });
    }

    public static logout(statusCode?: StatusCodes): void {
        const path: string = 'GET /api/v1/auth/logout'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/auth/logout`;
            // const response: AxiosResponse<IUser> = await axios.get(url, UsersTest.config.headers);
            // logger.success(path, response.status);

            // expect(response.status).toBe(StatusCodes.OK);

        } catch (error) {
            // handleError(path, error, statusCode);
        }
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
        });

        /* await UsersTest.deleteAllUsers(users);  */
    }

    public static updateUser(statusCode?: StatusCodes): void {
        const path: string = 'PUT /api/v1/user/update/:id'.yellow;
        try {
            // const userData: IStrings = {
            //     email: `${genBase36Key(8)}@yopmail.com`,
            //     name: 'IvoG',
            //     password: 'Password123@'
            // };
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/user/update/${UsersTest.config.userId}`;
            // const response: AxiosResponse<IUser> = await axios.put(url, userData, UsersTest.config.headers);
            // logger.success(path, response.status);

            // UsersTest.config.email = userData.email;

            // expect(response.status).toBe(StatusCodes.OK);
            // expect(typeof response.data.role).toBe('string');

            // userData?.email && expect(response.data.email).toBe(userData.email);
            // userData?.name && expect(response.data.name).toBe(userData.name);

            // UsersTest.config.email = userData.email;
            // UsersTest.config.password = userData.password;

        } catch (error) {
            // handleError(path, error, statusCode);
        }
    }

    public static deleteUser(statusCode?: StatusCodes): void {
        const path: string = 'DELETE /api/v1/user/delete/:id'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/user/delete/${UsersTest.config.userId}`;
            // const response: AxiosResponse<IUser> = await axios.delete(url, UsersTest.config.headers);
            // logger.success(path, response.status);

            // expect(response.status).toBe(StatusCodes.OK);

        } catch (error) {
            // handleError(path, error, statusCode);
        }
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

        await httpsRequest(options, payload, function(message: IncomingMessage, data: string) {
            expect(message.statusCode).toBe(StatusCodes.OK);
            UsersTest.config.password = newPass;
        });
    }

    /**************************************************************************************/
    public static async deleteAllUsers(users: IPublicUser[]): Promise<void> {     
        const path: string = '/api/v1/user/delete/';
        const options: RequestOptions = UsersTest.getOptions(Methods.DELETE, path, '');
        
        for (let index = 0; index < users.length; index++) {
            const user: IPublicUser = users[index];
            options.path = path + user._id;

            await httpsRequest(options, '', function(message: IncomingMessage, data: string) {
                expect(message.statusCode).toBe(StatusCodes.OK);
            });
        }
    }
    /**************************************************************************************/
}