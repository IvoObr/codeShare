import { Router } from 'express';
import ApiRouter from './ApiRouter';
import { AuthService } from '@services';

class AuthRouter extends ApiRouter {

    protected router: Router;

    constructor() {
        super();
        this.router = Router();
        this.initRoutes();
    }

    public getRouter(): Router {
        this.router.use('/auth', this.router);
        return this.router;
    }

    protected initRoutes(): void {
        this.router.post('/login', this.asyncWrap(AuthService.login));
        this.router.get('/logout', this.asyncWrap(AuthService.logout));
    }
}

export default new AuthRouter().getRouter();
