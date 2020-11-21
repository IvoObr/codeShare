import { Router } from 'express';
import SnippetRouter from './Snippets';
import AuthRouter from './Auth';

/* Init router and path */
const router = Router();

/* Add sub-routes */
router.use('/snippet', SnippetRouter);
// router.use('/tag', TagRouter); todo
router.use('/auth', AuthRouter);

/* Export the base-router */
export default router;
