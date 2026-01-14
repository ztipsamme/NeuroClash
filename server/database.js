import "dotenv/config";
import { MongoClient } from "mongodb";

let client = null;
let database = null;
let connect$;

async function _connectToDatabase() {
  if (database) return database;

  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not defined");
  }

  client = new MongoClient(uri);
  await client.connect();

  database = client.db("db");
  console.log(`Connected to database: ${database.databaseName}`);

  return database;
}

export async function connectToDatabase() {
  connect$ ??= _connectToDatabase();
  return await connect$;
}

export function getCollection(collectionName) {
  if (!database) {
    throw new Error("Database not connected.");
  }

  return database.collection(collectionName);
}
