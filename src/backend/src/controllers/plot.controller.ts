/**
 * Plot Controller
 * 
 * This file contains controller functions for managing plots,
 * including creating, retrieving, updating, and deleting plots.
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Plot from '../models/Plot';

/**
 * Get all plots for a project
 * @route GET /api/projects/:projectId/plots
 * @access Private
 */
export const getPlots = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const plots = await Plot.find({ project: projectId }).sort({ title: 1 });

    return res.status(200).json({
      success: true,
      count: plots.length,
      data: plots
    });
  } catch (error: any) {
    console.error(`Error in getPlots: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create a new plot
 * @route POST /api/projects/:projectId/plots
 * @access Private
 */
export const createPlot = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, description, structure_type, plot_points } = req.body;
    const userId = req.user?._id;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    // Check required fields
    if (!title || !description || !structure_type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, and structure type'
      });
    }

    // Validate structure type
    if (!['three_act', 'hero_journey', 'save_the_cat', 'custom'].includes(structure_type)) {
      return res.status(400).json({
        success: false,
        message: 'Structure type must be three_act, hero_journey, save_the_cat, or custom'
      });
    }

    // Create plot
    const plot = await Plot.create({
      title,
      description,
      structure_type,
      plot_points: plot_points || [],
      project: projectId,
      created_by: userId
    });

    return res.status(201).json({
      success: true,
      data: plot
    });
  } catch (error: any) {
    console.error(`Error in createPlot: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get a plot by ID
 * @route GET /api/projects/:projectId/plots/:id
 * @access Private
 */
export const getPlotById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate plot ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid plot ID' });
    }

    const plot = await Plot.findById(id)
      .populate('plot_points.characters', 'name')
      .populate('plot_points.settings', 'name');

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: plot
    });
  } catch (error: any) {
    console.error(`Error in getPlotById: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update a plot
 * @route PUT /api/projects/:projectId/plots/:id
 * @access Private
 */
export const updatePlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, structure_type, plot_points } = req.body;

    // Validate plot ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid plot ID' });
    }

    // Find plot
    let plot = await Plot.findById(id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    // Validate structure type if provided
    if (structure_type && !['three_act', 'hero_journey', 'save_the_cat', 'custom'].includes(structure_type)) {
      return res.status(400).json({
        success: false,
        message: 'Structure type must be three_act, hero_journey, save_the_cat, or custom'
      });
    }

    // Update plot
    plot = await Plot.findByIdAndUpdate(
      id,
      {
        title: title || plot.title,
        description: description || plot.description,
        structure_type: structure_type || plot.structure_type,
        plot_points: plot_points || plot.plot_points
      },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: plot
    });
  } catch (error: any) {
    console.error(`Error in updatePlot: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Delete a plot
 * @route DELETE /api/projects/:projectId/plots/:id
 * @access Private
 */
export const deletePlot = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate plot ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid plot ID' });
    }

    const plot = await Plot.findById(id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    await plot.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    console.error(`Error in deletePlot: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Add a plot point to a plot
 * @route POST /api/projects/:projectId/plots/:id/points
 * @access Private
 */
export const addPlotPoint = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description, sequence, type, characters, settings } = req.body;

    // Validate plot ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid plot ID' });
    }

    // Check required fields
    if (!title || !description || sequence === undefined || !type) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, description, sequence, and type'
      });
    }

    // Validate plot point type
    if (!['exposition', 'rising_action', 'climax', 'falling_action', 'resolution', 'custom'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Plot point type must be valid'
      });
    }

    // Find plot
    const plot = await Plot.findById(id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    // Create new plot point
    const newPlotPoint = {
      title,
      description,
      sequence,
      type,
      characters: characters || [],
      settings: settings || []
    };

    // Add to plot points array
    plot.plot_points.push(newPlotPoint);

    // Sort plot points by sequence
    plot.plot_points.sort((a, b) => a.sequence - b.sequence);

    // Save plot
    await plot.save();

    return res.status(201).json({
      success: true,
      data: plot
    });
  } catch (error: any) {
    console.error(`Error in addPlotPoint: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update a plot point
 * @route PUT /api/projects/:projectId/plots/:id/points/:pointId
 * @access Private
 */
export const updatePlotPoint = async (req: Request, res: Response) => {
  try {
    const { id, pointId } = req.params;
    const { title, description, sequence, type, characters, settings } = req.body;

    // Validate plot ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid plot ID' });
    }

    // Find plot
    const plot = await Plot.findById(id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    // Find plot point index
    const pointIndex = plot.plot_points.findIndex(point => point._id?.toString() === pointId);

    if (pointIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Plot point not found'
      });
    }

    // Validate plot point type if provided
    if (type && !['exposition', 'rising_action', 'climax', 'falling_action', 'resolution', 'custom'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Plot point type must be valid'
      });
    }

    // Update plot point
    if (title) plot.plot_points[pointIndex].title = title;
    if (description) plot.plot_points[pointIndex].description = description;
    if (sequence !== undefined) plot.plot_points[pointIndex].sequence = sequence;
    if (type) plot.plot_points[pointIndex].type = type;
    if (characters) plot.plot_points[pointIndex].characters = characters;
    if (settings) plot.plot_points[pointIndex].settings = settings;

    // Sort plot points by sequence
    plot.plot_points.sort((a, b) => a.sequence - b.sequence);

    // Save plot
    await plot.save();

    return res.status(200).json({
      success: true,
      data: plot
    });
  } catch (error: any) {
    console.error(`Error in updatePlotPoint: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Delete a plot point
 * @route DELETE /api/projects/:projectId/plots/:id/points/:pointId
 * @access Private
 */
export const deletePlotPoint = async (req: Request, res: Response) => {
  try {
    const { id, pointId } = req.params;

    // Validate plot ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid plot ID' });
    }

    // Find plot
    const plot = await Plot.findById(id);

    if (!plot) {
      return res.status(404).json({
        success: false,
        message: 'Plot not found'
      });
    }

    // Find plot point index
    const pointIndex = plot.plot_points.findIndex(point => point._id?.toString() === pointId);

    if (pointIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Plot point not found'
      });
    }

    // Remove plot point
    plot.plot_points.splice(pointIndex, 1);

    // Save plot
    await plot.save();

    return res.status(200).json({
      success: true,
      data: plot
    });
  } catch (error: any) {
    console.error(`Error in deletePlotPoint: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 