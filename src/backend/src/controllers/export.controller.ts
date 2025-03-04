/**
 * Export Controller
 * 
 * This file contains controller functions for managing exports,
 * including creating, retrieving, and downloading exports.
 */

import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Export from '../models/Export';
import Chapter from '../models/Chapter';
import Project from '../models/project.model';

/**
 * Get all exports for a project
 * @route GET /api/projects/:projectId/exports
 * @access Private
 */
export const getExports = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    const exports = await Export.find({ project: projectId }).sort({ created_at: -1 });

    return res.status(200).json({
      success: true,
      count: exports.length,
      data: exports
    });
  } catch (error: any) {
    console.error(`Error in getExports: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Create a new export
 * @route POST /api/projects/:projectId/exports
 * @access Private
 */
export const createExport = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const {
      format,
      name,
      description,
      configuration
    } = req.body;
    const userId = req.user?._id;

    // Validate project ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }

    // Check if project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check required fields
    if (!format || !name) {
      return res.status(400).json({
        success: false,
        message: 'Please provide format and name'
      });
    }

    // Validate format
    if (!['pdf', 'epub', 'docx', 'markdown', 'html'].includes(format)) {
      return res.status(400).json({
        success: false,
        message: 'Export format must be pdf, epub, docx, markdown, or html'
      });
    }

    // If no specific chapters are selected, get all project chapters
    let chapters = configuration?.include_chapters || [];
    if (!chapters.length) {
      const allChapters = await Chapter.find({ project: projectId }).sort({ order: 1 });
      chapters = allChapters.map(chapter => chapter._id);
    }

    // Create export
    const exportDoc = await Export.create({
      project: projectId,
      created_by: userId,
      format,
      name,
      description: description || '',
      status: 'pending',
      configuration: {
        include_chapters: chapters,
        include_title_page: configuration?.include_title_page !== false,
        include_table_of_contents: configuration?.include_table_of_contents !== false,
        include_character_list: configuration?.include_character_list || false,
        include_setting_descriptions: configuration?.include_setting_descriptions || false,
        custom_css: configuration?.custom_css || '',
        template_id: configuration?.template_id || undefined,
        page_size: configuration?.page_size || 'A4',
        font_family: configuration?.font_family || 'Times New Roman',
        font_size: configuration?.font_size || 12
      },
      download_count: 0
    });

    // TODO: Queue export job for processing
    // This would be a background job that generates the export file

    // For now, just simulate a completed export for testing
    setTimeout(async () => {
      try {
        await Export.findByIdAndUpdate(
          exportDoc._id,
          {
            status: 'completed',
            file_url: `https://placeholder.url/${exportDoc._id}.${format}`,
            completed_at: new Date(),
            file_size: Math.floor(Math.random() * 10000000) // Random file size for testing
          }
        );
        console.log(`Export ${exportDoc._id} marked as completed (simulated)`);
      } catch (err) {
        console.error('Error updating export status:', err);
      }
    }, 5000); // Simulate 5 second processing time

    return res.status(201).json({
      success: true,
      data: exportDoc,
      message: 'Export created and queued for processing'
    });
  } catch (error: any) {
    console.error(`Error in createExport: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Get an export by ID
 * @route GET /api/projects/:projectId/exports/:id
 * @access Private
 */
export const getExportById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate export ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid export ID' });
    }

    const exportDoc = await Export.findById(id)
      .populate('project', 'title')
      .populate('created_by', 'username')
      .populate('configuration.include_chapters', 'title order');

    if (!exportDoc) {
      return res.status(404).json({
        success: false,
        message: 'Export not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: exportDoc
    });
  } catch (error: any) {
    console.error(`Error in getExportById: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Download an export
 * @route GET /api/projects/:projectId/exports/:id/download
 * @access Private
 */
export const downloadExport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate export ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid export ID' });
    }

    const exportDoc = await Export.findById(id);

    if (!exportDoc) {
      return res.status(404).json({
        success: false,
        message: 'Export not found'
      });
    }

    // Check if export is completed
    if (exportDoc.status !== 'completed') {
      return res.status(400).json({
        success: false,
        message: `Export is not ready for download. Current status: ${exportDoc.status}`
      });
    }

    // Check if file URL exists
    if (!exportDoc.file_url) {
      return res.status(400).json({
        success: false,
        message: 'Export file is not available'
      });
    }

    // Update download count
    await Export.findByIdAndUpdate(
      id,
      { $inc: { download_count: 1 } }
    );

    // In a real implementation, we would serve the file
    // For now, redirect to the file URL (which is a placeholder)
    return res.status(200).json({
      success: true,
      message: 'Download initiated',
      file_url: exportDoc.file_url
    });
  } catch (error: any) {
    console.error(`Error in downloadExport: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

/**
 * Delete an export
 * @route DELETE /api/projects/:projectId/exports/:id
 * @access Private
 */
export const deleteExport = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate export ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid export ID' });
    }

    const exportDoc = await Export.findById(id);

    if (!exportDoc) {
      return res.status(404).json({
        success: false,
        message: 'Export not found'
      });
    }

    // TODO: Delete the actual export file from storage
    // This would depend on where files are stored (e.g., S3, local filesystem)

    await exportDoc.deleteOne();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error: any) {
    console.error(`Error in deleteExport: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
}; 