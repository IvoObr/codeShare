import dotenv from 'dotenv';
import colors from 'colors';
import logger from '../src/utils/logger';
import { handleError } from './testUtils';
import axios, { AxiosResponse } from 'axios';
import { UserRole } from '../src/utils/enums';
import genBase36Key from '../src/lib/genBase36Key';
import { IUser, IUserReq, IStrings } from '../src/utils/interfaces';
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

    it('POST /api/v1/auth/register user in DB', async (): Promise<void> => {
        const path: string = 'POST /auth/register'.yellow;
        try {        
            const url: string = `http://localhost:${port}/api/v1/auth/register`;
            const name: string = 'ivoObr';
            const password: string = 'Password123@';
            const email: string = `${genBase36Key(8)}@yopmail.com`;
            const role: UserRole = UserRole.Admin;
            const payload: IUserReq = { name, email, role, password };

            const { data }: AxiosResponse<IUser> = await axios.post(url, payload);   
            logger.success(path, data);
           
            if (data?._id) {
                userId = data._id;
            }
  
            userEmail = data.email;

            expect(data.name).toBe(name);
            expect(data.role).toBe(role);
            expect(data.email).toBe(email);
            expect(typeof data.password).toBe('string');

        } catch (error) {
            handleError(path, error);
        }
    });

    it('POST /api/v1/auth/login user in DB', async (): Promise<void> => {
        const path: string = 'POST /api/v1/auth/login'.yellow;
        try {
            const url: string = `http://localhost:${port}/api/v1/auth/login`;
            const password: string = 'Password123@';
            const payload: IStrings = { email: userEmail, password };

            const { data }: AxiosResponse<IUser> = await axios.post(url, payload);
            logger.success(path, data);

            if (data?.tokens.length) {
                headers.headers.Authorization = `Bearer ${data?.tokens[0]}`;
            }

            expect(data.email).toBe(userEmail);
            expect(typeof data.name).toBe('string');
            expect(typeof data.role).toBe('string');
            expect(typeof data.password).toBe('string');

        } catch (error) {
            handleError(path, error);
        }
    });

    it('GET /api/v1/api/user/all returns all users', async (): Promise<void> => {
        const path: string = 'GET /api/v1/api/user/all'.yellow;
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
                email: `${genBase36Key(8)}@gormail.com`,
                name: 'IvoG',
                password: 'Password123@'
            };
            const url: string = `http://localhost:${port}/api/v1/user/update/${userId}`;
            const response: AxiosResponse<IUser> = await axios.put(url, userData, headers);
            logger.success(path, response.status);

            logger.debug(response.data);

            expect(response.status).toBe(200);
            expect(typeof response.data.role).toBe('string');
            expect(typeof response.data.password).toBe('string');
            userData?.email && expect(response.data.email).toBe(userData.email);
            userData?.name && expect(response.data.name).toBe(userData.name);

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

    it.skip('DELETE /api/v1/user/delete/:id user in DB', async (): Promise<void> => {
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

    it('POST /api/v1/user/delete/:id user in DB', async (): Promise<void> => {
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

    // todo 
    // sendResetPassword
    // resetPassword
    
});

/*
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
*/