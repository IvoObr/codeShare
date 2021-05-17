import { async } from '@lib';
import { Router } from 'express';
import {
    login, logout, register,
    authorizeJWT, resetPassword, sendResetPassword
} from '@services';

class AuthRouter {

    private router: Router = Router()
    
    public getRouter(): Router {
        /* main route */
        this.router.use('/auth', this.router);

        /* sub routes */
        this.router.post('/register',
            async(register));

        this.router.post('/login',
            async(login));
        
        this.router.post('/send-reset-password',
            async(sendResetPassword));
        
        this.router.post('/reset-password',
            async(authorizeJWT),
            async(resetPassword));

        this.router.get('/logout',
            async(authorizeJWT),
            async(logout));
       
        return this.router;
    }
}

export default new AuthRouter().getRouter();
