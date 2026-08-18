import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { connectDB } from './server/db';
import { initStore } from './server/store';
import authRoutes from './server/routes/auth';
import productRoutes from './server/routes/products';
import orderRoutes from './server/routes/orders';
import userRoutes from './server/routes/users';
import statsRoutes from './server/routes/stats';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Basic Middlewares
  app.use(cors());
  app.use(express.json());

  // Connect to Database
  await connectDB();
  await initStore();

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'ShopStack Backend API',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/users', userRoutes);
  app.use('/api/stats', statsRoutes);

  // Vite middleware for development vs Static file serving for production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
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
    console.log(`\n==================================================`);
    console.log(`🚀 ShopStack Server running on http://0.0.0.0:${PORT}`);
    console.log(`📦 Database: ${process.env.MONGODB_URI ? 'Configured in .env' : 'Running in Local Mode (configure MONGODB_URI in .env)'}`);
    console.log(`==================================================\n`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
