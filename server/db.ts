import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongoDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn('[MongoDB] MONGODB_URI is not set in environment variables.');
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    console.log('[MongoDB] Connecting to MongoDB instance...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    isConnected = conn.connection.readyState === 1;
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    return false;
  }
}

export function isMongoConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export function getDatabaseStatus() {
  const state = mongoose.connection.readyState;
  const states: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  return {
    isConfigured: Boolean(process.env.MONGODB_URI),
    status: states[state] || 'disconnected',
    host: mongoose.connection.host || null,
    name: mongoose.connection.name || null,
  };
}
