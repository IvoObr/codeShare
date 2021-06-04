import logger from '../src/lib/logger';
import { handleError } from './testUtils';
import genBase36Key from '../src/lib/genBase36Key';
import { IHeaders, INewUserReq } from './interfaces';
import { IUser, IStrings } from '../src/lib/interfaces';
import { UserRole, StatusCodes } from '../src/lib/enums';

import fs from 'fs';
import path from 'path';
import https from 'https';
import { ClientRequest, IncomingMessage } from 'http';

// TODO readFileSync try catch !!!!

export default class UsersTest {

    public static config = {
        userId: '-1',
        email: '',
        password: 'Password123@',
        port: Number(process.env.PORT),
        headers: { headers: { Authorization: 'Bearer ' } }
    };

    public static async register(): Promise<void> {
        // const path: string = 'POST /auth/pub/register'.yellow;
        try {
            const name: string = 'ivoObr';
            const password: string = 'Password123@';
            const email: string = `${genBase36Key(8)}@yopmail.com`;
            const role: UserRole = UserRole.Admin;
            const payload: string = JSON.stringify({ name, email, role, password });

            const options = {
                hostname: 'localhost',
                port: Number(process.env.PORT),
                path: '/api/v1/auth/pub/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload)
                },
                key: fs.readFileSync(path.resolve(__dirname, '../ssl/private-key.pem')),
                cert: fs.readFileSync(path.resolve(__dirname, '../ssl/public-key.pem')),
                rejectUnauthorized: Boolean(Number(process.env.SELF_SIGNED_CERT))
            };

            const req: ClientRequest = https.request(options, (res: IncomingMessage): void => {
                console.log(`statusCode: ${res.statusCode}`);

                res.on('data', (data: Buffer): void => {
                    logger.debug(JSON.parse(data.toString()));

                });
            });

            req.on('error', (error: unknown): void => {
                console.error(error: unknown);
            });

            req.write(payload);
            req.end();

            // logger.success(path, response.data);

            // UsersTest.config.email = response.data.email;
            // UsersTest.config.userId = response.data._id;

            // expect(response.data.role).toBe(role);
            // expect(response.data.email).toBe(email);

        } catch (error: unknown) {
            // handleError(path, error);
        }
    }

    public static async login(email: string, password: string, statusCode?: StatusCodes): Promise<void> {
        const path: string = 'POST /api/v1/auth/pub/login'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/auth/pub/login`;
            // const payload: IStrings = { email, password };

            // const response: AxiosResponse<IUser> = await axios.post(url, payload);
            // logger.success(path, response);

            // /* authorize next requests */
            // UsersTest.config.headers.headers.Authorization = `Bearer ${response.headers?.authorization}`;

            // expect(response.data.email).toBe(UsersTest.config.email);
            // expect(typeof response.data.name).toBe('string');
            // expect(typeof response.data.role).toBe('string');

        } catch (error: unknown) {
            handleError(path, error, statusCode);
        }
    }

    public static async logout(statusCode?: StatusCodes): Promise<void> {
        const path: string = 'GET /api/v1/auth/logout'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/auth/logout`;
            // const response: AxiosResponse<IUser> = await axios.get(url, UsersTest.config.headers);
            // logger.success(path, response.status);

            // expect(response.status).toBe(200);

        } catch (error: unknown) {
            handleError(path, error, statusCode);
        }
    }

    public static async getAllUsers(statusCode?: StatusCodes): Promise<void> {
        const path: string = 'GET /api/v1/user/all'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/user/all`;
            // const response: AxiosResponse<IUser[]> = await axios.get(url, UsersTest.config.headers);
            // logger.success(path, response.data.length);

            // expect(typeof response.data.length).toBe('number');

            /* await deleteAllUsers(data, UsersFunc.config.headers); */

        } catch (error: unknown) {
            handleError(path, error, statusCode);
        }
    }

    public static async updateUser(statusCode?: StatusCodes): Promise<void> {
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

            // expect(response.status).toBe(200);
            // expect(typeof response.data.role).toBe('string');

            // userData?.email && expect(response.data.email).toBe(userData.email);
            // userData?.name && expect(response.data.name).toBe(userData.name);

            // UsersTest.config.email = userData.email;
            // UsersTest.config.password = userData.password;

        } catch (error: unknown) {
            handleError(path, error, statusCode);
        }
    }

    public static async deleteUser(statusCode?: StatusCodes) {
        const path: string = 'DELETE /api/v1/user/delete/:id'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/user/delete/${UsersTest.config.userId}`;
            // const response: AxiosResponse<IUser> = await axios.delete(url, UsersTest.config.headers);
            // logger.success(path, response.status);

            // expect(response.status).toBe(200);

        } catch (error: unknown) {
            handleError(path, error, statusCode);
        }
    }

    public static async sendResetPass(): Promise<void> {
        const path: string = 'POST /api/v1/auth/pub/send-reset-password'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/auth/pub/send-reset-password`;
            // const payload: IStrings = { email: UsersTest.config.email };

            // const response: AxiosResponse<any> = await axios.post(url, payload);
            // logger.success(path, response.status);

            // expect(response.status).toBe(201);
            // expect(response.data.receiver).toBe(UsersTest.config.email);

        } catch (error: unknown) {
            handleError(path, error);
        }
    }

    public static async resetPass(statusCode?: StatusCodes): Promise<void> {
        const path: string = 'POST /api/v1/auth/reset-password'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/auth/reset-password`;
            // const newPass: string = '4Password#';
            // const response: AxiosResponse<any> = await axios.post(url, { password: newPass }, UsersTest.config.headers);
            // logger.success(path, response);

            // expect(response.status).toBe(200);
            // UsersTest.config.password = newPass;

        } catch (error: unknown) {
            handleError(path, error, statusCode);
        }
    }

    /**************************************************************************************
    public static async deleteAllUsers(users: IUser[], headers: IHeaders): Promise<void> {
        const path: string = 'DELETE /api/v1/user/delete/:id'.yellow;
        try {
            for (let index = 0; index < users.length; index++) {
                const user: IUser = users[index];
                const url: string = `http://localhost:8080/api/v1/user/delete/${user._id}`;
                const response: AxiosResponse<IUser> = await axios.delete(url, headers);
    
            }
    
        } catch (error: unknown) {
            handleError(path, error);
        }
    }
    **************************************************************************************/
}