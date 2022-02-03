import { async } from '@lib';
import { Router } from 'express';
import { getAllUsers, deleteUser, updateUser,
    authorizeAdmin, validateAccountStatus } from '@services';

class UserRouter {

    private router: Router = Router();

    public getRouter = (): Router => Router()
        /* main route */
        .use('/user', async(validateAccountStatus), this.router)
        
        /* sub routes */
        .put('/update/:id', async(validateAccountStatus), async(updateUser))
        .get('/all', async(validateAccountStatus), authorizeAdmin, async(getAllUsers))
        .delete('/delete/:id', async(validateAccountStatus), authorizeAdmin, async(deleteUser));
}

export default new UserRouter().getRouter();
