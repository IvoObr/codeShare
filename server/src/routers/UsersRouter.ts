import { Router } from 'express';
import { async } from '@lib';
import { AuthorizationService, UserService } from '@services';

class UserRouter {

    private router: Router = Router()

    public getRouter(): Router {
        /* route */
        this.router.use('/user', this.router);

        /* sub routes */
         this.router.get('/all',
            async(AuthorizationService.authorizeJWT),
            AuthorizationService.authorizeAdmin,
            async(UserService.getAll));
        
        this.router.put('/update/:id',
            async(AuthorizationService.authorizeJWT),
            async(UserService.update));
        
        this.router.delete('/delete/:id',
            async(AuthorizationService.authorizeJWT),
            AuthorizationService.authorizeAdmin,
            async(UserService.delete));
       
        return this.router;
    }
}

export default new UserRouter().getRouter();
