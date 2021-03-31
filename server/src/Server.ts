import cors from 'cors';
import path from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import logger from '@logger';
import 'express-async-errors';
import express from 'express';
import * as Const from '@constants';
import bodyParser from 'body-parser';
import { StatusCodes } from '@enums';
import * as core from "express-serve-static-core";
import { AuthRouter, SnippetRouter, UserRouter } from '@routes';


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
        // const router: Router = Router(); 
        this.app.use('/auth', AuthRouter);
        this.app.use('/snippet', SnippetRouter);
        this.app.use('/user', UserRouter);

        // this.app.use('/codeShare', router);

        return this;
    }

    public start(): core.Express {
        return this.useMiddleware().prepareEnv().useAPIs().app;
    }
}

export default Server;