import 'dotenv/config'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
if (!uri) throw new Error('MONGODB_URI is not defined')

export const client = new MongoClient(uri)

let db

export async function connectToDatabase() {
  if (!db) {
    await client.connect()
    db = client.db('db')
    console.log(`Connected to database: ${db.databaseName}`)
  }
  return db
}

export function getCollection(collectionName) {
  if (!db) throw new Error('Database not connected')
  return db.collection(collectionName)
}
