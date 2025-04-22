// lib/mongodb.ts
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

console.log(MONGODB_URI);

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null };
}

async function connectMongo() {
  if (cached.conn) return cached.conn;

  cached.conn = await mongoose.connect(MONGODB_URI);
  return cached.conn;
}

export default connectMongo;
