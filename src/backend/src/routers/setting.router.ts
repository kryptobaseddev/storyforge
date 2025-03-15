/**
 * Setting Router
 * 
 * This file contains all tRPC procedures related to setting management.
 */

import SettingModel, { ISetting } from '../models/setting.model';
import ProjectModel from '../models/project.model';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { 
  createSettingSchema, 
  updateSettingSchema,
  settingSchema,
  settingListSchema,
  uploadMapSchema
} from '../schemas/setting.schema';
import { ObjectId } from 'mongodb';
import { SETTING_TYPES, SettingType } from '../types/setting.types';
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
 * Helper function to convert setting document to response object
 */
const settingToResponse = (setting: ISetting) => {
  const id = setting._id ? setting._id.toString() : '';
  const projectId = setting.projectId ? setting.projectId.toString() : '';
  
  return {
    id,
    projectId,
    name: setting.name,
    description: setting.description || '',
    // Cast type to the expected union type, assuming the DB value is valid
    type: setting.type as SettingType,
    details: setting.details || {},
    map: setting.map || { imageUrl: '', coordinates: {} },
    relatedSettings: (setting.relatedSettings || []).map((id: any) => id.toString()),
    characters: (setting.characters || []).map((id: any) => id.toString()),
    objects: (setting.objects || []).map((id: any) => id.toString()),
    imageUrl: setting.imageUrl || '',
    notes: setting.notes || '',
    createdAt: setting.createdAt,
    updatedAt: setting.updatedAt
  };
};

export const settingRouter = router({
  /**
   * Create a new setting
   */
  create: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      setting: createSettingSchema
    }))
    .output(settingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, setting } = input;
        
        // Check if user has access to the project
        await checkProjectAccess(projectId, userId);
        
        // Create new setting
        const newSetting = new SettingModel({
          ...setting,
          projectId: new ObjectId(projectId)
        });
        
        await newSetting.save();
        
        return settingToResponse(newSetting);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Create setting error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create setting',
        });
      }
    }),

  /**
   * Get all settings for a project
   */
  getAll: protectedProcedure
    .input(z.object({
      projectId: z.string()
    }))
    .output(settingListSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId } = input;
        
        // Check if user has access to the project
        await checkProjectAccess(projectId, userId);
        
        // Get all settings for the project
        const settings = await SettingModel.find({ projectId });
        
        return settings.map(settingToResponse);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Get all settings error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve settings',
        });
      }
    }),

  /**
   * Get a setting by ID
   */
  getById: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      settingId: z.string()
    }))
    .output(settingSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, settingId } = input;
        
        // Check if user has access to the project
        await checkProjectAccess(projectId, userId);
        
        // Get setting
        const setting = await SettingModel.findOne({
          _id: settingId,
          projectId
        });
        
        if (!setting) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Setting not found',
          });
        }
        
        return settingToResponse(setting);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Get setting by ID error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve setting',
        });
      }
    }),

  /**
   * Update a setting
   */
  update: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      settingId: z.string(),
      data: updateSettingSchema
    }))
    .output(settingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, settingId, data } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this setting',
          });
        }
        
        // Get and update setting
        const setting = await SettingModel.findOne({
          _id: settingId,
          projectId
        });
        
        if (!setting) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Setting not found',
          });
        }
        
        // Update setting fields
        Object.assign(setting, data);
        
        await setting.save();
        
        return settingToResponse(setting);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Update setting error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update setting',
        });
      }
    }),

  /**
   * Delete a setting
   */
  delete: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      settingId: z.string()
    }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, settingId } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to delete (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this setting',
          });
        }
        
        // Delete setting
        const result = await SettingModel.deleteOne({
          _id: settingId,
          projectId
        });
        
        if (result.deletedCount === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Setting not found',
          });
        }
        
        // Also update related settings to remove references
        await SettingModel.updateMany(
          { projectId, relatedSettings: settingId },
          { $pull: { relatedSettings: settingId } }
        );
        
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Delete setting error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete setting',
        });
      }
    }),

  /**
   * Upload map for a setting
   */
  uploadMap: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      settingId: z.string(),
      map: uploadMapSchema
    }))
    .output(settingSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, settingId, map } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this setting',
          });
        }
        
        // Get and update setting
        const setting = await SettingModel.findOne({
          _id: settingId,
          projectId
        });
        
        if (!setting) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Setting not found',
          });
        }
        
        // Ensure map has coordinates property
        const updatedMap = {
          imageUrl: map.imageUrl,
          coordinates: map.coordinates || {}
        };
        
        // Update map
        setting.map = updatedMap;
        
        await setting.save();
        
        return settingToResponse(setting);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Upload map error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to upload map',
        });
      }
    })
}); 