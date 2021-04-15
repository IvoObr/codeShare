import dotenv from 'dotenv';
import colors from 'colors';
import logger from '../src/utils/logger';
import { handleError } from './testUtils';
import axios, { AxiosResponse } from 'axios';
import { UserRole } from '../src/utils/enums';
import genBase36Key from '../src/lib/genBase36Key';
import { IUser, IUserReq, IStrings, IUserLogin } from '../src/utils/interfaces';
colors.enable();

describe('users api tests', (): void => {
    
    dotenv.config();
    const port: number = Number(process.env.PORT);

    console.log(process.env.NODE_ENV);
    let userId: string = '-1';
    let userEmail: string = '';

    const headers: { [key: string]: IStrings} = {
        headers: { Authorization: 'Bearer ' }
    };

    it('POST /user/register user in DB', async (): Promise<void> => {
        const path: string = 'POST /user/register'.yellow;
        try {        
            const url: string = `http://localhost:${port}/user/register`;
            const name: string = 'ivoObr';
            const password: string = 'Password123@';
            const email: string = `${genBase36Key(8)}@yopmail.com`;
            const role: UserRole = UserRole.Admin;
            const data: IUserReq = { name, email, role, password };

            const response: AxiosResponse<IUser> = await axios.post(url, data);   
            logger.success(path, response.data);
           
            if (response.data?.id) {
                userId = response.data.id;
            }
  
            userEmail = response.data.email;

            expect(response.data.name).toBe(name);
            expect(response.data.role).toBe(role);
            expect(response.data.email).toBe(email);
            expect(typeof response.data.password).toBe('string');

        } catch (error) {
            handleError(path, error);
        }
    });

    it('POST /auth/login user in DB', async (): Promise<void> => {
        const path: string = 'POST /auth/login'.yellow;
        try {
            const url: string = `http://localhost:${port}/auth/login`;
            const password: string = 'Password123@';
            const data: IUserLogin = { email: userEmail, password };

            const response: AxiosResponse<IUser> = await axios.post(url, data);
            logger.success(path, response.data);

            if (response.data?.tokens.length) {
                headers.headers.Authorization = `Bearer ${response.data?.tokens[0]}`;
            }

            expect(response.data.email).toBe(userEmail);
            expect(typeof response.data.name).toBe('string');
            expect(typeof response.data.role).toBe('string');
            expect(typeof response.data.password).toBe('string');

        } catch (error) {
            handleError(path, error);
        }
    });

    it('GET /api/user/all returns all users', async (): Promise<void> => {
        const path: string = 'GET /api/user/all'.yellow;
        try {
            const url: string = `http://localhost:${port}/user/all`;
            const response: AxiosResponse<IUser[]> = await axios.get(url, headers);
            logger.success(path, response.data.length);

            expect(typeof response.data.length).toBe('number');

        } catch (error) {
            handleError(path, error);
        }
    });

    it('GET /auth/logout user in DB', async (): Promise<void> => {
        const path: string = 'GET /auth/logout'.yellow;
        try {
            const url: string = `http://localhost:${port}/auth/logout`;
            const response: AxiosResponse<IUser> = await axios.get(url, headers);
            logger.success(path, response.status);

            expect(response.status).toBe(200);

        } catch (error) {
            handleError(path, error);
        }
    });

    it.skip('DELETE /user/delete/:id user in DB', async (): Promise<void> => {
        const path: string = 'DELETE /user/delete/:id'.yellow;
        try {  
            const url: string = `http://localhost:${port}/user/delete/?id=${userId}`;
            const response: AxiosResponse<IUser> = await axios.delete(url, headers);
            logger.success(path, response.status);
            
            expect(response.status).toBe(200);

        } catch (error) {
            handleError(path, error);
        }
    });
});