import { RequestHandler } from 'express';
import { auth, requiresAuth as oidcRequiresAuth } from 'express-openid-connect';

const baseURL = process.env.BASE_URL ?? '';
const clientID = process.env.AUTH0_CLIENT_ID;
const issuerBaseURL = process.env.AUTH0_ISSUER_BASE_URL;
const secret = process.env.SESSION_SECRET;
const frontendURL = process.env.FRONTEND_URL ?? '';

console.log('=== Auth0 Configuration ===');
console.log('baseURL:', baseURL);
console.log(
  'clientID:',
  clientID ? `${clientID.substring(0, 10)}...` : 'NOT SET'
);
console.log('issuerBaseURL:', issuerBaseURL);
console.log('secret:', secret ? 'SET' : 'NOT SET');
console.log('frontendURL:', frontendURL);

if (!clientID) {
  console.error('❌ AUTH0_CLIENT_ID environment variable is required');
  throw new Error('AUTH0_CLIENT_ID environment variable is required');
}

if (!issuerBaseURL) {
  console.error('❌ AUTH0_ISSUER_BASE_URL environment variable is required');
  throw new Error('AUTH0_ISSUER_BASE_URL environment variable is required');
}

if (!secret) {
  console.error('❌ SESSION_SECRET environment variable is required');
  throw new Error('SESSION_SECRET environment variable is required');
}

if (secret.length < 32) {
  console.warn(
    '⚠️  SESSION_SECRET should be at least 32 characters long for security'
  );
}

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
  },
  routes: {
    login: '/login',
    logout: '/logout',
    callback: '/callback',
    postLogoutRedirect: frontendURL,
  },
};

console.log('✅ Auth0 middleware configured successfully');

export const authMiddleware: RequestHandler = auth(config);

export const requiresAuth: RequestHandler = oidcRequiresAuth();
