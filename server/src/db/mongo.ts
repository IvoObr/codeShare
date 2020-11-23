import { MongoClient, Db } from 'mongodb';
import logger from '@logger';''
import { dbName } from '@constants';

class Mongo {

  private readonly uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p73wf.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  public async getConnection(): Promise<Db> {
    const client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    try {
      await client.connect();
      const db: Db = client.db("codeShare");
      await db.command({ ping: 1 });

      logger.success("Connected to codeShare DB");
      return db;

    } catch(error) {
      await client.close();
      throw(error)
    }
  }
}

export default new Mongo();
