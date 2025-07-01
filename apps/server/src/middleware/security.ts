import { Request, Response, NextFunction } from 'express';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const securityHeaders = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Security headers for production
  if (NODE_ENV === 'production') {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Prevent MIME type sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // XSS Protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Referrer Policy
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Content Security Policy (basic)
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    );
  }

  next();
};

export const corsDebugger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Only debug CORS in development
  if (NODE_ENV === 'development') {
    const origin = req.get('Origin');
    const method = req.method;

    if (method === 'OPTIONS') {
      console.log('🔍 CORS Preflight Request:');
      console.log('  Origin:', origin || 'No origin');
      console.log(
        '  Method:',
        req.get('Access-Control-Request-Method') || 'None'
      );
      console.log(
        '  Headers:',
        req.get('Access-Control-Request-Headers') || 'None'
      );
    } else if (origin) {
      console.log(`🔍 CORS Request: ${method} from ${origin}`);
    }
  }

  next();
};
