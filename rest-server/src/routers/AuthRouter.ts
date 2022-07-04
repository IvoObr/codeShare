import { async } from '@lib';
import { Router } from 'express';
import { login, logout, register, confirmRegistration, resetPassword, 
    sendResetPassword, validateAccountStatus, sendConfirmRegistration, validateLogin } from '@services';

class AuthRouter {

    private router: Router = Router();
    
    public getRouter = (): Router => Router()
        /* main route */
        .use('/auth', this.router)

        /* public sub routes */
        .post('/pub/register',
            async(register))

        .post('/pub/login',
            async(validateAccountStatus),
            async(login))
        
        .post('/pub/send-confirm-registration',
            async(sendConfirmRegistration))
        
        .post('/pub/send-reset-password',
            async(validateAccountStatus),
            async(sendResetPassword))
    
        /* authenticated sub routes */
        .get('/logout',
            async(validateAccountStatus),
            async(validateLogin),
            async(logout))
        
        .get('/confirm-registration',
            async(confirmRegistration))
        
        .post('/reset-password',
            async(validateAccountStatus),
            async(validateLogin),
            async(resetPassword));
}

export default new AuthRouter().getRouter();
