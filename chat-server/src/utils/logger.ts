import { Logger, ILogOptions } from '@7util/logger';

const options: ILogOptions = {
    useColor: true,
    logInFile: true,
    fileName: 'chat-server.log',
    logLevel: process.env.LOG_LEVEL
};

export default new Logger(options);