import cors, { CorsOptions } from 'cors';

const NODE_ENV = process.env.NODE_ENV ?? 'development';
const FRONTEND_URL = process.env.FRONTEND_URL ?? '';
const AUTH0_ISSUER_BASE_URL = process.env.AUTH0_ISSUER_BASE_URL ?? '';

const getAllowedOrigins = (): string[] => {
  const origins: string[] = [];

  if (AUTH0_ISSUER_BASE_URL) {
    origins.push(AUTH0_ISSUER_BASE_URL);
  }

  if (NODE_ENV === 'production') {
    if (FRONTEND_URL) {
      origins.push(FRONTEND_URL);
    }
    const productionUrl = process.env.FRONTEND_URL ?? '';
    origins.push(productionUrl);
    if (process.env.CORS_ADDITIONAL_ORIGINS) {
      origins.push(...process.env.CORS_ADDITIONAL_ORIGINS.split(','));
    }
  } else {
    origins.push('http://localhost:5173', 'http://localhost:3000');

    if (FRONTEND_URL) {
      origins.push(FRONTEND_URL);
    }
  }

  if (process.env.CORS_ORIGIN) {
    origins.push(process.env.CORS_ORIGIN);
  }

  return origins.filter(Boolean);
};

const allowedOrigins = getAllowedOrigins();

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || origin === 'null') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    if (NODE_ENV === 'development' && origin.includes('localhost')) {
      return callback(null, true);
    }

    console.error(`❌ CORS blocked: ${origin}`);
    callback(new Error(`CORS policy violation: Origin ${origin} not allowed`));
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Accept',
    'Authorization',
    'Cookie',
    'X-Requested-With',
    'X-HTTP-Method-Override',
    'Cache-Control',
    'Access-Control-Allow-Credentials',
  ],
  exposedHeaders: [
    'Set-Cookie',
    'X-Total-Count',
    'X-RateLimit-Limit',
    'X-RateLimit-Remaining',
  ],
  preflightContinue: false,
  maxAge: NODE_ENV === 'production' ? 86400 : 300,
};

export const corsMiddleware = cors(corsOptions);
