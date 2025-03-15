/**
 * Object Router
 * 
 * This file contains the tRPC router for object-related operations.
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import ObjectModel from '../models/object.model';
import { 
  createObjectSchema, 
  updateObjectSchema, 
  objectSchema, 
  objectListSchema,
  timelineEventSchema,
  connectionSchema,
  connectionTypeEnum
} from '../schemas/object.schema';
import { ObjectType, PhysicalProperties, MagicalProperties, ObjectProperties, ConnectionType } from '../types/object.types';

// Helper function to transform MongoDB document to match the schema
const objectToResponse = (object: any) => {
  return {
    id: object._id.toString(),
    projectId: object.projectId.toString(),
    name: object.name,
    description: object.description,
    type: object.type as ObjectType,
    significance: object.significance || '',
    culturalSignificance: object.culturalSignificance || '',
    properties: {
      physical: {
        size: object.properties?.physical?.size || '',
        material: object.properties?.physical?.material || '',
        appearance: object.properties?.physical?.appearance || ''
      },
      magical: object.properties?.magical ? {
        powers: object.properties.magical.powers || [],
        limitations: object.properties.magical.limitations || [],
        origin: object.properties.magical.origin || '',
        energySource: object.properties.magical.energySource || '',
        activationMethod: object.properties.magical.activationMethod || '',
        sideEffects: object.properties.magical.sideEffects || [],
        rarity: object.properties.magical.rarity || ''
      } : undefined
    },
    history: object.history || '',
    timelineEvents: object.timelineEvents?.map((event: any) => ({
      date: event.date,
      title: event.title,
      description: event.description,
      importance: event.importance
    })) || [],
    location: object.location ? object.location.toString() : undefined,
    owner: object.owner ? object.owner.toString() : undefined,
    connections: object.connections?.map((connection: any) => ({
      type: connection.type as ConnectionType,
      entityId: connection.entityId.toString(),
      description: connection.description || ''
    })) || [],
    imageUrl: object.imageUrl,
    notes: object.notes,
    createdAt: object.createdAt instanceof Date ? object.createdAt.toISOString() : object.createdAt,
    updatedAt: object.updatedAt instanceof Date ? object.updatedAt.toISOString() : object.updatedAt
  };
};

export const objectRouter = router({
  /**
   * Get all objects for a project
   */
  getAll: protectedProcedure
    .input(z.object({
      projectId: z.string()
    }))
    .output(objectListSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { projectId } = input;
        const userId = ctx.user.id;

        // Fetch all objects for the project
        const objects = await ObjectModel.find({ projectId })
          .sort({ name: 1 })
          .lean();

        // Transform MongoDB documents to match the schema
        return objects.map(object => objectToResponse(object));
      } catch (error) {
        console.error('Error fetching objects:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch objects',
        });
      }
    }),

  /**
   * Get a single object by ID
   */
  getById: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      objectId: z.string()
    }))
    .output(objectSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { projectId, objectId } = input;
        const userId = ctx.user.id;

        // Find the object
        const object = await ObjectModel.findOne({
          _id: objectId,
          projectId
        }).lean();

        if (!object) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Object not found',
          });
        }

        // Transform MongoDB document to match the schema
        return objectToResponse(object);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error fetching object:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch object',
        });
      }
    }),

  /**
   * Create a new object
   */
  create: protectedProcedure
    .input(createObjectSchema)
    .output(objectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const userId = ctx.user.id;

        // Create the new object
        const newObject = await ObjectModel.create(input);

        // Transform MongoDB document to match the schema
        return objectToResponse(newObject);
      } catch (error) {
        console.error('Error creating object:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create object',
        });
      }
    }),

  /**
   * Update an existing object
   */
  update: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      objectId: z.string(),
      data: updateObjectSchema
    }))
    .output(objectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { projectId, objectId, data } = input;
        const userId = ctx.user.id;

        // Find and update the object
        const updatedObject = await ObjectModel.findOneAndUpdate(
          { _id: objectId, projectId },
          { $set: data },
          { new: true, runValidators: true }
        ).lean();

        if (!updatedObject) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Object not found',
          });
        }

        // Transform MongoDB document to match the schema
        return objectToResponse(updatedObject);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error updating object:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update object',
        });
      }
    }),

  /**
   * Delete an object
   */
  delete: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      objectId: z.string()
    }))
    .output(z.object({
      success: z.boolean(),
      id: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { projectId, objectId } = input;
        const userId = ctx.user.id;

        // Find and delete the object
        const deletedObject = await ObjectModel.findOneAndDelete({
          _id: objectId,
          projectId
        });

        if (!deletedObject) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Object not found',
          });
        }

        return {
          success: true,
          id: objectId
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error deleting object:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete object',
        });
      }
    }),

  /**
   * Get objects by owner (character)
   */
  getByOwner: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      ownerId: z.string()
    }))
    .output(objectListSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { projectId, ownerId } = input;
        const userId = ctx.user.id;

        // Fetch all objects owned by the character
        const objects = await ObjectModel.find({
          projectId,
          owner: ownerId
        })
          .sort({ name: 1 })
          .lean();

        // Transform MongoDB documents to match the schema
        return objects.map(object => objectToResponse(object));
      } catch (error) {
        console.error('Error fetching objects by owner:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch objects by owner',
        });
      }
    }),

  /**
   * Get objects by location (setting)
   */
  getByLocation: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      locationId: z.string()
    }))
    .output(objectListSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { projectId, locationId } = input;
        const userId = ctx.user.id;

        // Fetch all objects at the location
        const objects = await ObjectModel.find({
          projectId,
          location: locationId
        })
          .sort({ name: 1 })
          .lean();

        // Transform MongoDB documents to match the schema
        return objects.map(object => objectToResponse(object));
      } catch (error) {
        console.error('Error fetching objects by location:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch objects by location',
        });
      }
    }),

  /**
   * Search objects
   */
  search: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      query: z.string()
    }))
    .output(objectListSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { projectId, query } = input;
        const userId = ctx.user.id;

        // Search objects using text index
        const objects = await ObjectModel.find({
          projectId,
          $text: { $search: query }
        })
          .sort({ score: { $meta: 'textScore' } })
          .lean();

        // Transform MongoDB documents to match the schema
        return objects.map(object => objectToResponse(object));
      } catch (error) {
        console.error('Error searching objects:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to search objects',
        });
      }
    }),

  /**
   * Add a timeline event to an object
   */
  addTimelineEvent: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      objectId: z.string(),
      event: timelineEventSchema
    }))
    .output(objectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { projectId, objectId, event } = input;
        const userId = ctx.user.id;

        // Find and update the object
        const updatedObject = await ObjectModel.findOneAndUpdate(
          { _id: objectId, projectId },
          { $push: { timelineEvents: event } },
          { new: true, runValidators: true }
        ).lean();

        if (!updatedObject) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Object not found',
          });
        }

        // Transform MongoDB document to match the schema
        return objectToResponse(updatedObject);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error adding timeline event:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add timeline event',
        });
      }
    }),

  /**
   * Remove a timeline event from an object
   */
  removeTimelineEvent: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      objectId: z.string(),
      eventIndex: z.number()
    }))
    .output(objectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { projectId, objectId, eventIndex } = input;
        const userId = ctx.user.id;

        // First get the object to verify the event exists
        const object = await ObjectModel.findOne({ _id: objectId, projectId }).lean();
        
        if (!object) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Object not found',
          });
        }

        if (!object.timelineEvents || eventIndex >= object.timelineEvents.length) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Timeline event not found',
          });
        }

        // Create a new timelineEvents array without the specified event
        const updatedTimelineEvents = [...object.timelineEvents];
        updatedTimelineEvents.splice(eventIndex, 1);

        // Update the object
        const updatedObject = await ObjectModel.findOneAndUpdate(
          { _id: objectId, projectId },
          { $set: { timelineEvents: updatedTimelineEvents } },
          { new: true, runValidators: true }
        ).lean();

        if (!updatedObject) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to remove timeline event',
          });
        }

        // Transform MongoDB document to match the schema
        return objectToResponse(updatedObject);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error removing timeline event:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove timeline event',
        });
      }
    }),

  /**
   * Add a connection to an object
   */
  addConnection: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      objectId: z.string(),
      connection: connectionSchema
    }))
    .output(objectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { projectId, objectId, connection } = input;
        const userId = ctx.user.id;

        // Find and update the object
        const updatedObject = await ObjectModel.findOneAndUpdate(
          { _id: objectId, projectId },
          { $push: { connections: connection } },
          { new: true, runValidators: true }
        ).lean();

        if (!updatedObject) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Object not found',
          });
        }

        // Transform MongoDB document to match the schema
        return objectToResponse(updatedObject);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error adding connection:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add connection',
        });
      }
    }),

  /**
   * Remove a connection from an object
   */
  removeConnection: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      objectId: z.string(),
      connectionId: z.string()
    }))
    .output(objectSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { projectId, objectId, connectionId } = input;
        const userId = ctx.user.id;

        // Find and update the object
        const updatedObject = await ObjectModel.findOneAndUpdate(
          { _id: objectId, projectId },
          { $pull: { connections: { _id: connectionId } } },
          { new: true, runValidators: true }
        ).lean();

        if (!updatedObject) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Object not found',
          });
        }

        // Transform MongoDB document to match the schema
        return objectToResponse(updatedObject);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Error removing connection:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove connection',
        });
      }
    }),

  /**
   * Get objects by connection type
   */
  getByConnectionType: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      connectionType: connectionTypeEnum
    }))
    .output(objectListSchema)
    .query(async ({ input, ctx }) => {
      try {
        const { projectId, connectionType } = input;
        const userId = ctx.user.id;

        // Fetch all objects with the specified connection type
        const objects = await ObjectModel.find({
          projectId,
          'connections.type': connectionType
        })
          .sort({ name: 1 })
          .lean();

        // Transform MongoDB documents to match the schema
        return objects.map(object => objectToResponse(object));
      } catch (error) {
        console.error('Error fetching objects by connection type:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch objects by connection type',
        });
      }
    })
}); 