import bcrypt from 'bcrypt';
import { Request, Response, Router } from 'express';
import StatusCodes from 'http-status-codes';
import { JwtService } from '../lib/JwtService';
import { UserRequest } from '@interfaces';
import { paramMissingError, loginFailedErr, IRequest } from '@constants';

const router = Router();
// const userDal = new UserDal();
const jwtService = new JwtService();
const { BAD_REQUEST, OK, UNAUTHORIZED } = StatusCodes;


/* POST /api/auth/login */

router.post('/login', async (req: IRequest, res: Response) => {
    const email: string = req.body.email;
    const password: string = req.body.password;

    if (!(email && password)) {
        return res.status(BAD_REQUEST).json({ error: paramMissingError });
    }
    /* Fetch user */
    
    //@ts-ignore
    const user: any  = null// todo get user by email

    if (!user) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }
    /* Check password */
    const pwdPassed = await bcrypt.compare(password, user.pwdHash);
    if (!pwdPassed) {
        return res.status(UNAUTHORIZED).json({
            error: loginFailedErr,
        });
    }
    /* Setup Admin JWT */
    const jwt = await jwtService.createJWT({
        id: user.id,
        role: user.role,
    });

    res.header('x-auth', jwt).send({ user });
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
