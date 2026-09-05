import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import apiRouter from './server/routes/api.js';
import { connectMongoDB } from './server/db.js';
import { seedMongoIfEmpty } from './server/seed/seedData.js';

dotenv.config();

// Origins allowed to call this API cross-origin (e.g. your Vercel frontend).
// Set CORS_ORIGINS to a comma-separated list, e.g.:
//   CORS_ORIGINS=https://shopstack.vercel.app,http://localhost:5173
const allowedOrigins = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

function isAllowedOrigin(origin: string): boolean {
  if (allowedOrigins.includes(origin)) return true;
  try {
    const hostname = new URL(origin).hostname;
    // Allow all Vercel preview/production deployment URLs by default.
    if (hostname.endsWith('.vercel.app')) return true;
  } catch {
    // ignore malformed origin header
  }
  return false;
}

async function startServer() {
  const app = express();
  // Railway (and most hosts) assign the port via the PORT env var at
  // runtime — binding to a hardcoded port means the platform can't route
  // traffic to the app. Falls back to 3000 for local dev.
  const PORT = Number(process.env.PORT) || 3000;

  // CORS (must be registered before routes). We use Bearer tokens, not
  // cookies, so credentials: true is not needed here.
  app.use(
    cors({
      origin(origin, callback) {
        // No origin header = same-origin request, curl, server-to-server, etc.
        if (!origin || isAllowedOrigin(origin)) {
          callback(null, true);
        } else {
          callback(new Error(`Not allowed by CORS: ${origin}`));
        }
      },
    })
  );

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Router FIRST
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Vite middleware for development
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
