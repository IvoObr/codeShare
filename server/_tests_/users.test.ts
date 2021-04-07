import axios, { AxiosResponse } from 'axios';
import logger from '../src/lib/logger';
import dotenv from 'dotenv';
import { IUser, IUserReq } from '../src/lib/interfaces';
import { UserRolesType } from '../src/lib/enums';
import { handleError } from './testUtils';
import { genBase36Key } from '../src/lib/helpers';

describe('users api tests', (): void => {
    
    dotenv.config();
    const port: number = Number(process.env.PORT);

    console.log(process.env.NODE_ENV);
    let userId: string = '-1';

    it('GET /api/user/all returns all users', async (): Promise<void> => {
        try {             
            const response: AxiosResponse<IUser[]> = await axios.get(`http://localhost:${port}/user/all`);
            logger.success('GET /user/all response:', response.data.length);
      
            expect(typeof response.data.length).toBe('number');
            
        } catch (error: any) {
            handleError(error);
        }
    });

    it('POST /user/register user in DB', async (): Promise<void> => {
        try {        
            const name: string = 'ivoObr';
            const password: string = 'Password123';
            const email: string = `${genBase36Key(8)}@yopmail.com`;
            const role: UserRolesType = UserRolesType.Admin;

            const data: IUserReq = { name, email, role, password };
            const response: AxiosResponse<IUser> = await axios.post(`http://localhost:${port}/user/register`, data);
            
            logger.success('POST /user/add response:', response.data);
           
            if (response.data?._id) {
                userId = response.data._id;
            }
  
            expect(response.data.name).toBe(name);
            expect(response.data.role).toBe(role);
            expect(response.data.email).toBe(email);
            expect(typeof response.data.password).toBe('string');

        } catch (error: any) {
            handleError(error);
        }
    });

    it('DELETE /user/delete/:id user in DB', async (): Promise<void> => {
        try {
            const response: AxiosResponse<IUser> = await axios.delete(`http://localhost:${port}/user/delete/?id=${userId}`);
            
            logger.success('DELETE /user/delete/:id response.status:', response.status);
            expect(response.status).toBe(200);

        } catch (error: any) {
            handleError(error);
        }
    });
});