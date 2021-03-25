import * as Consts from '@constants';
import { StatusCodes } from '@enums';
import { Request, Response, Router } from 'express';
import { UserRequest, IRequest } from '@interfaces';

const router = Router();
// todo instance of user dal

/* GET /api/snippet/all */

router.get('/all', async (req: Request, res: Response) => {
   
    //@ts-ignore: todo put interface
    const snippets: any = null; // todo get all snippet

    return res.status(StatusCodes.OK).json({ snippets });
});

/* POST /api/snippet/add */

router.post('/add', async (req: IRequest, res: Response) => {
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

router.put('/update', async (req: IRequest, res: Response) => {
    const { user } = req.body;
    if (!user) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            error: Consts.ERR_MISSING_PARAMETER
        });
    }
    user.id = Number(user.id);
    // todo snippet user
    return res.status(StatusCodes.OK).end();
});

/* DELETE /api/snippet/delete/:id */

router.delete('/delete/:id', async (req: IRequest, res: Response) => {
    const { id } = req.params;
    // todo delete snippet by id
    return res.status(StatusCodes.OK).end();
});

export default router;
