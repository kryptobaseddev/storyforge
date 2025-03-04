/**
 * Project Controller
 * 
 * This controller handles project-related operations, including
 * creating, retrieving, updating, and deleting projects.
 */

import { Request, Response } from 'express';
import Project from '../models/project.model';
import mongoose from 'mongoose';

/**
 * Get all projects for the current user
 * @route GET /api/projects
 * @access Private
 */
export const getProjects = async (req: Request, res: Response) => {
  try {
    const userId = req.user._id;
    
    // Find all projects where user is owner or collaborator
    const projects = await Project.find({
      $or: [
        { userId },
        { 'collaborators.userId': userId }
      ]
    }).sort({ updatedAt: -1 });
    
    res.json(projects);
  } catch (error: any) {
    console.error('Get projects error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while retrieving projects'
      }
    });
  }
};

/**
 * Create a new project
 * @route POST /api/projects
 * @access Private
 */
export const createProject = async (req: Request, res: Response) => {
  try {
    const {
      title,
      description,
      genre,
      targetAudience,
      narrativeType,
      tone,
      style,
      targetLength,
      metadata
    } = req.body;
    
    // Validate required fields
    if (!title || !genre || !targetAudience || !narrativeType) {
      return res.status(400).json({
        error: {
          code: 'missing_required_fields',
          message: 'Please provide title, genre, targetAudience, and narrativeType'
        }
      });
    }
    
    // Create new project
    const project = await Project.create({
      userId: req.user._id,
      title,
      description: description || '',
      genre,
      targetAudience,
      narrativeType,
      tone: tone || 'Neutral',
      style: style || 'Neutral',
      targetLength: targetLength || { type: 'Words', value: 0 },
      metadata: metadata || {
        createdWithTemplate: false,
        tags: []
      }
    });
    
    res.status(201).json(project);
  } catch (error: any) {
    console.error('Create project error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while creating project'
      }
    });
  }
};

/**
 * Get a project by ID
 * @route GET /api/projects/:id
 * @access Private
 */
export const getProjectById = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid project ID'
        }
      });
    }
    
    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        error: {
          code: 'project_not_found',
          message: 'Project not found'
        }
      });
    }
    
    res.json(project);
  } catch (error: any) {
    console.error('Get project error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while retrieving project'
      }
    });
  }
};

/**
 * Update a project
 * @route PUT /api/projects/:id
 * @access Private
 */
export const updateProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid project ID'
        }
      });
    }
    
    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        error: {
          code: 'project_not_found',
          message: 'Project not found'
        }
      });
    }
    
    // Check ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 'not_authorized',
          message: 'Not authorized to update this project'
        }
      });
    }
    
    // Update fields
    const {
      title,
      description,
      genre,
      targetAudience,
      narrativeType,
      status,
      tone,
      style,
      targetLength,
      metadata
    } = req.body;
    
    if (title) project.title = title;
    if (description !== undefined) project.description = description;
    if (genre) project.genre = genre;
    if (targetAudience) project.targetAudience = targetAudience;
    if (narrativeType) project.narrativeType = narrativeType;
    if (status) project.status = status;
    if (tone) project.tone = tone;
    if (style) project.style = style;
    if (targetLength) project.targetLength = targetLength;
    if (metadata) {
      project.metadata = {
        ...project.metadata,
        ...metadata
      };
    }
    
    // Save updated project
    const updatedProject = await project.save();
    
    res.json(updatedProject);
  } catch (error: any) {
    console.error('Update project error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while updating project'
      }
    });
  }
};

/**
 * Delete a project
 * @route DELETE /api/projects/:id
 * @access Private
 */
export const deleteProject = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid project ID'
        }
      });
    }
    
    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        error: {
          code: 'project_not_found',
          message: 'Project not found'
        }
      });
    }
    
    // Check ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 'not_authorized',
          message: 'Not authorized to delete this project'
        }
      });
    }
    
    // Delete project
    await project.deleteOne();
    
    res.json({ message: 'Project removed' });
  } catch (error: any) {
    console.error('Delete project error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while deleting project'
      }
    });
  }
};

/**
 * Add a collaborator to a project
 * @route POST /api/projects/:id/collaborators
 * @access Private
 */
export const addCollaborator = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const { userId, role } = req.body;
    
    // Validate request
    if (!userId || !role) {
      return res.status(400).json({
        error: {
          code: 'missing_fields',
          message: 'User ID and role are required'
        }
      });
    }
    
    // Validate MongoDB IDs
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid project ID or user ID'
        }
      });
    }
    
    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        error: {
          code: 'project_not_found',
          message: 'Project not found'
        }
      });
    }
    
    // Check ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 'not_authorized',
          message: 'Not authorized to modify collaborators'
        }
      });
    }
    
    // Check if user is already a collaborator
    const existingCollaborator = project.collaborators.find(
      collab => collab.userId.toString() === userId
    );
    
    if (existingCollaborator) {
      return res.status(400).json({
        error: {
          code: 'already_collaborator',
          message: 'User is already a collaborator'
        }
      });
    }
    
    // Add collaborator
    project.collaborators.push({
      userId: new mongoose.Types.ObjectId(userId),
      role
    });
    
    // Save updated project
    await project.save();
    
    res.status(201).json(project.collaborators);
  } catch (error: any) {
    console.error('Add collaborator error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while adding collaborator'
      }
    });
  }
};

/**
 * Remove a collaborator from a project
 * @route DELETE /api/projects/:id/collaborators/:userId
 * @access Private
 */
export const removeCollaborator = async (req: Request, res: Response) => {
  try {
    const projectId = req.params.id;
    const collaboratorId = req.params.userId;
    
    // Validate MongoDB IDs
    if (!mongoose.Types.ObjectId.isValid(projectId) || !mongoose.Types.ObjectId.isValid(collaboratorId)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid project ID or user ID'
        }
      });
    }
    
    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        error: {
          code: 'project_not_found',
          message: 'Project not found'
        }
      });
    }
    
    // Check ownership
    if (project.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        error: {
          code: 'not_authorized',
          message: 'Not authorized to modify collaborators'
        }
      });
    }
    
    // Remove collaborator
    project.collaborators = project.collaborators.filter(
      collab => collab.userId.toString() !== collaboratorId
    );
    
    // Save updated project
    await project.save();
    
    res.json({ message: 'Collaborator removed' });
  } catch (error: any) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while removing collaborator'
      }
    });
  }
}; 