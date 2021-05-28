import { async } from '@lib';
import { Router } from 'express';
import { getAllUsers, deleteUser, updateUser, authorizeAdmin } from '@services';

class UserRouter {

    private router: Router = Router()

    public getRouter(): Router {
        /* main route */
        this.router.use('/user', this.router);

        /* sub routes */
        this.router.get('/all',
            authorizeAdmin,
            async(getAllUsers));
        
        this.router.put('/update/:id',
            async(updateUser));
        
        this.router.delete('/delete/:id',
            authorizeAdmin,
            async(deleteUser));
       
        return this.router;
    }
}

export default new UserRouter().getRouter();
