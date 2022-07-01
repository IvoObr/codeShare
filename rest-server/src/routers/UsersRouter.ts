import { async } from '@lib';
import { Router } from 'express';
import { getAllUsers, deleteUser, updateUser,
    authorizeAdmin, validateAccountStatus, validateLogin } from '@services';

class UserRouter {

    private router: Router = Router();

    public getRouter = (): Router => Router()
        /* main route */
        .use('/user',
            async(validateLogin),
            async(validateAccountStatus),
            this.router)
        
        /* sub routes */
        .put('/update/:id',
            async(validateLogin),
            async(validateAccountStatus),
            async(updateUser))
        
        .get('/all',
            async(validateLogin),
            async(validateAccountStatus),
            authorizeAdmin,
            async(getAllUsers))
        
        .delete('/delete/:id',
            async(validateLogin),
            async(validateAccountStatus),
            authorizeAdmin,
            async(deleteUser));
}

export default new UserRouter().getRouter();
