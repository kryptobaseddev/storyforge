/**
 * Setting Controller
 * 
 * This file contains controller functions for managing settings,
 * including creating, retrieving, updating, and deleting settings.
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Setting from '../models/Setting';

/**
 * Get all settings for a project
 * @route GET /api/projects/:projectId/settings
 * @access Private
 */
export const getSettings = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { type } = req.query;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    // Build query
    const query: any = { project: projectId };
    
    // Add type filter if provided
    if (type && ['location', 'time_period', 'world_element'].includes(type as string)) {
      query.type = type;
    }

    const settings = await Setting.find(query).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: settings.length,
      data: settings
    });
  } catch (error: any) {
    console.error(`Error in getSettings: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create a new setting
 * @route POST /api/projects/:projectId/settings
 * @access Private
 */
export const createSetting = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { name, description, type, details } = req.body;
    const userId = req.user?._id;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    // Check required fields
    if (!name || !description || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, description, and type'
      });
    }

    // Validate setting type
    if (!['location', 'time_period', 'world_element'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Setting type must be location, time_period, or world_element'
      });
    }

    // Create setting
    const setting = await Setting.create({
      name,
      description,
      type,
      details: details || {},
      project: projectId,
      created_by: userId
    });

    return res.status(201).json({
      success: true,
      data: setting
    });
  } catch (error: any) {
    console.error(`Error in createSetting: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get a setting by ID
 * @route GET /api/projects/:projectId/settings/:id
 * @access Private
 */
export const getSettingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate setting ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid setting ID' });
    }

    const setting = await Setting.findById(id);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error: any) {
    console.error(`Error in getSettingById: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update a setting
 * @route PUT /api/projects/:projectId/settings/:id
 * @access Private
 */
export const updateSetting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, description, type, details } = req.body;

    // Validate setting ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid setting ID' });
    }

    // Find setting
    let setting = await Setting.findById(id);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    // Validate setting type if provided
    if (type && !['location', 'time_period', 'world_element'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Setting type must be location, time_period, or world_element'
      });
    }

    // Update setting
    setting = await Setting.findByIdAndUpdate(
      id,
      {
        name: name || setting.name,
        description: description || setting.description,
        type: type || setting.type,
        details: details || setting.details
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error: any) {
    console.error(`Error in updateSetting: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Delete a setting
 * @route DELETE /api/projects/:projectId/settings/:id
 * @access Private
 */
export const deleteSetting = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate setting ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid setting ID' });
    }

    const setting = await Setting.findById(id);

    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }

    await setting.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    console.error(`Error in deleteSetting: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 