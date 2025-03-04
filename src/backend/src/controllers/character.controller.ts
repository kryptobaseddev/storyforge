/**
 * Character Controller
 * 
 * This controller handles character-related operations, including
 * creating, retrieving, updating, and deleting characters.
 */

import { Request, Response } from 'express';
import Character from '../models/character.model';
import Project from '../models/project.model';
import mongoose from 'mongoose';

/**
 * Get all characters for a project
 * @route GET /api/projects/:projectId/characters
 * @access Private
 */
export const getCharacters = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid project ID'
        }
      });
    }
    
    // Find all characters for the project
    const characters = await Character.find({ projectId }).sort({ name: 1 });
    
    res.json(characters);
  } catch (error: any) {
    console.error('Get characters error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while retrieving characters'
      }
    });
  }
};

/**
 * Create a new character
 * @route POST /api/projects/:projectId/characters
 * @access Private
 */
export const createCharacter = async (req: Request, res: Response) => {
  try {
    const { projectId } = req.params;
    const {
      name,
      shortDescription,
      detailedBackground,
      role,
      attributes,
      relationships,
      imageUrl,
      notes
    } = req.body;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid project ID'
        }
      });
    }
    
    // Check if project exists
    const project = await Project.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        error: {
          code: 'project_not_found',
          message: 'Project not found'
        }
      });
    }
    
    // Validate required fields
    if (!name || !shortDescription || !role) {
      return res.status(400).json({
        error: {
          code: 'missing_required_fields',
          message: 'Please provide name, shortDescription, and role'
        }
      });
    }
    
    // Create new character
    const character = await Character.create({
      projectId,
      name,
      shortDescription,
      detailedBackground: detailedBackground || '',
      role,
      attributes: attributes || {
        physical: {
          age: 0,
          height: '',
          build: '',
          hairColor: '',
          eyeColor: '',
          distinguishingFeatures: []
        },
        personality: {
          traits: [],
          strengths: [],
          weaknesses: [],
          fears: [],
          desires: []
        },
        background: {
          birthplace: '',
          family: '',
          education: '',
          occupation: '',
          significantEvents: []
        },
        motivation: '',
        arc: ''
      },
      relationships: relationships || [],
      plotInvolvement: [],
      imageUrl,
      notes
    });
    
    res.status(201).json(character);
  } catch (error: any) {
    console.error('Create character error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while creating character'
      }
    });
  }
};

/**
 * Get a character by ID
 * @route GET /api/projects/:projectId/characters/:id
 * @access Private
 */
export const getCharacterById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid character ID'
        }
      });
    }
    
    // Find character
    const character = await Character.findById(id);
    
    if (!character) {
      return res.status(404).json({
        error: {
          code: 'character_not_found',
          message: 'Character not found'
        }
      });
    }
    
    res.json(character);
  } catch (error: any) {
    console.error('Get character error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while retrieving character'
      }
    });
  }
};

/**
 * Update a character
 * @route PUT /api/projects/:projectId/characters/:id
 * @access Private
 */
export const updateCharacter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid character ID'
        }
      });
    }
    
    // Find character
    const character = await Character.findById(id);
    
    if (!character) {
      return res.status(404).json({
        error: {
          code: 'character_not_found',
          message: 'Character not found'
        }
      });
    }
    
    // Update fields
    const {
      name,
      shortDescription,
      detailedBackground,
      role,
      attributes,
      relationships,
      plotInvolvement,
      imageUrl,
      notes
    } = req.body;
    
    if (name) character.name = name;
    if (shortDescription) character.shortDescription = shortDescription;
    if (detailedBackground !== undefined) character.detailedBackground = detailedBackground;
    if (role) character.role = role;
    if (attributes) {
      // Update nested attributes
      if (attributes.physical) {
        character.attributes.physical = {
          ...character.attributes.physical,
          ...attributes.physical
        };
      }
      if (attributes.personality) {
        character.attributes.personality = {
          ...character.attributes.personality,
          ...attributes.personality
        };
      }
      if (attributes.background) {
        character.attributes.background = {
          ...character.attributes.background,
          ...attributes.background
        };
      }
      if (attributes.motivation !== undefined) character.attributes.motivation = attributes.motivation;
      if (attributes.arc !== undefined) character.attributes.arc = attributes.arc;
    }
    if (relationships) character.relationships = relationships;
    if (plotInvolvement) character.plotInvolvement = plotInvolvement;
    if (imageUrl !== undefined) character.imageUrl = imageUrl;
    if (notes !== undefined) character.notes = notes;
    
    // Save updated character
    const updatedCharacter = await character.save();
    
    res.json(updatedCharacter);
  } catch (error: any) {
    console.error('Update character error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while updating character'
      }
    });
  }
};

/**
 * Delete a character
 * @route DELETE /api/projects/:projectId/characters/:id
 * @access Private
 */
export const deleteCharacter = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid character ID'
        }
      });
    }
    
    // Find character
    const character = await Character.findById(id);
    
    if (!character) {
      return res.status(404).json({
        error: {
          code: 'character_not_found',
          message: 'Character not found'
        }
      });
    }
    
    // Delete character
    await character.deleteOne();
    
    res.json({ message: 'Character removed' });
  } catch (error: any) {
    console.error('Delete character error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while deleting character'
      }
    });
  }
};

/**
 * Get character relationships
 * @route GET /api/projects/:projectId/characters/:id/relationships
 * @access Private
 */
export const getCharacterRelationships = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid character ID'
        }
      });
    }
    
    // Find character
    const character = await Character.findById(id).select('relationships');
    
    if (!character) {
      return res.status(404).json({
        error: {
          code: 'character_not_found',
          message: 'Character not found'
        }
      });
    }
    
    // Get related characters
    const relatedCharacters = await Promise.all(
      character.relationships.map(async (rel) => {
        const relatedChar = await Character.findById(rel.characterId).select('name shortDescription');
        return {
          relationship: rel,
          character: relatedChar
        };
      })
    );
    
    res.json(relatedCharacters);
  } catch (error: any) {
    console.error('Get character relationships error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while retrieving character relationships'
      }
    });
  }
};

/**
 * Update character relationships
 * @route PUT /api/projects/:projectId/characters/:id/relationships
 * @access Private
 */
export const updateCharacterRelationships = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { relationships } = req.body;
    
    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        error: {
          code: 'invalid_id',
          message: 'Invalid character ID'
        }
      });
    }
    
    // Validate relationships
    if (!relationships || !Array.isArray(relationships)) {
      return res.status(400).json({
        error: {
          code: 'invalid_relationships',
          message: 'Relationships must be an array'
        }
      });
    }
    
    // Find character
    const character = await Character.findById(id);
    
    if (!character) {
      return res.status(404).json({
        error: {
          code: 'character_not_found',
          message: 'Character not found'
        }
      });
    }
    
    // Update relationships
    character.relationships = relationships;
    
    // Save updated character
    await character.save();
    
    res.json(character.relationships);
  } catch (error: any) {
    console.error('Update character relationships error:', error);
    res.status(500).json({
      error: {
        code: 'server_error',
        message: error.message || 'Server error while updating character relationships'
      }
    });
  }
}; 