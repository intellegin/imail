import { Request, Response, RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';

import { UserService } from '../services/userService';

export const getAllUsers: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const limit = parseInt(req.query.limit as string) || 30;
      const skip = parseInt(req.query.skip as string) || 0;

      const users = await UserService.getAllUsers(limit, skip);

      res.json({
        users: users,
        total: users.length,
        skip,
        limit,
      });
    } catch (error) {
      console.error('getAllUsers controller error:', error);
      res.json({
        users: [],
        total: 0,
        skip: 0,
        limit: 30,
      });
    }
  }
);

export const getUserById: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        error: 'User ID must be a valid number',
      });
      return;
    }

    const user = await UserService.getUserById(userId);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  }
);

export const getUserByAuth0Id: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { auth0_id } = req.params;

    if (!auth0_id) {
      res.status(400).json({
        success: false,
        error: 'Auth0 ID is required',
      });
      return;
    }

    const user = await UserService.getUserByAuth0Id(auth0_id);

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  }
);

export const createUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      auth0_id,
      email,
      full_name,
      picture_url,
      email_verified,
      user_metadata,
      app_metadata,
    } = req.body;

    if (!auth0_id || !email) {
      res.status(400).json({
        success: false,
        error: 'Auth0 ID and email are required',
      });
      return;
    }

    const existingUser = await UserService.getUserByAuth0Id(auth0_id);
    if (existingUser) {
      res.status(409).json({
        success: false,
        error: 'User with this Auth0 ID already exists',
      });
      return;
    }

    const userData = {
      auth0_id,
      email,
      full_name,
      picture_url,
      email_verified,
      user_metadata,
      app_metadata,
    };

    const user = await UserService.upsertUserOnLogin(userData);

    res.status(201).json({
      success: true,
      data: user,
    });
  }
);

export const updateUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        error: 'User ID must be a valid number',
      });
      return;
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const updatedUser = await UserService.updateUser(userId, updateData);

    res.json({
      success: true,
      data: updatedUser,
    });
  }
);

export const deleteUser: RequestHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      res.status(400).json({
        success: false,
        error: 'User ID is required',
      });
      return;
    }

    const userId = parseInt(id, 10);
    if (isNaN(userId)) {
      res.status(400).json({
        success: false,
        error: 'User ID must be a valid number',
      });
      return;
    }

    const user = await UserService.getUserById(userId);
    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found',
      });
      return;
    }

    const deleted = await UserService.deleteUser(userId);

    if (!deleted) {
      res.status(500).json({
        success: false,
        error: 'Failed to delete user',
      });
      return;
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
    });
  }
);
