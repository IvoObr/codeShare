import fs from 'fs';
import path from 'path';
import logger from '../src/lib/logger';
import { handleError } from './testUtils';
import genBase36Key from '../src/lib/genBase36Key';
import { ClientRequest, IncomingMessage } from 'http';
import { IUser, IStrings } from '../src/lib/interfaces';
import { UserRole, StatusCodes } from '../src/lib/enums';
import { IHeaders, INewUserReq, ICerts } from './interfaces';
import https, { RequestOptions, ServerOptions } from 'https';

export default class UsersTest {

    public static config = {
        userId: '-1',
        email: '',
        password: 'Password123@',
        port: Number(process.env.PORT),
        headers: { headers: { Authorization: 'Bearer ' } }
    };

    private static setKeys(): ICerts | undefined {
        try {
            return {
                key: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.key')),
                cert: fs.readFileSync(path.resolve(__dirname, '../../ssl/codeShare.crt')),
                ca: fs.readFileSync(path.resolve(__dirname, '../../ssl/rootCA.crt'))
            };
        } catch (error) {
            logger.error(error);
        }
    }

    public static register(): void {
        // const path: string = 'POST /auth/pub/register'.yellow;
        try {
            const name: string = 'ivoObr';
            const password: string = 'Password123@';
            const email: string = `${genBase36Key(8)}@yopmail.com`;
            const role: UserRole = UserRole.Admin;
            const payload: string = JSON.stringify({ name, email, role, password });

            let options: RequestOptions = {
                hostname: 'localhost',
                port: Number(process.env.PORT),
                path: '/api/v1/auth/pub/register',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(payload)
                }
            };

            options = { ...options, ...UsersTest.setKeys() };

            const req: ClientRequest = https.request(options, (res: IncomingMessage): void => {
                console.log(`statusCode: ${res.statusCode}`);

                // TODO: send requests to [proxy]

                res.on('data', (data: Buffer): void => {
                    logger.debug(JSON.parse(data.toString()));

                });
            });

            req.on('error', (error): void => {
                console.error(error);
            });

            req.write(payload);
            req.end();

            // logger.success(path, response.data);

            // UsersTest.config.email = response.data.email;
            // UsersTest.config.userId = response.data._id;

            // expect(response.data.role).toBe(role);
            // expect(response.data.email).toBe(email);

        } catch (error) {
            // handleError(path, error);
        }
    }

    public static login(email: string, password: string, statusCode?: StatusCodes): void {
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

        } catch (error) {
            handleError(path, error, statusCode);
        }
    }

    public static logout(statusCode?: StatusCodes): void {
        const path: string = 'GET /api/v1/auth/logout'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/auth/logout`;
            // const response: AxiosResponse<IUser> = await axios.get(url, UsersTest.config.headers);
            // logger.success(path, response.status);

            // expect(response.status).toBe(200);

        } catch (error) {
            handleError(path, error, statusCode);
        }
    }

    public static getAllUsers(statusCode?: StatusCodes): void {
        const path: string = 'GET /api/v1/user/all'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/user/all`;
            // const response: AxiosResponse<IUser[]> = await axios.get(url, UsersTest.config.headers);
            // logger.success(path, response.data.length);

            // expect(typeof response.data.length).toBe('number');

            /* await deleteAllUsers(data, UsersFunc.config.headers); */

        } catch (error) {
            handleError(path, error, statusCode);
        }
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

            // expect(response.status).toBe(200);
            // expect(typeof response.data.role).toBe('string');

            // userData?.email && expect(response.data.email).toBe(userData.email);
            // userData?.name && expect(response.data.name).toBe(userData.name);

            // UsersTest.config.email = userData.email;
            // UsersTest.config.password = userData.password;

        } catch (error) {
            handleError(path, error, statusCode);
        }
    }

    public static deleteUser(statusCode?: StatusCodes): void {
        const path: string = 'DELETE /api/v1/user/delete/:id'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/user/delete/${UsersTest.config.userId}`;
            // const response: AxiosResponse<IUser> = await axios.delete(url, UsersTest.config.headers);
            // logger.success(path, response.status);

            // expect(response.status).toBe(200);

        } catch (error) {
            handleError(path, error, statusCode);
        }
    }

    public static sendResetPass(): void {
        const path: string = 'POST /api/v1/auth/pub/send-reset-password'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/auth/pub/send-reset-password`;
            // const payload: IStrings = { email: UsersTest.config.email };

            // const response: AxiosResponse<any> = await axios.post(url, payload);
            // logger.success(path, response.status);

            // expect(response.status).toBe(201);
            // expect(response.data.receiver).toBe(UsersTest.config.email);

        } catch (error) {
            handleError(path, error);
        }
    }

    public static resetPass(statusCode?: StatusCodes): void {
        const path: string = 'POST /api/v1/auth/reset-password'.yellow;
        try {
            // const url: string = `http://localhost:${UsersTest.config.port}/api/v1/auth/reset-password`;
            // const newPass: string = '4Password#';
            // const response: AxiosResponse<any> = await axios.post(url, { password: newPass }, UsersTest.config.headers);
            // logger.success(path, response);

            // expect(response.status).toBe(200);
            // UsersTest.config.password = newPass;

        } catch (error) {
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
    
        } catch (error) {
            handleError(path, error);
        }
    }
    **************************************************************************************/
}