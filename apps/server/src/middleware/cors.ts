import cors, { CorsOptions } from 'cors';

const corsOptions: CorsOptions = {
  origin: process.env.CORS_ORIGIN ?? '',
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
};

export const corsMiddleware = cors(corsOptions);
