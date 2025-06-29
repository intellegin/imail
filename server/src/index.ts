import path from 'path';

import dotenv from 'dotenv';
import express from 'express';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

import authRouter from './api/auth/routes/authRoutes';
import usersRouter from './api/users/routes/userRoutes';
import { checkDatabaseConnection } from './db';
import { authMiddleware } from './middleware/auth';
import { corsMiddleware } from './middleware/cors';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3000;
const NODE_ENV = process.env.NODE_ENV ?? 'development';
const FRONTEND_URL = process.env.FRONTEND_URL ?? '';

app.use(NODE_ENV === 'production' ? morgan('combined') : morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(authMiddleware);

app.get('/', async (req, res) => {
  console.log('Auth status:', req.oidc?.isAuthenticated());
  console.log('User:', req.oidc?.user);

  if (req.oidc?.isAuthenticated()) {
    console.log('✅ User is authenticated, redirecting to frontend');
    return res.redirect(FRONTEND_URL);
  } else {
    console.log('❌ User not authenticated');
    return res.json({
      message: 'API is running successfully!',
      environment: NODE_ENV,
      timestamp: new Date().toISOString(),
      authenticated: req.oidc?.isAuthenticated() || false,
    });
  }
});

app.get('/callback', (req, res) => {
  console.log('=== Auth Callback Handler ===');
  console.log('Request URL:', req.url);
  console.log('Request query:', req.query);
  console.log('Auth status:', req.oidc?.isAuthenticated());
  console.log('User:', req.oidc?.user);
  console.log('Access token available:', !!req.oidc?.accessToken);

  const isAuthenticated = req.oidc?.isAuthenticated() || false;
  const user = req.oidc?.user || null;

  if (req.query.error) {
    console.error('❌ Auth0 callback error:', req.query.error);
    console.error('Error description:', req.query.error_description);

    const errorMessage = String(req.query.error_description || req.query.error);
    console.log('Redirecting to frontend with error');
    return res.redirect(
      `${FRONTEND_URL}/welcome?error=${encodeURIComponent(errorMessage)}`
    );
  }

  if (isAuthenticated && user) {
    console.log('✅ User successfully authenticated');
    console.log('User data:', {
      id: user.sub,
      email: user.email,
      name: user.name,
      picture: user.picture,
      emailVerified: user.email_verified,
    });

    console.log('Redirecting authenticated user to frontend');
    return res.redirect(FRONTEND_URL);
  } else {
    console.log('❌ User not authenticated after callback');
    console.log('Redirecting to frontend welcome page');

    return res.redirect(`${FRONTEND_URL}/welcome?error=authentication_failed`);
  }
});

app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

if (NODE_ENV === 'development') {
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'imail API',
        version: '1.0.0',
        description: 'API documentation for imail',
      },
      servers: [{ url: `http://localhost:${PORT}/api` }],
      components: {
        securitySchemes: {
          oidc: {
            type: 'openIdConnect',
            openIdConnectUrl: `${process.env.AUTH0_ISSUER_BASE_URL}.well-known/openid_configuration`,
          },
        },
        schemas: {
          User: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              email: { type: 'string' },
              username: { type: 'string' },
              name: { type: 'string' },
              created_at: { type: 'string', format: 'date-time' },
              updated_at: { type: 'string', format: 'date-time' },
            },
          },
        },
      },
      security: [{ oidc: [] }],
    },
    apis: [path.join(__dirname, './api/**/*.ts')],
  };

  const specs = swaggerJsdoc(swaggerOptions);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
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
    if (NODE_ENV === 'development') {
      console.log(`📚 API documentation: http://localhost:${PORT}/api-docs`);
    }
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
