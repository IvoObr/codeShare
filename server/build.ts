import fs from 'fs-extra';
import Logger from 'jet-logger';

try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    fs.copySync('./src/public', './dist/public');
    fs.copySync('./src/views', './dist/views');
    // Copy env settings
    fs.copySync('./env', './dist/env');

} catch (err) {
    Logger.Err(err);
}
