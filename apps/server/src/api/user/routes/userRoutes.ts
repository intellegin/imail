import { Router } from 'express';

import { requiresAuth } from '../../../middleware/auth';
import {
  requirePermission,
  attachUserPermissions,
} from '../../../middleware/rbac';
import {
  getAllUsers,
  getUserById,
  getUserByAuth0Id,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/userController';

const router: Router = Router();

// Apply authentication and attach permissions to all routes
router.use(requiresAuth);
router.use(attachUserPermissions);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of users
 *       401:
 *         description: Unauthorized
 */
router.get('/', requirePermission('users', 'read'), getAllUsers);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/:id', requirePermission('users', 'read'), getUserById);

/**
 * @swagger
 * /api/users/auth0/{auth0_id}:
 *   get:
 *     summary: Get user by Auth0 ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: auth0_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Auth0 User ID
 *     responses:
 *       200:
 *         description: User details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/auth0/:auth0_id', getUserByAuth0Id);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Get current user's profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user's profile
 *       401:
 *         description: Unauthorized
 */
router.get('/me', requirePermission('profile', 'read'), getUserByAuth0Id);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - auth0_id
 *               - email
 *             properties:
 *               auth0_id:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               full_name:
 *                 type: string
 *               picture_url:
 *                 type: string
 *               email_verified:
 *                 type: boolean
 *               user_metadata:
 *                 type: object
 *               app_metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post('/', requirePermission('users', 'write'), createUser);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               full_name:
 *                 type: string
 *               picture_url:
 *                 type: string
 *               email_verified:
 *                 type: boolean
 *               user_metadata:
 *                 type: object
 *               app_metadata:
 *                 type: object
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.put('/:id', requirePermission('users', 'write'), updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.delete('/:id', requirePermission('users', 'delete'), deleteUser);

// Admin-only routes using role-based access
// TODO: Add these routes when RBAC controller methods are implemented
// router.post('/:id/assign-role', 
//   requireRole('Admin'), 
//   userController.assignRoleToUser
// );

// router.delete('/:id/remove-role/:roleName', 
//   requireRole('Admin'), 
//   userController.removeRoleFromUser
// );

export default router;
