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
        .post('/reset-password/:token', async(resetPassword)) // fixme: get or post
        .get('/confirm-registration/:token', async(confirmRegistration)) // fixme: get or post
        .post('/pub/send-reset-password', async(sendResetPassword));
}

export default new AuthRouter().getRouter();
