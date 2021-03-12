import Logger, { LoggerModes, Formats } from 'jet-logger';
import colors from 'colors';

class logger extends Logger {

    // constructor() {
    //     super(LoggerModes.Console, "null", false, Formats.Line);
    // }

    success(msg: string) {
        logger.Info(msg.yellow);
    }
}

export default new logger();
  