import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './server/routes/api.js';
import { connectMongoDB } from './server/db.js';
import { seedMongoIfEmpty } from './server/seed/seedData.js';

dotenv.config();


const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return true;
  if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) return true;
  try {
    const hostname = new URL(origin).hostname;
    
    if (hostname.endsWith('.run.app')) return true;
    
    if (hostname.endsWith('.vercel.app')) return true;
    
    if (hostname.endsWith('.railway.app') || hostname.endsWith('.up.railway.app')) return true;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    
    if (process.env.APP_URL) {
      try {
        if (new URL(process.env.APP_URL).hostname === hostname) return true;
      } catch {
        
      }
    }
  } catch {
    
  }
  return false;
}

async function startServer() {
  const app = express();
  
  const PORT = Number(process.env.PORT) || 3000;

  
  app.use(
    cors({
      origin(origin, callback) {
        
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(null, false);
        }
      },
    })
  );

  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  
  app.use('/api', apiRouter);

  
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Connect to MongoDB
  try {
    const connected = await connectMongoDB();
    if (connected) {
      await seedMongoIfEmpty();
    }
  } catch (err) {
    console.error('[MongoDB Startup Error]:', err);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShopStack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
