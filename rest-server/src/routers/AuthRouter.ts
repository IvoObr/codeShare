import { async } from '@lib';
import { Router } from 'express';
import { login, logout, register, confirmRegistration,
    resetPassword, sendResetPassword, validateAccountStatus, sendConfirmRegistration } from '@services';

class AuthRouter {

    private router: Router = Router();
    
    public getRouter = (): Router => Router()
        /* main route */
        .use('/auth', this.router)

        /* public sub routes */
        .post('/pub/register', async(register))
        .post('/pub/login', validateAccountStatus, async(login))
        .post('/pub/send-reset-password', async(sendResetPassword))
        .post('/pub/send-confirm-registration', async(sendConfirmRegistration))
    
        /* authenticated sub routes */
        .post('/reset-password', async(resetPassword))
        .get('/logout', validateAccountStatus, async(logout))
        .get('/confirm-registration', async(confirmRegistration));
}

export default new AuthRouter().getRouter();
