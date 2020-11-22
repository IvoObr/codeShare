import './preStart';
import mongodb from 'mongodb';
import app from '@server';
import logger from '@logger';
import Mongo from './db/mongo';

export let db: mongodb.MongoClient;

async function main(): Promise<void> {
    try {
        db = await Mongo.getConnection()

        const port = Number(process.env.PORT || 3000);

        app.listen(port, () =>
            logger.success('Express server started on port: ' + port.toString().rainbow));
        
    } catch (error) {
        logger.err(error);
    }
} 

main();