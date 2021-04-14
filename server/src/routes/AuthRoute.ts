import { Router } from 'express';
import { AsyncWrapper } from '@lib';
import { AuthService } from '@services';

class AuthRouter {

    private router: Router = Router()
    private asyncWrap = AsyncWrapper.wrap;
    
    public getRouter(): Router {
        /* sub route */
        this.router.use('/auth', this.router);
        /* specific routes */
        this.router.post('/login', this.asyncWrap(AuthService.login));
        this.router.get('/logout', this.asyncWrap(AuthService.logout));
       
        return this.router;
    }
}

export default new AuthRouter().getRouter();
