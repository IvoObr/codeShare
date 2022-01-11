import dotenv from 'dotenv';
import { Logger, ILogOptions } from '@7util/logger';
dotenv.config();

const options: ILogOptions = {
    useColor: true,
    logInFile: true,
    fileName: 'notification.log',
    logLevel: process.env.LOG_LEVEL
};

export default new Logger(options);