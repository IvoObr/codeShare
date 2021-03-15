import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';
import { JwtService } from '../lib/JwtService';
import { UserRequest, IRequest } from '@interfaces';
import * as Consts from '@constants';

const router = Router();
// const userDal = new UserDal();
const jwtService = new JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED } = StatusCodes;

/* POST /api/auth/login */

router.post('/login', async (req: IRequest, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({ error: Consts.ERR_MISSING_PARAMETER });
    }
    /* Fetch user */

    //@ts-ignore: TODO put interface
    const user: any = null;// TODO get user by email

    if (!user) {
        return res.status(UNAUTHORIZED).json({
            error: Consts.ERR_LOGIN_FAILED
        });
    }
    /* Check password */
    const pwdPassed = await bcrypt.compare(password, user.password);
    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: Consts.ERR_LOGIN_FAILED
        });
    }
    /* Setup Admin JWT */
    const jwt = await jwtService.createJWT({
        id: user.id,
        role: user.role
    });

    res.header(Consts.xAuth, jwt).send({ user });
    return res.status(OK).end();
});

/* GET /api/auth/logout */

router.get('/logout', (req: Request, res: Response) => {
    // const { key, options } = cookieProps;
    // todo
    // res.clearCookie(key, options);

    // req.user.removeToken(req.token).then(() => {
    //     res.status(200).send();

    return res.status(OK).end();
});

export default router;
