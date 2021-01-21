import axios from 'axios';

describe('users api tests', () => {

    it('GET /api/user/all returns all users', async () => {
        try { 
            const response = await axios.get('http://localhost:3000/api/user/all');
            console.log('\x1b[32m', response.data, '\x1b[0m');
      
            expect(typeof response.data.length).toBe('number');
        } catch (error) {
            error && console.log(error); 
        }
    })
})