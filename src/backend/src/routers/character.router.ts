/**
 * Character Router
 * 
 * This file contains all tRPC procedures related to character management.
 */

import CharacterModel, { ICharacter } from '../models/character.model';
import ProjectModel from '../models/project.model';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { 
  createCharacterSchema, 
  updateCharacterSchema,
  characterSchema,
  characterListSchema,
  addRelationshipSchema,
  relationshipListSchema
} from '../schemas/character.schema';
import { 
  RELATIONSHIP_TYPES, 
  RELATIONSHIP_FAMILIES, 
  RELATIONSHIP_STATUSES 
} from '../types/character.types';
import { ObjectId } from 'mongodb';
import mongoose from 'mongoose';

/**
 * Helper function to check if user has access to the project
 */
const checkProjectAccess = async (projectId: string, userId: string) => {
  const project = await ProjectModel.findById(projectId);
  
  if (!project) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Project not found',
    });
  }
  
  const isOwner = project.userId.toString() === userId;
  const isCollaborator = project.collaborators.some(
    (c: any) => c.userId.toString() === userId
  );
  
  if (!isOwner && !isCollaborator) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have permission to access this project',
    });
  }
  
  return { project, isOwner };
};

/**
 * Helper function to convert character document to response object
 */
const characterToResponse = (character: ICharacter) => {
  const id = character._id ? character._id.toString() : '';
  const projectId = character.projectId ? character.projectId.toString() : '';
  
  return {
    id,
    projectId,
    name: character.name,
    shortDescription: character.shortDescription || '',
    detailedBackground: character.detailedBackground || '',
    role: character.role || '',
    attributes: character.attributes || {},
    relationships: character.relationships.map((rel: any) => ({
      characterId: rel.characterId.toString(),
      // Ensure relationshipType is one of the valid types, default to 'Other' if not
      relationshipType: RELATIONSHIP_TYPES.includes(rel.relationshipType) 
        ? rel.relationshipType 
        : 'Other',
      relationshipFamily: RELATIONSHIP_FAMILIES.includes(rel.relationshipFamily)
        ? rel.relationshipFamily
        : 'Other',
      relationshipStatus: RELATIONSHIP_STATUSES.includes(rel.relationshipStatus)
        ? rel.relationshipStatus
        : 'Neutral',
      notes: rel.notes || ''
    })),
    plotInvolvement: character.plotInvolvement.map((id: any) => id.toString()),
    imageUrl: character.imageUrl,
    notes: character.notes,
    createdAt: character.createdAt,
    updatedAt: character.updatedAt,
    possessions: character.possessions.map((obj: any) => obj.toString())
  };
};

export const characterRouter = router({
  /**
   * Create a new character
   */
  create: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      character: createCharacterSchema
    }))
    .output(characterSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, character } = input;
        
        // Check if user has access to the project
        await checkProjectAccess(projectId, userId);
        
        // Create new character
        const newCharacter = new CharacterModel({
          ...character,
          projectId: new ObjectId(projectId)
        });
        
        await newCharacter.save();
        
        return characterToResponse(newCharacter);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Create character error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create character',
        });
      }
    }),

  /**
   * Get all characters for a project
   */
  getAll: protectedProcedure
    .input(z.object({
      projectId: z.string()
    }))
    .output(characterListSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId } = input;
        
        // Check if user has access to the project
        await checkProjectAccess(projectId, userId);
        
        // Get all characters for the project
        const characters = await CharacterModel.find({ projectId });
        
        return characters.map(characterToResponse);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Get all characters error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve characters',
        });
      }
    }),

  /**
   * Get a character by ID
   */
  getById: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      characterId: z.string()
    }))
    .output(characterSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, characterId } = input;
        
        // Check if user has access to the project
        await checkProjectAccess(projectId, userId);
        
        // Get character
        const character = await CharacterModel.findOne({
          _id: characterId,
          projectId
        });
        
        if (!character) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Character not found',
          });
        }
        
        return characterToResponse(character);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Get character by ID error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve character',
        });
      }
    }),

  /**
   * Update a character
   */
  update: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      characterId: z.string(),
      data: updateCharacterSchema
    }))
    .output(characterSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, characterId, data } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this character',
          });
        }
        
        // Get and update character
        const character = await CharacterModel.findOne({
          _id: characterId,
          projectId
        });
        
        if (!character) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Character not found',
          });
        }
        
        // Update character fields
        Object.assign(character, data);
        
        await character.save();
        
        return characterToResponse(character);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Update character error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update character',
        });
      }
    }),

  /**
   * Delete a character
   */
  delete: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      characterId: z.string()
    }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, characterId } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to delete (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this character',
          });
        }
        
        // Delete character
        const result = await CharacterModel.deleteOne({
          _id: characterId,
          projectId
        });
        
        if (result.deletedCount === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Character not found',
          });
        }
        
        // Also update relationships in other characters
        await CharacterModel.updateMany(
          { projectId, 'relationships.characterId': characterId },
          { $pull: { relationships: { characterId: characterId } } }
        );
        
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Delete character error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete character',
        });
      }
    }),

  /**
   * Add relationship to a character
   */
  addRelationship: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      characterId: z.string(),
      relationship: addRelationshipSchema
    }))
    .output(relationshipListSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, characterId, relationship } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update character relationships',
          });
        }
        
        // Get character
        const character = await CharacterModel.findOne({
          _id: characterId,
          projectId
        });
        
        if (!character) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Character not found',
          });
        }
        
        // Check if related character exists
        const relatedCharacter = await CharacterModel.findOne({
          _id: relationship.characterId,
          projectId
        });
        
        if (!relatedCharacter) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Related character not found',
          });
        }
        
        // Check if relationship already exists
        const existingRelationship = character.relationships.find(
          (rel: any) => rel.characterId.toString() === relationship.characterId
        );
        
        if (existingRelationship) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Relationship already exists',
          });
        }
        
        // Add relationship
        character.relationships.push({
          characterId: new ObjectId(relationship.characterId),
          relationshipType: relationship.relationshipType,
          relationshipFamily: relationship.relationshipFamily,
          relationshipStatus: relationship.relationshipStatus,
          notes: relationship.notes || ''
        });
        
        await character.save();
        
        return character.relationships.map((rel: any) => ({
          characterId: rel.characterId.toString(),
          relationshipType: rel.relationshipType,
          relationshipFamily: rel.relationshipFamily,
          relationshipStatus: rel.relationshipStatus,
          notes: rel.notes || ''
        }));
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Add relationship error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add relationship',
        });
      }
    }),

  /**
   * Update a relationship
   */
  updateRelationship: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      characterId: z.string(),
      relatedCharacterId: z.string(),
      data: z.object({
        relationshipType: z.enum(RELATIONSHIP_TYPES).optional(),
        relationshipFamily: z.enum(RELATIONSHIP_FAMILIES).optional(),
        relationshipStatus: z.enum(RELATIONSHIP_STATUSES).optional(),
        notes: z.string().optional()
      })
    }))
    .output(relationshipListSchema)
    .mutation(async ({ ctx, input }) => { 
      try {
        const userId = ctx.user.id;
        const { projectId, characterId, relatedCharacterId, data } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update character relationships',
          });
        }
        
        // Get character
        const character = await CharacterModel.findOne({
          _id: characterId,
          projectId
        });
        
        if (!character) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Character not found',
          });
        }
        
        // Find relationship
        const relationshipIndex = character.relationships.findIndex(
          (rel: any) => rel.characterId.toString() === relatedCharacterId
        );
        
        if (relationshipIndex === -1) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Relationship not found',
          });
        }
        
        // Update relationship
        const relationship = character.relationships[relationshipIndex];
        if (data.relationshipType) {
          relationship.relationshipType = data.relationshipType;
        }
        if (data.relationshipFamily) {
          relationship.relationshipFamily = data.relationshipFamily;
        }
        if (data.relationshipStatus) {
          relationship.relationshipStatus = data.relationshipStatus;
        }
        if (data.notes !== undefined) {
          relationship.notes = data.notes;
        }
        
        await character.save();
        
        return character.relationships.map((rel: any) => ({
          characterId: rel.characterId.toString(),
          relationshipType: rel.relationshipType,
          relationshipFamily: rel.relationshipFamily,
          relationshipStatus: rel.relationshipStatus,
          notes: rel.notes || ''
        }));
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Update relationship error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update relationship',
        });
      }
    }),

  /**
   * Remove a relationship
   */
  removeRelationship: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      characterId: z.string(),
      relatedCharacterId: z.string()
    }))
    .output(relationshipListSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, characterId, relatedCharacterId } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update character relationships',
          });
        }
        
        // Get character
        const character = await CharacterModel.findOne({
          _id: characterId,
          projectId
        });
        
        if (!character) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Character not found',
          });
        }
        
        // Find relationship
        const relationshipIndex = character.relationships.findIndex(
          (rel: any) => rel.characterId.toString() === relatedCharacterId
        );
        
        if (relationshipIndex === -1) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Relationship not found',
          });
        }
        
        // Remove relationship
        character.relationships.splice(relationshipIndex, 1);
        
        await character.save();
        
        return character.relationships.map((rel: any) => ({
          characterId: rel.characterId.toString(),
          relationshipType: rel.relationshipType,
          relationshipFamily: rel.relationshipFamily,
          relationshipStatus: rel.relationshipStatus,
          notes: rel.notes || ''
        }));
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Remove relationship error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove relationship',
        });
      }
    }),

  /**
   * Add an object to a character's possessions
   */
  addPossession: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      characterId: z.string(),
      objectId: z.string()
    }))
    .output(characterSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { projectId, characterId, objectId } = input;
        const userId = ctx.user.id;

        // Find the character
        const character = await CharacterModel.findOne({
          _id: characterId,
          projectId
        });

        if (!character) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Character not found',
          });
        }

        // Check if the object exists
        const objectExists = await mongoose.model('Object').findOne({
          _id: objectId,
          projectId
        });

        if (!objectExists) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Object not found',
          });
        }

        // Add the object to the character's possessions if it's not already there
        const objectIdObj = new ObjectId(objectId);
        if (!character.possessions.some(id => id.equals(objectIdObj))) {
          character.possessions.push(objectIdObj);
          await character.save();

          // Update the object's owner
          await mongoose.model('Object').findByIdAndUpdate(objectId, {
            owner: characterId
          });
        }

        // Transform MongoDB document to match the schema
        return characterToResponse(character);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error adding possession:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add possession',
        });
      }
    }),

  /**
   * Remove an object from a character's possessions
   */
  removePossession: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      characterId: z.string(),
      objectId: z.string()
    }))
    .output(characterSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { projectId, characterId, objectId } = input;
        const userId = ctx.user.id;

        // Find the character
        const character = await CharacterModel.findOne({
          _id: characterId,
          projectId
        });

        if (!character) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Character not found',
          });
        }

        // Remove the object from the character's possessions
        const objectIdObj = new ObjectId(objectId);
        character.possessions = character.possessions.filter(
          id => !id.equals(objectIdObj)
        );
        await character.save();

        // Remove the character as the object's owner
        await mongoose.model('Object').findByIdAndUpdate(objectId, {
          $unset: { owner: 1 }
        });

        // Transform MongoDB document to match the schema
        return characterToResponse(character);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error removing possession:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove possession',
        });
      }
    })
}); 