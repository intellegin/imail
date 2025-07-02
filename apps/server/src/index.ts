import dotenv from 'dotenv';
import express from 'express';

import authRoutes from './api/auth/routes/authRoutes';
import userRoutes from './api/user/routes/userRoutes';
import { checkDatabaseConnection } from './db';
import { authMiddleware } from './middleware/auth';
import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { requestLogger } from './middleware/requestLogger';
import { securityHeaders } from './middleware/security';
import { swaggerConfig } from './utils/swagger';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV ?? 'development';

app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(authMiddleware);

app.get('/', (req, res) => {
  res.json({
    message: 'API is running successfully!',
    environment: NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  });
});

if (NODE_ENV === 'development') {
  swaggerConfig(app, PORT);
}

app.use(notFoundHandler);
app.use(errorHandler);

const startServer = async () => {
  const dbConnected = await checkDatabaseConnection();

  if (!dbConnected) {
    console.error('❌ Database connection failed');
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} (${NODE_ENV})`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
