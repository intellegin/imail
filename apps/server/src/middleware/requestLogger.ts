import { Request, Response, NextFunction } from 'express';

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const start = Date.now();

  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    const duration = Date.now() - start;
    const { method, originalUrl } = req;
    const { statusCode } = res;

    const statusEmoji =
      statusCode >= 400 ? '❌' : statusCode >= 300 ? '⚠️ ' : '✅';

    console.log(
      `${statusEmoji} ${method} ${originalUrl} ${statusCode} ${duration}ms`
    );

    return (originalEnd as any).apply(this, args);
  };

  next();
};
