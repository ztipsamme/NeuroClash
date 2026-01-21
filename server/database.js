import 'dotenv/config'
import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI
export const client = new MongoClient(uri)
let database = client.db('db')
let connect$

async function _connectToDatabase() {
  if (database) return database

  if (!uri) {
    throw new Error('MONGODB_URI is not defined')
  }

  await client.connect()

  console.log(`Connected to database: ${database.databaseName}`)

  return database
}

export async function connectToDatabase() {
  connect$ ??= _connectToDatabase()
  return await connect$
}

export function getCollection(collectionName) {
  if (!database) {
    throw new Error('Database not connected.')
  }

  return database.collection(collectionName)
}
