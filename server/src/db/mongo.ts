import { MongoClient, Db } from 'mongodb';
import logger from '@logger';''
import { dbName } from '@constants';

export default class Mongo {

    private readonly uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p73wf.mongodb.net/${dbName}?retryWrites=true&w=majority`;

    static db: Db;
    
    public async connect(): Promise<void> {
        const client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        try {
            await client.connect();
            const db: Db = client.db("codeShare");
            await db.command({ ping: 1 });

            logger.success("Connected to codeShare DB");
            Mongo.db = db;

        } catch(error) {
            await client.close();
            throw(error)
        }
    }
}
