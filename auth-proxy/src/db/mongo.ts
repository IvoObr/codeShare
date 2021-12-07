import logger from '../lib/logger';
import { MongoClient, Db } from 'mongodb';

export default class Mongo {

    private readonly uri: string = 'mongodb://' +
        process.env.DB_USER + ':' +
        process.env.DB_PASSWORD + '@' +
        process.env.DB_HOST + ':' +
        process.env.DB_PORT + '/' +
        process.env.DB_NAME + '?poolSize=20&writeConcern=majority';
    
    static db: Db;

    public async connect(): Promise<void> {
        const client: MongoClient = new MongoClient(this.uri, {
            useNewUrlParser: true, useUnifiedTopology: true
        });
        try {
            await client.connect();
            const db: Db = client.db(process.env.DB_NAME);
            await db.command({ ping: 1 });

            logger.success(`Connected to ${process.env.DB_NAME?.yellow?.bold} DB`);
            Mongo.db = db;

        } catch (error) {
            await client.close();
            throw error;
        }
    }
}
