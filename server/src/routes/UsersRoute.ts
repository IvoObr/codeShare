import { Router } from 'express';
import { AsyncWrapper } from '@lib';
import { UserService } from '@services';
import { AuthMiddleware } from '@middlewares';

class UserRouter {

    private router: Router = Router()
    private async = AsyncWrapper;
    private authenticate = AuthMiddleware.authenticate;

    public getRouter(): Router {
        /* sub route */
        this.router.use('/user', this.router);
        /* specific routes */
        this.router.post('/register', this.async(UserService.register));
        this.router.get('/all', this.authenticate, this.async(UserService.getAll));
        this.router.put('/update', this.authenticate, this.async(UserService.update));
        this.router.delete('/delete', this.authenticate, this.async(UserService.delete));
       
        return this.router;
    }
}

export default new UserRouter().getRouter();
