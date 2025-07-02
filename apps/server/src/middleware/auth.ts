import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

const auth0Domain =
  process.env.AUTH0_ISSUER_BASE_URL ?? 'https://intellegin.us.auth0.com';

let jwksClient: any = null;
let client: any = null;

async function initJwksClient() {
  if (!jwksClient) {
    jwksClient = (await import('jwks-client' as any)).default;
    client = jwksClient({
      jwksUri: `${auth0Domain}/.well-known/jwks.json`,
      requestHeaders: {}, // Optional
      timeout: 30000, // Defaults to 30s
    });
  }
  return client;
}

function getKey(
  header: any,
  callback: (err: any, signingKey?: string) => void
) {
  initJwksClient()
    .then(jwksClientInstance => {
      jwksClientInstance.getSigningKey(header.kid, (err: any, key: any) => {
        if (err) {
          return callback(err);
        }

        let signingKey: string;

        if (typeof key?.getPublicKey === 'function') {
          signingKey = key.getPublicKey();
        } else if (key?.publicKey) {
          signingKey = key.publicKey;
        } else if (key?.rsaPublicKey) {
          signingKey = key.rsaPublicKey;
        } else if (typeof key === 'string') {
          signingKey = key;
        } else {
          console.log(
            'Unexpected key structure:',
            JSON.stringify(key, null, 2)
          );
          return callback(
            new Error('Unable to extract public key from JWKS response')
          );
        }

        callback(null, signingKey);
      });
    })
    .catch(callback);
}

const authMiddleware: RequestHandler = (req, res, next) => {
  next();
};

const requiresAuth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const auth0Audience = process.env.AUTH0_AUDIENCE ?? `${auth0Domain}/api/v2/`;

  jwt.verify(
    token,
    getKey,
    {
      audience: auth0Audience,
      issuer: `${auth0Domain}/`,
      algorithms: ['RS256'],
    },
    (err, decoded) => {
      if (err) {
        console.error('JWT verification failed:', err);
        return res.status(401).json({ error: 'Invalid token' });
      }

      req.user = decoded;
      next();
    }
  );
};

export { authMiddleware, requiresAuth };
