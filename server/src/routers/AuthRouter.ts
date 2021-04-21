import { async } from '@lib';
import { Router } from 'express';
import { login, logout, register, authorizeJWT } from '@services';

class AuthRouter {

    private router: Router = Router()
    
    public getRouter(): Router {
        /* route */
        this.router.use('/auth', this.router);

        /* sub routes */
        this.router.post('/register',
            async(register));

        this.router.post('/login',
            async(login));

        this.router.get('/logout',
            async(authorizeJWT),
            async(logout));
       
        return this.router;
    }
}

export default new AuthRouter().getRouter();
