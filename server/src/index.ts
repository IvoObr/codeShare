import './preStart';
import app from '@server';
import colors from 'colors';
import logger from '@shared/Logger';


/* Start the server  */
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    logger.info('Express server started on port: ' + String(port).yellow);
});
