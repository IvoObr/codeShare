import { async } from '@lib';
import { Router } from 'express';
import { login, logout, register, resetPassword, sendResetPassword } from '@services';

class AuthRouter {

    private router: Router = Router()
    
    public getRouter(): Router {
        /* main route */
        this.router.use('/auth', this.router);

        /* sub routes */
        this.router.post('/pub/register',
            async(register));

        this.router.post('/pub/login',
            async(login));
        
        this.router.post('/pub/send-reset-password',
            async(sendResetPassword));
        
        this.router.post('/reset-password',
            async(resetPassword));

        this.router.get('/logout',
            async(logout));
       
        return this.router;
    }
}

export default new AuthRouter().getRouter();
