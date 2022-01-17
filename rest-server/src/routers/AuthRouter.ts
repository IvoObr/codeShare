import { async } from '@lib';
import { Router } from 'express';
import { login, logout, register, confirmRegistration,
    resetPassword, sendResetPassword } from '@services';

class AuthRouter {

    private router: Router = Router();
    
    public getRouter = (): Router => Router()
        /* main route */
        .use('/auth', this.router)
        /* sub routes */
        .get('/logout', async(logout))
        .post('/pub/login', async(login))
        .post('/pub/register', async(register))
        .post('/reset-password', async(resetPassword))
        .post('/pub/send-reset-password', async(sendResetPassword))
        .get('/pub/confirmRegistration', async(confirmRegistration));
}

export default new AuthRouter().getRouter();
