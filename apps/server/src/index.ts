import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';

import authRoutes from './api/auth/routes/authRoutes';
import userRoutes from './api/user/routes/userRoutes';
import { checkDatabaseConnection } from './db';
import { authMiddleware } from './middleware/auth';
import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import { securityHeaders, corsDebugger } from './middleware/security';
import { swaggerConfig } from './utils/swagger';

dotenv.config();

const app = express();
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 3000;
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const FRONTEND_URL = process.env.FRONTEND_URL ?? '';

const getEffectiveFrontendURL = () => {
  if (NODE_ENV === 'development') {
    return process.env.DEV_FRONTEND_URL ?? 'http://localhost:5173';
  }

  if (!FRONTEND_URL) {
    console.error('❌ FRONTEND_URL is required in production');
    throw new Error(
      'FRONTEND_URL environment variable is required in production'
    );
  }

  return FRONTEND_URL;
};

console.log('=== Server Configuration ===');
console.log('Environment:', NODE_ENV);
console.log('Port:', PORT);
console.log('Frontend URL:', FRONTEND_URL);
console.log('Effective Frontend URL:', getEffectiveFrontendURL());

app.use(NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(securityHeaders);
app.use(corsDebugger);
app.use(corsMiddleware);
app.use(authMiddleware);

app.get('/', async (req, res) => {
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
    'Surrogate-Control': 'no-store',
  });

  const isAuthenticated = req.oidc?.isAuthenticated() ?? false;
  const user = req.oidc?.user ?? null;

  // If request wants JSON (from frontend), return auth status
  if (req.get('Accept')?.includes('application/json')) {
    return res.json({
      authenticated: isAuthenticated,
      user: isAuthenticated
        ? {
            id: user?.sub,
            email: user?.email,
            name: user?.name,
            picture: user?.picture,
            emailVerified: user?.email_verified,
          }
        : null,
    });
  }

  // Browser navigation - redirect behavior
  if (isAuthenticated) {
    const frontendUrl = getEffectiveFrontendURL();
    return res.redirect(frontendUrl);
  } else {
    return res.json({
      message: 'API is running successfully!',
      environment: NODE_ENV,
      timestamp: new Date().toISOString(),
      authenticated: false,
    });
  }
});

app.all('/callback', (req, res) => {
  const isAuthenticated = req.oidc?.isAuthenticated() || false;
  const user = req.oidc?.user || null;

  if (req.query.error) {
    const errorMessage = String(req.query.error_description || req.query.error);
    const frontendUrl = getEffectiveFrontendURL();
    return res.redirect(
      `${frontendUrl}/welcome?error=${encodeURIComponent(errorMessage)}`
    );
  }

  if (isAuthenticated && user) {
    const frontendUrl = getEffectiveFrontendURL();
    return res.redirect(frontendUrl);
  } else {
    const frontendUrl = getEffectiveFrontendURL();
    return res.redirect(`${frontendUrl}/welcome?error=authentication_failed`);
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
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
  console.log('=== Server Startup ===');

  const dbConnected = await checkDatabaseConnection();

  if (!dbConnected) {
    console.error(
      '❌ Failed to connect to database. Server will still start but DB operations may fail.'
    );
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${NODE_ENV}`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
