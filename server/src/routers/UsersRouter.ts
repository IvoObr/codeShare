import { async } from '@lib';
import { Router } from 'express';
import { getAllUsers, authorizeJWT, deleteUser,
    updateUser, authorizeAdmin } from '@services';

class UserRouter {

    private router: Router = Router()

    public getRouter(): Router {
        /* route */
        this.router.use('/user', this.router);

        /* sub routes */
        this.router.get('/all',
            async(authorizeJWT),
            authorizeAdmin,
            async(getAllUsers));
        
        this.router.put('/update/:id',
            async(authorizeJWT),
            async(updateUser));
        
        this.router.delete('/delete/:id',
            async(authorizeJWT),
            authorizeAdmin,
            async(deleteUser));
       
        return this.router;
    }
}

export default new UserRouter().getRouter();
