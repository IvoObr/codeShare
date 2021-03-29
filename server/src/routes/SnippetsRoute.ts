import * as Const from '@constants';
import { StatusCodes } from '@enums';
import ApiRouter from './ApiRouter';
import { Request, Response, Router, NextFunction } from 'express';
import { UserRequest, IRequest } from '@interfaces';
import logger from '@logger';

class SnippetRouter extends ApiRouter {

    protected router: Router;

    constructor() {
        super();
        this.router = Router();
        this.useMiddleware();
        this.initRoutes();
    }

    public getRouter(): Router {
        this.router.use('/snippet', this.router);
        return this.router;
    }

    protected useMiddleware(): void {
        this.router.use((req: IRequest, res: Response, next: NextFunction): void => {
            // todo something
            logger.info('Snippet middleware');
            next();
        });
    }

    protected initRoutes(): void {

        /* GET /api/snippet/all */
        this.router.get('/all', async (req: Request, res: Response) => {
   
            //@ts-ignore: todo put interface
            const snippets: any = null; // todo get all snippet

            return res.status(StatusCodes.OK).json({ snippets });
        });

        /* POST /api/snippet/add */

        this.router.post('/add', async (req: IRequest, res: Response) => {
            // const { snippet } = req.body;
            // if (!snippet) {
            //     return res.status(BAD_REQUEST).json({
            //         error: paramMissingError,
            //     });
            // }

            // todo add snippet
            return res.status(StatusCodes.CREATED).end();
        });

        /* PUT /api/snippet/update */

        this.router.put('/update', async (req: IRequest, res: Response) => {
            const { user } = req.body;
            if (!user) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    error: Const.ERR_MISSING_PARAMETER
                });
            }
            user.id = Number(user.id);
            // todo snippet user
            return res.status(StatusCodes.OK).end();
        });

        /* DELETE /api/snippet/delete/:id */

        this.router.delete('/delete/:id', async (req: IRequest, res: Response) => {
            const { id } = req.params;
            // todo delete snippet by id
            return res.status(StatusCodes.OK).end();
        });
    }
}

export default new SnippetRouter().getRouter();
