import { Logger, ILogOptions } from '@7dev-works/logger';

const options: ILogOptions = {
    useColor: true,
    logInFile: true,
    fileName: 'rest-server.log'
};

const logger: Logger = new Logger(options);

export default logger;