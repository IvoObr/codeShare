import axios, { AxiosResponse } from 'axios';
import logger from '../src/lib/logger';

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
});