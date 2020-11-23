import './lib/preStart';
import app from '@server';
import logger from '@logger';
import Mongo from './db/mongo';

class Main {

    static async startServer(): Promise<void> {
        try {
            await new Mongo().connect();
            const port = Number(process.env.PORT || 3000);

            app.listen(port, () => logger.success(
                'Express server started on port: ' + port.toString().rainbow));

        } catch (error) {
            logger.err(error);
        }
    }
} 

Main.startServer();
