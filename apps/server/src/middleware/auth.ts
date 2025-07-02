import { RequestHandler } from 'express';

let jwtVerify: any;
let createRemoteJWKSet: any;
let JWKS: any;

async function initJose() {
  if (!jwtVerify) {
    const jose = await import('jose');
    jwtVerify = jose.jwtVerify;
    createRemoteJWKSet = jose.createRemoteJWKSet;
    const auth0Domain = process.env.AUTH0_ISSUER_BASE_URL ?? '';
    JWKS = createRemoteJWKSet(new URL(`${auth0Domain}/.well-known/jwks.json`));
  }
  return { jwtVerify, JWKS };
}

const authMiddleware: RequestHandler = (req, res, next) => {
  next();
};

const requiresAuth: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const { jwtVerify: verify, JWKS: jwks } = await initJose();
    const auth0Domain =
      process.env.AUTH0_DOMAIN ?? 'https://intellegin.us.auth0.com';
    const auth0Audience =
      process.env.AUTH0_AUDIENCE ?? `${auth0Domain}/api/v2/`;
    const { payload } = await verify(token, jwks, {
      issuer: `${auth0Domain}/`,
      audience: auth0Audience,
    });

    req.user = payload;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

export { authMiddleware, requiresAuth };
