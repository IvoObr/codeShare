import { async } from '@lib';
import { Router } from 'express';
import { getAllUsers, deleteUser, updateUser, authorizeAdmin } from '@services';

class UserRouter {

    private router: Router = Router();

    public getRouter = (): Router => Router()
        /* main route */
        .use('/user', this.router)
        /* sub routes */
        .put('/update/:id', async(updateUser))
        .delete('/delete/:id', authorizeAdmin, async(deleteUser))
        .get('/all', authorizeAdmin, async(getAllUsers));
}

export default new UserRouter().getRouter();
