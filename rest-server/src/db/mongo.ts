import { logger } from '@utils';
import { MongoClient, Db } from 'mongodb';

export default class Mongo {

    private readonly uri: string = 'mongodb+srv://' +
        process.env.DB_USER + ':' +
        process.env.DB_PASSWORD + '@cluster0.p73wf.mongodb.net/' +
        process.env.DB_NAME + '?retryWrites=true&w=majority';

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

        } catch (error: unknown) {
            await client.close();
            throw error;
        }
    }
}
