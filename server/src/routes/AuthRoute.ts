import { Router } from 'express';
import { AsyncWrapper } from '@lib';
import { AuthService } from '@services';
import { AuthMiddleware } from '@middlewares';

class AuthRouter {

    private router: Router = Router()
    private async = AsyncWrapper;
    private authenticate = AuthMiddleware.authenticate;
    
    public getRouter(): Router {
        /* sub route */
        this.router.use('/auth', this.router);
        /* specific routes */
        this.router.post('/login', this.async(AuthService.login));
        this.router.get('/logout', this.authenticate, this.async(AuthService.logout));
       
        return this.router;
    }
}

export default new AuthRouter().getRouter();
