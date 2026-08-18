import mongoose from 'mongoose';

let isConnected = false;

export async function connectMongoDB(): Promise<boolean> {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.log('[Database] No MONGODB_URI found in environment. Running with local fallback data store.');
    return false;
  }

  if (isConnected) {
    return true;
  }

  try {
    console.log('[Database] Connecting to MongoDB...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    isConnected = conn.connection.readyState === 1;
    console.log(`[Database] Successfully connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
    return true;
  } catch (error) {
    console.error('[Database] Failed to connect to MongoDB:', error);
    console.log('[Database] Operating with local store until MongoDB connection is established.');
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
