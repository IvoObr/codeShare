import axios, { AxiosResponse } from 'axios';

describe('users api tests', (): void => {

    it('GET /api/user/all returns all users', async (): Promise<void> => {
        try { 
            const response: AxiosResponse<any> = await axios.get('http://localhost:3000/api/user/all');
            console.log('\x1b[32m', response.data, '\x1b[0m');
      
            expect(typeof response.data.length).toBe('number');
        } catch (error) {
            error && console.log(error); 
        }
    });
});