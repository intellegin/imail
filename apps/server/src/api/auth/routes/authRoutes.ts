import express, { Router } from 'express';

import { requiresAuth } from '../../../middleware/auth';
import {
  mapAuth0ProfileToUserData,
  validateUserData,
} from '../../../utils/userMapper';
import { UserService } from '../../user/services/userService';
import { Auth0Service } from '../services/auth0Service';
import { RBACService } from '../services/rbacService';
import '../../../types/auth';

const router: Router = express.Router();

router.get('/verify', requiresAuth, async (req, res) => {
  const jwtPayload = req.user as any;

  try {
    const authHeader = req.headers.authorization;
    const accessToken = authHeader?.replace('Bearer ', '');

    if (!accessToken) {
      return res.status(401).json({ error: 'No access token provided' });
    }

    const userProfile = await Auth0Service.getUserProfile(accessToken);
    const userData = mapAuth0ProfileToUserData(jwtPayload, userProfile);
    validateUserData(userData);
    await UserService.upsertUserOnLogin(userData);

    console.log(`✅ User verified and upserted: ${userData.email}`);

    res.json({
      authenticated: true,
      user: {
        id: jwtPayload.sub,
        email: userProfile.email,
        name: userProfile.name,
        picture: userProfile.picture,
        emailVerified: userProfile.email_verified,
      },
    });
  } catch (error) {
    console.error(
      '❌ User verification failed:',
      error instanceof Error ? error.message : error
    );

    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', requiresAuth, (req, res) => {
  const user = req.user as any;

  res.json({
    success: true,
    data: {
      auth0_id: user.sub,
      email: user.email,
      full_name: user.name,
      picture_url: user.picture,
      email_verified: user.email_verified,
    },
  });
});

// New profile endpoint with roles and permissions
router.get('/profile', requiresAuth, async (req, res) => {
  const jwtPayload = req.user as any;
  const auth0Id = jwtPayload.sub;

  try {
    // Get user with roles and permissions
    const userWithRoles =
      await RBACService.getUserWithPermissionsByAuth0Id(auth0Id);

    if (!userWithRoles) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        id: userWithRoles.id,
        email: userWithRoles.email,
        given_name: userWithRoles.given_name,
        family_name: userWithRoles.family_name,
        roles: userWithRoles.roles,
        permissions: userWithRoles.permissions,
        // Include Auth0 profile data
        auth0_id: auth0Id,
        full_name: jwtPayload.name,
        picture_url: jwtPayload.picture,
        email_verified: jwtPayload.email_verified,
      },
    });
  } catch (error) {
    console.error('❌ Error fetching user profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/roles', async (req, res) => {
  try {
    const roles = await RBACService.getAllRoles();
    res.json({ success: true, data: roles });
  } catch (error) {
    console.error('❌ Error fetching roles:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
