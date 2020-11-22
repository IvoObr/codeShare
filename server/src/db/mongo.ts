import mongodb from 'mongodb';
const MongoClient = mongodb.MongoClient;

import logger from '@logger';''
import { dbName } from '@constants';

class Mongo {

  private readonly uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.p73wf.mongodb.net/${dbName}?retryWrites=true&w=majority`;

  public async getConnection(): Promise<mongodb.MongoClient> {
    
    const client = new MongoClient(this.uri, { useNewUrlParser: true, useUnifiedTopology: true });

    return new Promise((resolve, reject) => 
      client.connect((error, database) => {
        if (error) {
          reject(error);
        } else {
          logger.success(`Connected to ${dbName} DB`); 
          resolve(database);
        }
      })
    )
  }
}

export default new Mongo();
