import express, { Router } from 'express';

import { requiresAuth } from '../../../middleware/auth';
import { Auth0User } from '../../../types/user';
import { UserService } from '../../user/services/userService';

const router: Router = express.Router();

const extractUserData = (auth0User: Auth0User) => ({
  auth0_id: auth0User.sub,
  email: auth0User.email,
  full_name: auth0User.name ?? null,
  given_name: auth0User.given_name ?? null,
  family_name: auth0User.family_name ?? null,
  picture_url: auth0User.picture ?? null,
  email_verified: auth0User.email_verified ?? false,
  user_metadata: auth0User.user_metadata ?? null,
  app_metadata: auth0User.app_metadata ?? null,
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
router.get('/verify', async (req, res) => {
  const isAuthenticated = req.oidc?.isAuthenticated() || false;
  const user = req.oidc?.user || null;

  if (isAuthenticated && user) {
    try {
      const userData = extractUserData(user as Auth0User);
      const dbUser = await UserService.upsertUserOnLogin(userData);
      console.log('User verified and saved to database:', dbUser.id);
    } catch (error) {
      console.error('Failed to save user to database:', error);
    }
  }

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

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and update status
 *     tags: [Auth]
 *     security:
 *       - oidc: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.post('/logout', async (req, res) => {
  const user = req.oidc?.user;

  if (user) {
    try {
      await UserService.updateUserStatusOnLogout(user.sub);
      console.log('User status updated to inactive on logout:', user.sub);
    } catch (error) {
      console.error('Failed to update user status on logout:', error);
    }
  }

  res.json({
    message: 'Logout processed successfully',
  });
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current user's full profile from database
 *     tags: [Auth]
 *     security:
 *       - oidc: []
 *     responses:
 *       200:
 *         description: User profile data from database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: User not found in database
 *       401:
 *         description: Unauthorized - User not authenticated
 */
router.get('/me', requiresAuth, async (req, res) => {
  const user = req.oidc?.user;

  if (!user) {
    res.status(401).json({
      success: false,
      error: 'User not authenticated',
    });
    return;
  }

  try {
    const dbUser = await UserService.getUserByAuth0Id(user.sub);

    if (!dbUser) {
      res.status(404).json({
        success: false,
        error: 'User not found in database',
      });
      return;
    }

    res.json({
      success: true,
      data: dbUser,
    });
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user profile',
    });
  }
});

export default router;
