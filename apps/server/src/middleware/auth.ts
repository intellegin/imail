import { RequestHandler } from 'express';
import { auth, requiresAuth as oidcRequiresAuth } from 'express-openid-connect';

const baseURL = process.env.BASE_URL;
const clientID = process.env.AUTH0_CLIENT_ID;
const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
const secret = process.env.SESSION_SECRET;
const frontendURL = process.env.FRONTEND_URL ?? '';

console.log('=== Auth0 Configuration ===');
console.log('baseURL:', baseURL || 'DYNAMIC (will be detected from requests)');
console.log('secret:', secret ? 'SET' : 'NOT SET');
console.log('frontendURL:', frontendURL);

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

// Dynamic base URL detection function
const getBaseURL = (req: any) => {
  if (baseURL) {
    return baseURL;
  }

  // Auto-detect from request headers
  const protocol = req.get('X-Forwarded-Proto') || req.protocol || 'http';
  const host = req.get('X-Forwarded-Host') || req.get('Host') || req.hostname;
  const detectedURL = `${protocol}://${host}`;

  console.log(`🔍 Auto-detected base URL: ${detectedURL}`);
  return detectedURL;
};

// Check if all required Auth0 config is available
const hasValidAuth0Config = clientID && issuerBaseURL && secret;

let authMiddleware: RequestHandler;

if (!hasValidAuth0Config) {
  console.warn('⚠️  Auth0 configuration incomplete - using mock middleware');

  // Create a mock middleware that sets basic auth properties
  authMiddleware = (req, _res, next) => {
    // Mock OIDC properties for development
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

  // Create Auth0 middleware with dynamic baseURL support
  if (baseURL) {
    // Static baseURL configuration
    const isHttps = baseURL.startsWith('https://');
    const config = {
      authRequired: false,
      auth0Logout: true,
      baseURL,
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
          sameSite: isHttps ? 'None' : 'Lax',
          maxAge: 24 * 60 * 60 * 1000,
        },
      },
      routes: {
        login: '/login',
        logout: '/logout',
        callback: '/callback',
        postLogoutRedirect: frontendURL,
      },
      // Fix response_mode for HTTP vs HTTPS
      ...(isHttps
        ? {}
        : {
            authorizationParams: {
              response_mode: 'query',
              scope: 'openid profile email',
            },
          }),
    };

    console.log('✅ Auth0 middleware configured with static baseURL:', baseURL);
    console.log(
      '🔒 Protocol:',
      isHttps ? 'HTTPS (secure)' : 'HTTP (development)'
    );
    authMiddleware = auth(config);
  } else {
    // Dynamic baseURL - initialize auth middleware on first request
    let dynamicAuth: RequestHandler | null = null;

    authMiddleware = (req, res, next) => {
      if (!dynamicAuth) {
        const detectedBaseURL = getBaseURL(req);
        const isHttps = detectedBaseURL.startsWith('https://');

        const config = {
          authRequired: false,
          auth0Logout: true,
          baseURL: detectedBaseURL,
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
              sameSite: isHttps ? 'None' : 'Lax',
              maxAge: 24 * 60 * 60 * 1000,
            },
          },
          routes: {
            login: '/login',
            logout: '/logout',
            callback: '/callback',
            postLogoutRedirect: frontendURL,
          },
          ...(isHttps
            ? {}
            : {
                authorizationParams: {
                  response_mode: 'query',
                  scope: 'openid profile email',
                },
              }),
        };

        console.log(
          '✅ Auth0 middleware configured with dynamic baseURL:',
          detectedBaseURL
        );
        console.log('🔒 Protocol:', isHttps ? 'HTTPS (secure)' : 'HTTP (development)');
        dynamicAuth = auth(config);
      }

      dynamicAuth(req, res, next);
    };
  }

  console.log('📍 URL Detection:', baseURL ? 'Static' : 'Dynamic');
}

export { authMiddleware };

export const requiresAuth: RequestHandler = oidcRequiresAuth();
