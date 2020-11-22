import Logger from 'jet-logger';
import colors from 'colors';

class logger extends Logger {
  success(msg: string) {
    logger.Info(msg.yellow);
  }
}

export default new logger();
  