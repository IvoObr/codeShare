import fs from 'fs-extra';
import logger from 'logger-mogger-js';

try {
    // Remove current build
    fs.removeSync('./dist/');
    // Copy front-end files
    fs.copySync('./src/public', './dist/public');
    fs.copySync('./src/views', './dist/views');
    // Copy env settings
    fs.copySync('./env', './dist/env');

} catch (err) {
    logger.error(err);
}
