import ApiRouter from './ApiRouter';
import { UserService } from '@services';
import { Router } from 'express';

class UserRouter extends ApiRouter {

    protected router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initRoutes();
    }

    public getRouter(): Router {
        this.router.use('/user', this.router);
        return this.router;
    }

    protected initRoutes(): void {
        this.router.get('/all', this.asyncWrap(UserService.getAll));
        this.router.post('/register', this.asyncWrap(UserService.register));
        this.router.delete('/delete', this.asyncWrap(UserService.delete));
        this.router.put('/update', this.asyncWrap(UserService.update));
    }
}

export default new UserRouter().getRouter();
