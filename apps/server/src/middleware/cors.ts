import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: [
    process.env.CORS_ORIGIN ?? '',
    'https://imailapp.vercel.app',
    'http://localhost:5173',
  ].filter(Boolean),
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Cookie'],
};

export const corsMiddleware = cors(corsOptions);
