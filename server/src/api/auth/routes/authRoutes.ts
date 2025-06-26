import express, { Router } from 'express';

import { requiresAuth } from '../../../middleware/auth';

const router: Router = express.Router();

/**
 * @swagger
 * /api/auth/check-auth:
 *   get:
 *     summary: Check authentication status
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isAuthenticated:
 *                   type: boolean
 *                 user:
 *                   type: object
 */
router.get('/check-auth', (req, res) => {
  console.log('=== Check Auth Endpoint ===');
  console.log('Auth status:', req.oidc?.isAuthenticated());
  console.log('User present:', !!req.oidc?.user);

  if (req.oidc?.isAuthenticated() && req.oidc.user) {
    const user = req.oidc.user;
    console.log('✅ User is authenticated');

    return res.status(200).json({
      isAuthenticated: true,
      user: {
        id: user.sub,
        email: user.email,
        name: user.name,
        picture: user.picture,
        emailVerified: user.email_verified,
      },
    });
  } else {
    console.log('❌ User is not authenticated');

    return res.status(200).json({
      isAuthenticated: false,
      user: null,
    });
  }
});

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Auth]
 *     security:
 *       - oidc: []
 *     responses:
 *       200:
 *         description: User profile data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Unauthorized - User not authenticated
 */
router.get('/profile', requiresAuth, (req, res) => {
  console.log('=== Profile Request ===');
  console.log('User:', req.oidc?.user);

  res.json({
    message: 'Protected profile endpoint',
    user: req.oidc?.user || null,
  });
});

/**
 * @swagger
 * /api/auth/verify:
 *   get:
 *     summary: Check authentication status
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Authentication status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 authenticated:
 *                   type: boolean
 *                 user:
 *                   type: object
 */
router.get('/verify', (req, res) => {
  console.log('=== Auth Verify ===');

  const isAuthenticated = req.oidc?.isAuthenticated() || false;
  const user = req.oidc?.user || null;

  console.log('Authentication status:', isAuthenticated);
  console.log('User present:', !!user);

  res.json({
    authenticated: isAuthenticated,
    user: isAuthenticated
      ? {
          id: user?.sub,
          email: user?.email,
          name: user?.name,
          picture: user?.picture,
          emailVerified: user?.email_verified,
        }
      : null,
  });
});

export default router;
