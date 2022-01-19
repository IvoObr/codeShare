import { async } from '@lib';
import { Router } from 'express';
import { login, logout, register, confirmRegistration,
    resetPassword, sendResetPassword } from '@services';

class AuthRouter {

    private router: Router = Router();
    
    public getRouter = (): Router => Router()
        /* main route */
        .use('/auth', this.router)
        /* public sub routes */
        .post('/pub/login', async(login))
        .post('/pub/register', async(register))
        .post('/pub/send-reset-password', async(sendResetPassword))
        /* authenticated sub routes */
        .get('/logout', async(logout))
        .post('/reset-password', async(resetPassword))
        .get('/confirm-registration', async(confirmRegistration));
}

export default new AuthRouter().getRouter();
