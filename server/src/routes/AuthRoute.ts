import { Router } from 'express';
import { async } from '@lib';
import { AuthService } from '@services';
import { authenticate } from '@middlewares';

class AuthRouter {

    private router: Router = Router()
    
    public getRouter(): Router {
        /* sub route */
        this.router.use('/auth', this.router);
        /* specific routes */
        this.router.post('/login', async(AuthService.login));
        this.router.get('/logout', async(authenticate), async(AuthService.logout));
       
        return this.router;
    }
}

export default new AuthRouter().getRouter();
