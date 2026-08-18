import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

export async function connectDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri || uri.trim() === '' || uri.includes('<username>')) {
    console.log('\n[Database] ⚠️ MONGODB_URI is not configured in .env or contains placeholder.');
    console.log('[Database] ℹ️ To connect your live MongoDB database:');
    console.log('[Database] 1. Open .env file in the root directory.');
    console.log('[Database] 2. Set MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/shopstack?retryWrites=true&w=majority"');
    console.log('[Database] ℹ️ Running with local fallback data store in the meantime.\n');
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    console.log(`[Database] 🔄 Connecting to MongoDB...`);
    const db = await mongoose.connect(uri);
    isConnected = db.connections[0].readyState === 1;
    console.log(`[Database] ✅ Connected to MongoDB successfully (${db.connection.host}/${db.connection.name})`);
    return true;
  } catch (error: any) {
    console.error(`[Database] ❌ MongoDB Connection Error:`, error.message);
    console.log(`[Database] ℹ️ Please check your MONGODB_URI connection string and IP whitelist in MongoDB Atlas.\n`);
    return false;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
