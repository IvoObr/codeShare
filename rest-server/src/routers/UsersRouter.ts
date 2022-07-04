import { async } from '@lib';
import { Router } from 'express';
import { getAllUsers, deleteUser, updateUser,
    authorizeAdmin, validateAccountStatus, validateLogin } from '@services';

class UserRouter {

    private router: Router = Router();

    public getRouter = (): Router => Router()
        /* main route */
        .use('/user',
            async(validateAccountStatus),
            async(validateLogin),
            this.router)
        
        /* sub routes */
        .put('/update/:id',
            async(validateAccountStatus),
            async(validateLogin),
            async(updateUser))
        
        .get('/all',
            async(validateAccountStatus),
            async(validateLogin),
            authorizeAdmin,
            async(getAllUsers))
        
        .delete('/delete/:id',
            async(validateAccountStatus),
            async(validateLogin),
            authorizeAdmin,
            async(deleteUser));
}

export default new UserRouter().getRouter();
