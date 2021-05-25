import dotenv from 'dotenv';
import colors from 'colors';
import { IHeaders } from './interfaces';
import logger from '../src/utils/logger';
import { handleError } from './testUtils';
import axios, { AxiosResponse } from 'axios';
import { UserRole } from '../src/utils/enums';
import genBase36Key from '../src/lib/genBase36Key';
import { IUser, INewUserReq, IStrings } from '../src/utils/interfaces';
colors.enable();

describe('users api tests', (): void => {
    
    dotenv.config();
    const port: number = Number(process.env.PORT);

    let userId: string = '-1';
    let userEmail: string = '';
    let password: string = 'Password123@';

    const headers: IHeaders = {
        headers: { Authorization: 'Bearer ' }
    };

    it('POST /api/v1/auth/pub/register user in DB', async (): Promise<void> => {
        const path: string = 'POST /auth/pub/register'.yellow;
        try {        
            const url: string = `http://localhost:${port}/api/v1/auth/pub/register`;
            const name: string = 'ivoObr';
            const password: string = 'Password123@';
            const email: string = `${genBase36Key(8)}@yopmail.com`;
            const role: UserRole = UserRole.Admin;
            const payload: INewUserReq = { name, email, role, password };

            const { data }: AxiosResponse<IUser> = await axios.post(url, payload);   
            logger.success(path, data);
           
            if (data?._id) {
                userId = data._id;
            }
  
            userEmail = data.email;

            expect(data.name).toBe(name);
            expect(data.role).toBe(role);
            expect(data.email).toBe(email);

        } catch (error) {
            handleError(path, error);
        }
    });

    it('POST /api/v1/auth/pub/login user in DB', async (): Promise<void> => {
        await login(userEmail, headers, port, password);
    });

    it('POST /api/v1/auth/reset-password', async (): Promise<void> => {
        const path: string = 'POST /api/v1/auth/reset-password'.yellow;
        try {
            const url: string = `http://localhost:${port}/api/v1/auth/reset-password`;
            const newPassword: string = '4Password#';
            const payload = { password: newPassword };
            const response: AxiosResponse<any> = await axios.post(url, payload, headers);

            logger.success(path, response);
            expect(response.status).toBe(200);
            password = newPassword;

        } catch (error) {
            handleError(path, error);
        }
    });

    it('GET /api/v1/auth/logout user in DB', async (): Promise<void> => {
        const path: string = 'GET /api/v1/auth/logout'.yellow;
        try {
            const url: string = `http://localhost:${port}/api/v1/auth/logout`;
            const response: AxiosResponse<IUser> = await axios.get(url, headers);
            logger.success(path, response.status);

            expect(response.status).toBe(200);

        } catch (error) {
            handleError(path, error);
        }
    });

    it('POST /api/v1/auth/pub/login user in DB', async (): Promise<void> => {
        await login(userEmail, headers, port, password);
    });

    it('GET /api/v1/api/user/all returns all users', async (): Promise<void> => {
        const path: string = 'GET /api/v1/user/all'.yellow;
        try {
            const url: string = `http://localhost:${port}/api/v1/user/all`;
            const { data }: AxiosResponse<IUser[]> = await axios.get(url, headers);
            logger.success(path, data.length);

            expect(typeof data.length).toBe('number');
            
            // await deleteAllUsers(data, headers);

        } catch (error) {
            handleError(path, error);
        }
    });
    
    it('PUT /api/v1/user/update/:id user in DB', async (): Promise<void> => {
        const path: string = 'PUT /api/v1/user/update/:id'.yellow;
        try {
            const userData: IStrings = {
                email: `${genBase36Key(8)}@yopmail.com`,
                name: 'IvoG',
                password: 'Password123@'
            };
            const url: string = `http://localhost:${port}/api/v1/user/update/${userId}`;
            const response: AxiosResponse<IUser> = await axios.put(url, userData, headers);
            logger.success(path, response.status);

            userEmail = userData.email;

            expect(response.status).toBe(200);
            expect(typeof response.data.role).toBe('string');
            userData?.email && expect(response.data.email).toBe(userData.email);
            userData?.name && expect(response.data.name).toBe(userData.name);

        } catch (error) {
            handleError(path, error);
        }
    });

    it('POST /api/v1/auth/pub/send-reset-password', async (): Promise<void> => {
        const path: string = 'POST /api/v1/auth/pub/send-reset-password'.yellow;
        try {
            const url: string = `http://localhost:${port}/api/v1/auth/pub/send-reset-password`;
            const payload: IStrings = { email: userEmail };

            const response: AxiosResponse<any> = await axios.post(url, payload);
            logger.success(path, response.status);

            expect(response.status).toBe(201);
            expect(response.data.receiver).toBe(userEmail);

        } catch (error) {
            handleError(path, error);
        }
    });

    it('DELETE /api/v1/user/delete/:id user in DB', async (): Promise<void> => {
        const path: string = 'DELETE /api/v1/user/delete/:id'.yellow;
        try {  
            const url: string = `http://localhost:${port}/api/v1/user/delete/${userId}`;
            const response: AxiosResponse<IUser> = await axios.delete(url, headers);
            logger.success(path, response.status);
            
            expect(response.status).toBe(200);

        } catch (error) {
            handleError(path, error);
        }
    });
    
});

async function login(userEmail: string, headers: IHeaders, port: number, password: string): Promise<void> {
    const path: string = 'POST /api/v1/auth/pub/login'.yellow;
    try {
        const url: string = `http://localhost:${port}/api/v1/auth/pub/login`;
        const payload: IStrings = { email: userEmail, password };

        const response: AxiosResponse<IUser> = await axios.post(url, payload);
        logger.success(path, response);

        /* authorize next requests */
        headers.headers.Authorization = `Bearer ${response.headers?.authorization}`;
        
        expect(response.data.email).toBe(userEmail);
        expect(typeof response.data.name).toBe('string');
        expect(typeof response.data.role).toBe('string');

    } catch (error) {
        handleError(path, error);
    }
}

/************************************************************************************** 
async function deleteAllUsers(users: IUser[], headers: any): Promise<void> {
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