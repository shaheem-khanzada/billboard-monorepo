import { env } from '@/common/utils/envConfig';
import { MongoClient } from 'mongodb';

const client = new MongoClient(env.MONGO_URI, {
  readConcernLevel: 'majority',
  writeConcern: { w: 'majority', j: true }
})

let db: MongoClient;

class DbService {
  connectToServer = async () => {
    try {
      await client.connect()
      db = client
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw new Error('Failed to connect to the database')
    }
  }

  getDb = async (dbName = 'billboard') => {
    if (!db) {
      await this.connectToServer()
    }
    return db.db(dbName);
  }

  getClient = () => {
    return client
  }
}

export default new DbService()

