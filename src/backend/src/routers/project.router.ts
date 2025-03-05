/**
 * Project Router
 * 
 * This file contains all tRPC procedures related to project management.
 */

import ProjectModel, { IProject } from '../models/project.model';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { 
  createProjectSchema, 
  updateProjectSchema,
  projectSchema,
  projectListSchema,
  addCollaboratorSchema,
  collaboratorListSchema
} from '../schemas/project.schema';
import { ObjectId } from 'mongodb';

export const projectRouter = router({
  /**
   * Create a new project
   */
  create: protectedProcedure
    .input(createProjectSchema)
    .output(projectSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        
        const project = new ProjectModel({
          ...input,
          userId: new ObjectId(userId),
          status: 'Draft',
          collaborators: []
        });
        
        await project.save();
        
        return projectToResponse(project);
      } catch (error) {
        console.error('Project creation error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create project',
        });
      }
    }),

  /**
   * Get all projects for the current user
   */
  getAll: protectedProcedure
    .output(projectListSchema)
    .query(async ({ ctx }) => {
      try {
        const userId = ctx.user.id;
        
        // Find projects where user is owner or collaborator
        const projects = await ProjectModel.find({
          $or: [
            { userId: new ObjectId(userId) },
            { 'collaborators.userId': new ObjectId(userId) }
          ]
        }).sort({ updatedAt: -1 });
        
        return projects.map(projectToResponse);
      } catch (error) {
        console.error('Get all projects error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve projects',
        });
      }
    }),

  /**
   * Get a project by ID
   */
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(projectSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { id } = input;
        
        const project = await ProjectModel.findById(new ObjectId(id));
        
        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }
        
        // Check if user is owner or collaborator
        const isOwner = project.userId.toString() === userId;
        const isCollaborator = project.collaborators.some(
          c => c.userId.toString() === userId
        );
        
        if (!isOwner && !isCollaborator) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to view this project',
          });
        }
        
        return projectToResponse(project);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Get project by ID error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve project',
        });
      }
    }),

  /**
   * Update a project
   */
  update: protectedProcedure
    .input(z.object({
      id: z.string(),
      data: updateProjectSchema
    }))
    .output(projectSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { id, data } = input;
        
        const project = await ProjectModel.findById(new ObjectId(id));
        
        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }
        
        // Only owner or editor can update project
        const isOwner = project.userId.toString() === userId;
        const isEditor = project.collaborators.some(
          c => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this project',
          });
        }
        
        // Update project fields
        Object.assign(project, data);
        await project.save();
        
        return projectToResponse(project);
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        
        console.error('Update project error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update project',
        });
      }
    }),

  /**
   * Delete a project
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { id } = input;
        
        const project = await ProjectModel.findById(id);
        
        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }
        
        // Only owner can delete project
        if (project.userId.toString() !== userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this project',
          });
        }
        
        await ProjectModel.findByIdAndDelete(id);
        
        // TODO: Delete related data (characters, settings, plots, chapters)
        
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Delete project error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete project',
        });
      }
    }),

  /**
   * Add a collaborator to a project
   */
  addCollaborator: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      collaborator: addCollaboratorSchema
    }))
    .output(collaboratorListSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, collaborator } = input;
        
        const project = await ProjectModel.findById(projectId);
        
        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }
        
        // Only owner can add collaborators
        if (project.userId.toString() !== userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to add collaborators',
          });
        }
        
        // Check if user is already a collaborator
        const existingCollaborator = project.collaborators.find(
          (c: any) => c.userId.toString() === collaborator.userId
        );
        
        if (existingCollaborator) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User is already a collaborator',
          });
        }
        
        // Add new collaborator
        project.collaborators.push({
          userId: new ObjectId(collaborator.userId),
          role: collaborator.role
        });
        
        await project.save();
        
        return project.collaborators.map((c: any) => ({
          userId: c.userId.toString(),
          role: c.role
        }));
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Add collaborator error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add collaborator',
        });
      }
    }),

  /**
   * Remove a collaborator from a project
   */
  removeCollaborator: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      collaboratorId: z.string()
    }))
    .output(collaboratorListSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, collaboratorId } = input;
        
        const project = await ProjectModel.findById(projectId);
        
        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }
        
        // Only owner can remove collaborators
        if (project.userId.toString() !== userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to remove collaborators',
          });
        }
        
        // Check if user is a collaborator
        const collaboratorIndex = project.collaborators.findIndex(
          (c: any) => c.userId.toString() === collaboratorId
        );
        
        if (collaboratorIndex === -1) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User is not a collaborator',
          });
        }
        
        // Remove collaborator
        project.collaborators.splice(collaboratorIndex, 1);
        
        await project.save();
        
        return project.collaborators.map((c: any) => ({
          userId: c.userId.toString(),
          role: c.role
        }));
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Remove collaborator error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to remove collaborator',
        });
      }
    }),

  /**
   * Update a collaborator's role on a project
   */
  updateCollaboratorRole: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      collaboratorId: z.string(),
      role: z.enum(['Editor', 'Viewer', 'Contributor'])
    }))
    .output(collaboratorListSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, collaboratorId, role } = input;
        
        const project = await ProjectModel.findById(projectId);
        
        if (!project) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
          });
        }
        
        // Only owner can update collaborator roles
        if (project.userId.toString() !== userId) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update collaborator roles',
          });
        }
        
        // Find collaborator
        const collaborator = project.collaborators.find(
          (c: any) => c.userId.toString() === collaboratorId
        );
        
        if (!collaborator) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'User is not a collaborator',
          });
        }
        
        // Update role
        collaborator.role = role;
        
        await project.save();
        
        return project.collaborators.map((c: any) => ({
          userId: c.userId.toString(),
          role: c.role
        }));
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Update collaborator role error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update collaborator role',
        });
      }
    })
});

/**
 * Helper function to convert project document to response object
 */
const projectToResponse = (project: IProject) => {
  const id = project._id ? project._id.toString() : '';
  
  return {
    id,
    userId: project.userId.toString(),
    title: project.title,
    description: project.description || '',
    genre: project.genre,
    targetAudience: project.targetAudience,
    narrativeType: project.narrativeType,
    tone: project.tone,
    style: project.style,
    targetLength: project.targetLength,
    status: project.status,
    completionDate: project.completionDate,
    isPublic: project.isPublic || false,
    collaborators: project.collaborators.map(c => ({
      userId: c.userId.toString(),
      role: c.role
    })),
    metadata: project.metadata ? {
      createdWithTemplate: project.metadata.createdWithTemplate,
      templateId: project.metadata.templateId ? project.metadata.templateId.toString() : undefined,
      tags: project.metadata.tags || []
    } : {
      createdWithTemplate: false,
      tags: []
    },
    createdAt: project.createdAt,
    updatedAt: project.updatedAt
  };
}; 