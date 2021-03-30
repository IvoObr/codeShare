import axios, { AxiosResponse } from 'axios';
import logger from '../src/lib/logger';
import { IUserReq } from '../src/lib/interfaces';
import { UserRolesType } from '../src/lib/enums';

describe('users api tests', (): void => {

    it('GET /api/user/all returns all users', async (): Promise<void> => {
        try { 
            const port: number = 3000;
            const response: AxiosResponse<any> = await axios.get(`http://localhost:${port}/api/user/all`);
            logger.success('GET /api/user/all response:', response.data);
      
            expect(typeof response.data.length).toBe('number');
            
        } catch (error) {
            error && logger.error(error); 
            expect(typeof error).not.toBeDefined();
        }
    });

    it('POST /api/user/add insert user in DB', async (): Promise<void> => {
        try {
            const port: number = 3000;
            const data: IUserReq = {
                name: 'ivoObr',
                email: 'ivo@yopmail.com', 
                role: UserRolesType.Admin,
                password: 'Password123'
            };

            const response: AxiosResponse<any> = await axios.post(`http://localhost:${port}/api/user/add`, data);
            logger.success('POST /api/user/add response:', response.data);

            expect(typeof response.data.length).toBe('number');

        } catch (error) {
            logger.error(error?.response?.data?.error);
            expect(typeof error?.response?.data?.error).not.toBeDefined();
        }
    });
});