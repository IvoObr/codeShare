import { async } from '@lib';
import { Router } from 'express';
import { AuthenticationService, AuthorizationService } from '@services';

class AuthRouter {

    private router: Router = Router()
    
    public getRouter(): Router {
        /* route */
        this.router.use('/auth', this.router);

        /* sub routes */
        this.router.post('/register',
            async(AuthenticationService.register));

        this.router.post('/login',
            async(AuthenticationService.login));

        this.router.get('/logout',
            async(AuthorizationService.authorizeJWT),
            async(AuthenticationService.logout));
       
        return this.router;
    }
}

export default new AuthRouter().getRouter();
