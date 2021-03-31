import axios, { AxiosResponse } from 'axios';
import logger from '../src/lib/logger';
import { IUser, IUserReq } from '../src/lib/interfaces';
import { UserRolesType } from '../src/lib/enums';

describe('users api tests', (): void => {
    const port: number = 3000;

    it('GET /api/user/all returns all users', async (): Promise<void> => {
        try { 
            const response: AxiosResponse<IUser[]> = await axios.get(`http://localhost:${port}/user/all`);
            logger.success('GET /user/all response:', response.data);
      
            expect(typeof response.data.length).toBe('number');
            
        } catch (error) {
            error && logger.error(error); 
            expect(typeof error).not.toBeDefined();
        }
    });

    it('POST /user/register user in DB', async (): Promise<void> => {
        try {        
            const name: string = 'ivoObr';
            const password: string = 'Password123';
            const email: string = 'ivo13@yopmail.com';
            const role: UserRolesType = UserRolesType.Admin;

            const data: IUserReq = { name, email, role, password };

            const response: AxiosResponse<IUser> = await axios.post(`http://localhost:${port}/user/register`, data);
            logger.success('POST /api/user/add response:', response.data);

            expect(response.data.name).toBe(name);
            expect(response.data.role).toBe(role);
            expect(response.data.email).toBe(email);
            expect(typeof response.data.password).toBe('string');

        } catch (error) {

            logger.error(error?.response?.data?.error || error);
            expect(typeof error).not.toBeDefined();
        }
    });
});