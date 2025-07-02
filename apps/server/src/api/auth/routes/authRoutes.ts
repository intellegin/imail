import express, { Router } from 'express';

import { requiresAuth } from '../../../middleware/auth';
import { Auth0Service } from '../../../services/auth0Service';
import {
  mapAuth0ProfileToUserData,
  validateUserData,
} from '../../../utils/userMapper';
import { UserService } from '../../user/services/userService';
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

export default router;
