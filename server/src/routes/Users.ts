import StatusCodes from 'http-status-codes';
import { Request, Response, Router } from 'express';

import { paramMissingError, IRequest } from '@constants';
import { UserRequest } from '@interfaces';
import { db } from '../index';


const router = Router();
// todo instance of user dal

const { BAD_REQUEST, CREATED, OK } = StatusCodes;


/* GET /api/user/all */

router.get('/all', async (req: Request, res: Response) => {
  const users = await db.collection('users').find().toArray();

  return res.status(OK).send(users);
});



/* POST /api/user/add */

router.post('/add', async (req: IRequest, res: Response) => {
  // const { user } = req.body;
  // if (!user) {
  //     return res.status(BAD_REQUEST).json({
  //         error: paramMissingError,
  //     });
  // }

  // todo add user
  return res.status(CREATED).end();
});



/* PUT /api/user/update */

router.put('/update', async (req: IRequest, res: Response) => {
  const { user } = req.body;
  if (!user) {
    return res.status(BAD_REQUEST).json({
      error: paramMissingError,
    });
  }
  user.id = Number(user.id);
  // todo user user
  return res.status(OK).end();
});



/* DELETE /api/user/delete/:id */

router.delete('/delete/:id', async (req: IRequest, res: Response) => {
  const { id } = req.params;
  // todo delete user by id
  return res.status(OK).end();
});

export default router;
