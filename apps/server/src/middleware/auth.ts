import { RequestHandler } from 'express';
import { auth, requiresAuth as oidcRequiresAuth } from 'express-openid-connect';

const baseURL = process.env.BASE_URL;
const clientID = process.env.AUTH0_CLIENT_ID;
const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
const secret = process.env.SESSION_SECRET;
const frontendURL = process.env.FRONTEND_URL ?? '';
const nodeEnv = process.env.NODE_ENV ?? 'development';

const getEffectiveFrontendURL = () => {
  if (nodeEnv === 'development') {
    return process.env.DEV_FRONTEND_URL || 'http://localhost:5173';
  }
  return frontendURL;
};

console.log('=== Auth0 Configuration ===');
console.log('baseURL:', baseURL ?? 'AUTO-DETECT');
console.log('clientID:', clientID ? 'SET' : 'NOT SET');
console.log('issuerBaseURL:', issuerBaseURL ? 'SET' : 'NOT SET');
console.log('secret:', secret ? 'SET' : 'NOT SET');
console.log('configured frontendURL:', frontendURL);
console.log('effective frontendURL:', getEffectiveFrontendURL());
console.log('environment:', nodeEnv);

if (!clientID) {
  console.error('❌ AUTH0_CLIENT_ID environment variable is required');
  console.warn('🔧 Server will start without Auth0 authentication');
}

if (!issuerBaseURL) {
  console.error('❌ AUTH0_ISSUER_BASE_URL environment variable is required');
  console.warn('🔧 Server will start without Auth0 authentication');
}

if (!secret) {
  console.error('❌ SESSION_SECRET environment variable is required');
  console.warn('🔧 Server will start without Auth0 authentication');
}

const hasValidAuth0Config = clientID && issuerBaseURL && secret;

let authMiddleware: RequestHandler;

if (!hasValidAuth0Config) {
  console.warn('⚠️  Auth0 configuration incomplete - using mock middleware');

  authMiddleware = (req, _res, next) => {
    (req as any).oidc = {
      isAuthenticated: () => false,
      user: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      idToken: undefined,
      idTokenClaims: undefined,
    };
    next();
  };
} else {
  if (secret!.length < 32) {
    console.warn(
      '⚠️  SESSION_SECRET should be at least 32 characters long for security'
    );
  }

  const effectiveBaseURL = baseURL ?? 'http://localhost:3000';
  const isHttps = effectiveBaseURL.startsWith('https://');

  const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: effectiveBaseURL,
    clientID,
    issuerBaseURL,
    secret,
    session: {
      name: 'imail-session',
      rolling: true,
      rollingDuration: 24 * 60 * 60,
      cookie: {
        httpOnly: true,
        secure: isHttps,
        sameSite: nodeEnv === 'production' ? 'None' : 'Lax',
        path: '/',
        domain: nodeEnv === 'production' ? undefined : undefined, // Let browser set domain automatically
      },
    },
    routes: {
      login: '/login',
      logout: '/logout',
      callback: '/callback',
      postLogoutRedirect: getEffectiveFrontendURL(),
    },
    authorizationParams: {
      scope: 'openid profile email',
    },
    attemptSilentLogin: false,
  };

  console.log('✅ Auth0 configured:', effectiveBaseURL);
  console.log('🔒 Protocol:', isHttps ? 'HTTPS' : 'HTTP');
  console.log(
    '🍪 Cookie config - Secure:',
    isHttps,
    'SameSite:',
    nodeEnv === 'production' ? 'None' : 'Lax'
  );

  authMiddleware = auth(config);
}

export { authMiddleware };

export const requiresAuth: RequestHandler = oidcRequiresAuth();
