import express from 'express';
import path from 'path';
import apiRouter from './server/routes/api.js';
import { connectMongoDB, getDatabaseStatus } from './server/db.js';
import { seedMongoIfEmpty } from './server/repository.js';

const __dirname = process.cwd();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize MongoDB connection if MONGODB_URI is provided
  try {
    const mongoConnected = await connectMongoDB();
    if (mongoConnected) {
      await seedMongoIfEmpty();
    }
  } catch (dbErr) {
    console.error('[Startup] MongoDB initialization notice:', dbErr);
  }

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // API Router FIRST
  app.use('/api', apiRouter);

  // Health and Database status endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      database: getDatabaseStatus(),
      timestamp: new Date().toISOString()
    });
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

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ShopStack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
