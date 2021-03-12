import { Mongo } from '@db';
import { UserRequest, IRequest } from '@interfaces';
import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';
import * as Consts from '@constants';
import User from "@entities/User";
import { logger } from '@logger';

const router = Router();
//  instance of user dal

const { BAD_REQUEST, CREATED, OK } = StatusCodes;


/* GET /api/user/all */
router.get('/all', async (req: Request, res: Response) => {
    const users = await Mongo.db.collection(Consts.USER).find().toArray();

    return res.status(OK).send(users);
});

/* POST /api/user/add */
router.post('/add', async (req: IRequest, res: Response) => {
    try {
        const { user } = req.body;
        if (!user) {
            return res.status(BAD_REQUEST).json({
                error: Consts.ERR_MISSING_PARAMETER,
            });
        }

        // TODO add user

        const newUser: User = await new User(
            user?.email,
            user?.role,
            user?.password,
            user?.id,
            user?.name
        ).validate();

    
            // = await Mongo.db.collection(Consts.USER).insertOne(newUser);


        return res.status(CREATED).end();
    } catch (error) {
        logger.error(error);
        return res.status(BAD_REQUEST).end();
    }
});

/* PUT /api/user/update */
router.put('/update', async (req: IRequest, res: Response) => {
    const { user } = req.body;
    if (!user) {
        return res.status(BAD_REQUEST).json({
            error: Consts.ERR_MISSING_PARAMETER,
        });
    }
    user.id = Number(user.id);
    // TODO user user
    return res.status(OK).end();
});

/* DELETE /api/user/delete/:id */
router.delete('/delete/:id', async (req: IRequest, res: Response) => {
    const { id } = req.params;
    // TODO delete user by id
    return res.status(OK).end();
});

export default router;
