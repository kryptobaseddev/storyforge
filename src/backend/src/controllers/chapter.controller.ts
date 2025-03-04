/**
 * Chapter Controller
 * 
 * This file contains controller functions for managing chapters,
 * including creating, retrieving, updating, and deleting chapters.
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Chapter from '../models/Chapter';

/**
 * Get all chapters for a project
 * @route GET /api/projects/:projectId/chapters
 * @access Private
 */
export const getChapters = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const chapters = await Chapter.find({ project: projectId }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      count: chapters.length,
      data: chapters
    });
  } catch (error: any) {
    console.error(`Error in getChapters: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create a new chapter
 * @route POST /api/projects/:projectId/chapters
 * @access Private
 */
export const createChapter = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, content, synopsis, order, status, characters, settings, plot_points, notes, ai_generated, ai_generation_data } = req.body;
    const userId = req.user?._id;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    // Check required fields
    if (!title || !content || !synopsis || order === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, content, synopsis, and order'
      });
    }

    // Create chapter
    const chapter = await Chapter.create({
      title,
      content,
      synopsis,
      order,
      status: status || 'draft',
      project: projectId,
      created_by: userId,
      characters: characters || [],
      settings: settings || [],
      plot_points: plot_points || [],
      notes: notes || '',
      ai_generated: ai_generated || false,
      ai_generation_data: ai_generation_data || undefined,
      edits: []
    });

    return res.status(201).json({
      success: true,
      data: chapter
    });
  } catch (error: any) {
    console.error(`Error in createChapter: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get a chapter by ID
 * @route GET /api/projects/:projectId/chapters/:id
 * @access Private
 */
export const getChapterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate chapter ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid chapter ID' });
    }

    const chapter = await Chapter.findById(id)
      .populate('characters', 'name')
      .populate('settings', 'name')
      .populate('created_by', 'username');

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: chapter
    });
  } catch (error: any) {
    console.error(`Error in getChapterById: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Update a chapter
 * @route PUT /api/projects/:projectId/chapters/:id
 * @access Private
 */
export const updateChapter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, synopsis, order, status, characters, settings, plot_points, notes } = req.body;
    const userId = req.user?._id;

    // Validate chapter ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid chapter ID' });
    }

    // Find chapter
    let chapter = await Chapter.findById(id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    // Validate status if provided
    if (status && !['draft', 'review', 'final'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Chapter status must be draft, review, or final'
      });
    }

    // Create edit record if content is being changed
    const createEditRecord = content && content !== chapter.content;
    const editData = createEditRecord ? {
      timestamp: new Date(),
      edited_by: userId,
      notes: 'Content updated'
    } : undefined;

    // Update chapter
    const updateData: any = {
      title: title || chapter.title,
      synopsis: synopsis || chapter.synopsis,
      status: status || chapter.status,
      notes: notes !== undefined ? notes : chapter.notes,
      $push: {}
    };

    // Only add these fields if they are provided
    if (content) updateData.content = content;
    if (order !== undefined) updateData.order = order;
    if (characters) updateData.characters = characters;
    if (settings) updateData.settings = settings;
    if (plot_points) updateData.plot_points = plot_points;
    
    // Add edit record if needed
    if (editData) {
      updateData.$push.edits = editData;
    }

    // Update chapter
    chapter = await Chapter.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: chapter
    });
  } catch (error: any) {
    console.error(`Error in updateChapter: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Delete a chapter
 * @route DELETE /api/projects/:projectId/chapters/:id
 * @access Private
 */
export const deleteChapter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate chapter ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid chapter ID' });
    }

    const chapter = await Chapter.findById(id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: 'Chapter not found'
      });
    }

    await chapter.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    console.error(`Error in deleteChapter: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Reorder chapters
 * @route PUT /api/projects/:projectId/chapters/reorder
 * @access Private
 */
export const reorderChapters = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { chapterOrders } = req.body;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    // Validate request body
    if (!chapterOrders || !Array.isArray(chapterOrders)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of chapter orders'
      });
    }

    // Validate chapter IDs and orders
    for (const item of chapterOrders) {
      if (!item.id || !mongoose.Types.ObjectId.isValid(item.id) || item.order === undefined) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid chapter ID and order'
        });
      }
    }

    // Update chapter orders
    const updatePromises = chapterOrders.map(item => 
      Chapter.findByIdAndUpdate(
        item.id, 
        { order: item.order },
        { new: true }
      )
    );

    await Promise.all(updatePromises);

    // Get updated chapters
    const chapters = await Chapter.find({ project: projectId }).sort({ order: 1 });

    return res.status(200).json({
      success: true,
      message: 'Chapters reordered successfully',
      data: chapters
    });
  } catch (error: any) {
    console.error(`Error in reorderChapters: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Generate a chapter with AI
 * @route POST /api/projects/:projectId/chapters/generate
 * @access Private
 */
export const generateChapter = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const { title, synopsis, characters, plot_points, settings, prompt } = req.body;
    const userId = req.user?._id;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    // Check required fields
    if (!title || !synopsis || !prompt) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, synopsis, and prompt'
      });
    }

    // TODO: Implement AI generation logic here
    // This would call an AI service to generate chapter content
    // For now, we'll just create a placeholder with a note that it needs AI integration

    // Get the next order number
    const lastChapter = await Chapter.findOne({ project: projectId }).sort({ order: -1 });
    const order = lastChapter ? lastChapter.order + 1 : 0;

    // Create chapter
    const chapter = await Chapter.create({
      title,
      content: "This is AI-generated placeholder content. AI integration is needed here.",
      synopsis,
      order,
      status: 'draft',
      project: projectId,
      created_by: userId,
      characters: characters || [],
      settings: settings || [],
      plot_points: plot_points || [],
      notes: 'This chapter was generated with AI assistance.',
      ai_generated: true,
      ai_generation_data: {
        prompt,
        model: 'placeholder',
        timestamp: new Date()
      },
      edits: []
    });

    return res.status(201).json({
      success: true,
      data: chapter,
      message: 'AI chapter generation is a placeholder. Integration with AI service is needed.'
    });
  } catch (error: any) {
    console.error(`Error in generateChapter: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 