import mongoose from "mongoose";

declare global {
  var mongoose: { conn: mongoose.Mongoose | null };
}

const MONGODB_URI = process.env.MONGODB_URI;

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

  if (typeof MONGODB_URI !== "string") {
    return;
  }

  cached.conn = await mongoose.connect(MONGODB_URI);
  return cached.conn;
}

export default connectMongo;
