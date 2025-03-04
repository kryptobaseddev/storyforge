/**
 * User Controller
 * 
 * This controller handles user-related operations, including
 * profile updates, password changes, and preference management.
 */

import { Request, Response } from 'express';
import User from '../models/user.model';

/**
 * Update user profile
 * @route PUT /api/users/profile
 * @access Private
 */
export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, username, email, age, avatar } = req.body;
    const userId = req.user._id;

    // Check if email or username is already taken
    if (email || username) {
      const existingUser = await User.findOne({
        $and: [
          { _id: { $ne: userId } },
          { $or: [
            { email: email || '' },
            { username: username || '' }
          ]}
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          error: {
            code: 'duplicate_field',
            message: 'Email or username is already taken'
          }
        });
      }
    }

    // Find and update user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'user_not_found',
          message: 'User not found'
        }
      });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (username) user.username = username;
    if (email) user.email = email;
    if (age) user.age = age;
    if (avatar) user.avatar = avatar;

    // Save updated user
    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      age: updatedUser.age,
      avatar: updatedUser.avatar
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while updating profile'
      }
    });
  }
};

/**
 * Change user password
 * @route PUT /api/users/password
 * @access Private
 */
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    // Validate request
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: {
          code: 'missing_fields',
          message: 'Current password and new password are required'
        }
      });
    }

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'user_not_found',
          message: 'User not found'
        }
      });
    }

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        error: {
          code: 'invalid_password',
          message: 'Current password is incorrect'
        }
      });
    }

    // Update password
    user.passwordHash = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error: any) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while changing password'
      }
    });
  }
};

/**
 * Get user preferences
 * @route GET /api/users/preferences
 * @access Private
 */
export const getPreferences = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('preferences');

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'user_not_found',
          message: 'User not found'
        }
      });
    }

    res.json(user.preferences);
  } catch (error: any) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while retrieving preferences'
      }
    });
  }
};

/**
 * Update user preferences
 * @route PUT /api/users/preferences
 * @access Private
 */
export const updatePreferences = async (req: Request, res: Response) => {
  try {
    const { theme, fontSize, readingLevel, notificationSettings } = req.body;
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        error: {
          code: 'user_not_found',
          message: 'User not found'
        }
      });
    }

    // Update preferences if provided
    if (theme) user.preferences.theme = theme;
    if (fontSize) user.preferences.fontSize = fontSize;
    if (readingLevel) user.preferences.readingLevel = readingLevel;
    if (notificationSettings) user.preferences.notificationSettings = {
      ...user.preferences.notificationSettings,
      ...notificationSettings
    };

    // Save updated user
    await user.save();

    res.json(user.preferences);
  } catch (error: any) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while updating preferences'
      }
    });
  }
}; 