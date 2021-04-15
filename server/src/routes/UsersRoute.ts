import { Router } from 'express';
import { async } from '@lib';
import { UserService } from '@services';
import { authenticate } from '@middlewares';

class UserRouter {

    private router: Router = Router()

    public getRouter(): Router {
        /* sub route */
        this.router.use('/user', this.router);
        /* specific routes */
        this.router.post('/register', async(UserService.register));
        this.router.get('/all', async(authenticate), async(UserService.getAll));
        this.router.put('/update', async(authenticate), async(UserService.update));
        this.router.delete('/delete', async(authenticate), async(UserService.delete));
       
        return this.router;
    }
}

export default new UserRouter().getRouter();
