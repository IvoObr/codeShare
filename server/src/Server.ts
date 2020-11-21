import morgan from 'morgan';
import path from 'path';
import helmet from 'helmet';
import StatusCodes from 'http-status-codes';
import express, { NextFunction, Request, Response } from 'express';

import 'express-async-errors';

import BaseRouter from './routes';
import logger from '@shared/Logger';

const app = express();
const { BAD_REQUEST } = StatusCodes;


/* Server */
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const staticDir = path.join(__dirname, 'public');
app.use(express.static(staticDir));

/* Show routes called in console during development */
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

/* Security */
if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
}

/* Add APIs */
app.use('/api', BaseRouter);

/* Print API errors */
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    logger.err(err, true);
    return res.status(BAD_REQUEST).json({
        error: err.message,
    });
});

export default app;
