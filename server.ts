import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './server/routes/api.js';
import { connectMongoDB } from './server/db.js';
import { seedMongoIfEmpty } from './server/seed/seedData.js';

dotenv.config();


// Origins are compared without trailing slashes, so "https://x.vercel.app/"
// in CORS_ORIGINS still matches the browser's "https://x.vercel.app".
const normalizeOrigin = (o: string) => o.trim().replace(/\/+$/, '');

const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map(normalizeOrigin)
  .filter(Boolean);

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return true;
  // Auth uses Bearer tokens (no cookies), so with no explicit allowlist it is
  // safe to accept any origin. Set CORS_ORIGINS to restrict it.
  if (allowedOrigins.length === 0) return true;
  const normalized = normalizeOrigin(origin);
  if (allowedOrigins.includes('*') || allowedOrigins.includes(normalized)) return true;
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
  console.warn(`[CORS] Blocked origin: ${origin}. Add it to CORS_ORIGINS to allow it.`);
  return false;
}

// The bundled server (dist/server.cjs) is always the production build, even
// when the host (e.g. Railway) doesn't set NODE_ENV. Without this it would try
// to load vite, which is a devDependency, and crash on startup.
const isProduction =
  process.env.NODE_ENV === 'production' || Boolean(process.argv[1]?.endsWith('.cjs'));

async function startServer() {
  const app = express();
  
  const PORT = Number(process.env.PORT) || 3000;

  
  const corsMiddleware = cors({
    origin(origin, callback) {
      callback(null, !origin || isAllowedOrigin(origin));
    },
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 86400,
  });
  app.use(corsMiddleware);
  app.options('*', corsMiddleware);

  
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  app.use('/api', apiRouter);

  // Unknown API routes return JSON instead of falling through to index.html
  app.use('/api', (req, res) => {
    res.status(404).json({ message: `API route not found: ${req.method} ${req.originalUrl}` });
  });

  // Errors (e.g. malformed JSON bodies) return JSON; CORS headers are already set
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (res.headersSent) return next(err);
    console.error('[Server Error]:', err);
    res.status(err.status || err.statusCode || 500).json({ message: err.message || 'Internal server error' });
  });

  
  if (!isProduction) {
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
