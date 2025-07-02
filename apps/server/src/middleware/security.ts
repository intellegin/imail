import { Request, Response, NextFunction } from 'express';

const NODE_ENV = process.env.NODE_ENV ?? 'development';

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  if (NODE_ENV === 'production') {
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'"
    );
    res.setHeader(
      'Permissions-Policy',
      'cross-origin-isolated=(), same-origin-allow-popups=(), storage-access=()'
    );
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  } else {
    res.setHeader(
      'Permissions-Policy',
      'cross-origin-isolated=*, same-origin-allow-popups=*, storage-access=*'
    );
    res.setHeader('Cross-Origin-Opener-Policy', 'unsafe-none');
    res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none');
  }

  next();
};