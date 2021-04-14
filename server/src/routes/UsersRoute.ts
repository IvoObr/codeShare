import { Router } from 'express';
import { AsyncWrapper } from '@lib';
import { UserService } from '@services';
import { AuthMiddleware } from '@middlewares';

class UserRouter {

    private router: Router = Router()
    private asyncWrap = AsyncWrapper.wrap;
    private authenticate = AuthMiddleware.authenticate;

    public getRouter(): Router {
        /* sub route */
        this.router.use('/user', this.router);
        /* specific routes */
        this.router.post('/register', this.asyncWrap(UserService.register));
        this.router.get('/all', this.authenticate, this.asyncWrap(UserService.getAll));
        this.router.put('/update', this.authenticate, this.asyncWrap(UserService.update));
        this.router.delete('/delete', this.authenticate, this.asyncWrap(UserService.delete));
       
        return this.router;
    }
}

export default new UserRouter().getRouter();
