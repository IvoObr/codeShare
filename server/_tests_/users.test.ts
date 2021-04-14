import dotenv from 'dotenv';
import logger from '../src/lib/logger';
import Helpers from '../src/lib/Helpers';
import { handleError } from './testUtils';
import axios, { AxiosResponse } from 'axios';
import { UserRole } from '../src/lib/enums';
import { IUser, IUserReq, IUserLogin } from '../src/lib/interfaces';

describe('users api tests', (): void => {
    
    dotenv.config();
    const port: number = Number(process.env.PORT);

    console.log(process.env.NODE_ENV);
    let userId: string = '-1';
    let userEmail: string = '';

    const headers: any = {
        headers: {
            Authorization: 'Bearer TOKEN!@#'
        }
    };

    it.skip('GET /api/user/all returns all users', async (): Promise<void> => {
        try {
            const url: string = `http://localhost:${port}/user/all`;
            
            const response: AxiosResponse<IUser[]> = await axios.get(url, headers);
            logger.success('GET /user/all response:', response.data.length);
           
            expect(typeof response.data.length).toBe('number');  
            
        } catch (error: any) {
            handleError(error);
        }
    });

    it('POST /user/register user in DB', async (): Promise<void> => {
        try {        
            const name: string = 'ivoObr';
            const password: string = 'Password123@';
            const email: string = `${Helpers.genBase36Key(8)}@yopmail.com`;
            const role: UserRole = UserRole.Admin;
            const data: IUserReq = { name, email, role, password };
            const url: string = `http://localhost:${port}/user/register`;

            const response: AxiosResponse<IUser> = await axios.post(url, data);   
            logger.success('POST /user/add response:', response.data);
           
            if (response.data?.id) {
                userId = response.data.id;
            }
  
            userEmail = response.data.email;

            expect(response.data.name).toBe(name);
            expect(response.data.role).toBe(role);
            expect(response.data.email).toBe(email);
            expect(typeof response.data.password).toBe('string');

        } catch (error: any) {
            handleError(error);
        }
    });

    it('POST /auth/login user in DB', async (): Promise<void> => {
        try {
            const password: string = 'Password123@';
            const data: IUserLogin = { email: userEmail, password };
            const url: string = `http://localhost:${port}/auth/login`;

            const response: AxiosResponse<IUser> = await axios.post(url, data);
            logger.success('POST /auth/login response:', response.data);

            expect(response.data.email).toBe(userEmail);
            expect(typeof response.data.name).toBe('string');
            expect(typeof response.data.role).toBe('string');
            expect(typeof response.data.password).toBe('string');

        } catch (error: any) {
            handleError(error);
        }
    });

    it.skip('DELETE /user/delete/:id user in DB', async (): Promise<void> => {
        try {
            const url: string = `http://localhost:${port}/user/delete/?id=${userId}`;
            
            const response: AxiosResponse<IUser> = await axios.delete(url, headers);
            logger.success('DELETE /user/delete/:id response.status:', response.status);
            
            expect(response.status).toBe(200);

        } catch (error: any) {
            handleError(error);
        }
    });
});