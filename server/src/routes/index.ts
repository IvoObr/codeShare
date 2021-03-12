import { Router } from 'express';
import SnippetRouter from './Snippets';
import UserRouter from './UsersRoute';
import AuthRouter from './Auth';

const router = Router();

router.use('/snippet', SnippetRouter);
// router.use('/tag', TagRouter); todo
router.use('/user', UserRouter);
router.use('/auth', AuthRouter);

export default router;
