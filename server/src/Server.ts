import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from '@logger';
import 'express-async-errors';
import { AuthRouter, SnippetRouter, UserRouter } from '@routes';
import * as Const from '@constants';
import bodyParser from 'body-parser';
import { StatusCodes } from '@enums';
import * as core from "express-serve-static-core";
import express, { Request, Response, Router } from 'express';

class Server {

    private readonly app: core.Express;

    private readonly staticDir: string = path.join(__dirname, 'public');

    constructor() {
        this.app = express();
    }

    private useMiddleware(): this {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(bodyParser.json());
        this.app.use(express.static(this.staticDir));
        this.app.use(cors({ origin: `http://localhost`, exposedHeaders: [Const.xAuth]}));

        return this;
    }

    private prepareEnv(): this {
        /* Show routes called in console during development */
        process.env.NODE_ENV === 'development' && this.app.use(morgan('dev'));
        /* Security */
        process.env.NODE_ENV === 'production' && this.app.use(helmet());

        return this;
    }

    private useAPIs(): this {
        const router: Router = Router(); 

        router.use('/auth', AuthRouter);
        router.use('/snippet', SnippetRouter);
        router.use('/user', UserRouter);
        
        this.app.use('/api', router);
        return this;
    }

    private printErrors(): this {
        /* Print API errors */

        // todo fix
        this.app.use((error: Error, req: Request, res: Response) => {
            logger.error(error);
            return res.status(StatusCodes.BAD_REQUEST)
                .json({ error: error.message });
        });

        return this;
    }

    public start(): core.Express {
        return this.useMiddleware().prepareEnv().useAPIs().printErrors().app;
    }
}

export default Server;