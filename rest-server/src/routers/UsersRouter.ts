import { async } from '@lib';
import { Router } from 'express';
import { getAllUsers, deleteUser, updateUser,
    authorizeAdmin, validateAccountStatus } from '@services';

class UserRouter {

    private router: Router = Router();

    public getRouter = (): Router => Router()
        /* main route */
        .use('/user', validateAccountStatus, this.router)
        
        /* sub routes */
        .put('/update/:id', validateAccountStatus, async(updateUser))
        .get('/all', validateAccountStatus, authorizeAdmin, async(getAllUsers))
        .delete('/delete/:id', validateAccountStatus, authorizeAdmin, async(deleteUser));
}

export default new UserRouter().getRouter();
