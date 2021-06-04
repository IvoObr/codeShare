import dotenv from 'dotenv';
import { Logger, ILogOptions } from '@7dev-works/logger';
dotenv.config();

const options: ILogOptions = {
    useColor: true,
    logInFile: true,
    fileName: 'ssl-renewal.log',
    logLevel: process.env.LOG_LEVEL
};

export default new Logger(options);