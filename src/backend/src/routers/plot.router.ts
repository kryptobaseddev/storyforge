/**
 * Plot Router
 * 
 * This file contains all tRPC procedures related to plot management.
 */

import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { router, protectedProcedure } from '../trpc';
import { 
  createPlotSchema, 
  updatePlotSchema,
  plotSchema,
  plotListSchema,
  createPlotElementSchema,
  updatePlotElementSchema
} from '../schemas/plot.schema';
import Plot, { IPlot } from '../models/plot.model';
import ProjectModel from '../models/project.model';
import { ObjectId } from 'mongodb';
import { PlotElementType, PlotType, StructureType, PlotStatusType } from '../types/plot.types';
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
 * Helper function to convert plot document to response object
 */
const plotToResponse = (plot: IPlot) => {
  const id = plot._id ? plot._id.toString() : '';
  
  return {
    id,
    projectId: plot.projectId.toString(),
    title: plot.title,
    description: plot.description,
    type: plot.type as PlotType,
    structure: plot.structure as StructureType,
    importance: plot.importance,
    status: plot.status as PlotStatusType,
    elements: plot.elements.map(element => ({
      id: element._id?.toString() || '',
      type: element.type as PlotElementType,
      description: element.description,
      characters: element.characters?.map(id => id.toString()) || [],
      settings: element.settings?.map(id => id.toString()) || [],
      objects: element.objects?.map(id => id.toString()) || [],
      order: element.order
    })),
    relatedPlots: plot.relatedPlots?.map(id => id.toString()) || [],
    notes: plot.notes,
    createdAt: plot.createdAt,
    updatedAt: plot.updatedAt
  };
};

export const plotRouter = router({
  /**
   * Get all plots for a project
   */
  getAll: protectedProcedure
    .input(z.object({
      projectId: z.string()
    }))
    .output(plotListSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId } = input;
        
        // Check if user has access to the project
        await checkProjectAccess(projectId, userId);
        
        // Get all plots for the project
        const plots = await Plot.find({ projectId }).sort({ title: 1 });
        
        return plots.map(plotToResponse);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Get all plots error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve plots',
        });
      }
    }),

  /**
   * Get a plot by ID
   */
  getById: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      plotId: z.string()
    }))
    .output(plotSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, plotId } = input;
        
        // Check if user has access to the project
        await checkProjectAccess(projectId, userId);
        
        // Get plot
        const plot = await Plot.findOne({
          _id: plotId,
          projectId
        }).populate('elements.characters', 'name')
          .populate('elements.settings', 'name')
          .populate('elements.objects', 'name');
        
        if (!plot) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plot not found',
          });
        }
        
        return plotToResponse(plot);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Get plot by ID error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to retrieve plot',
        });
      }
    }),

  /**
   * Create a new plot
   */
  create: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      plot: createPlotSchema
    }))
    .output(plotSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, plot } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to create (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to create plots for this project',
          });
        }
        
        // Create new plot
        const newPlot = await Plot.create({
          ...plot,
          projectId: new ObjectId(projectId),
          elements: plot.elements || []
        });
        
        return plotToResponse(newPlot);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Create plot error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create plot',
        });
      }
    }),

  /**
   * Update a plot
   */
  update: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      plotId: z.string(),
      data: updatePlotSchema
    }))
    .output(plotSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, plotId, data } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this plot',
          });
        }
        
        // Get and update plot
        const plot = await Plot.findOne({
          _id: plotId,
          projectId
        });
        
        if (!plot) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plot not found',
          });
        }
        
        // Update plot fields
        if (data.title) plot.title = data.title;
        if (data.description) plot.description = data.description;
        if (data.structure) plot.structure = data.structure;
        if (data.type) plot.type = data.type;
        if (data.importance !== undefined) plot.importance = data.importance;
        if (data.status) plot.status = data.status;
        if (data.notes !== undefined) plot.notes = data.notes;
        
        // Handle elements update if provided - make sure to convert string IDs to ObjectId
        if (data.elements) {
          // Map each element to have the proper ObjectId types
          plot.elements = data.elements.map(element => ({
            type: element.type,
            description: element.description,
            order: element.order,
            characters: element.characters ? element.characters.map(id => new ObjectId(id)) : [],
            settings: element.settings ? element.settings.map(id => new ObjectId(id)) : [],
            objects: element.objects ? element.objects.map(id => new ObjectId(id)) : []
          }));
        }
        
        // Handle related plots if provided - convert string IDs to ObjectId
        if (data.relatedPlots) {
          plot.relatedPlots = data.relatedPlots.map(id => new ObjectId(id));
        }
        
        await plot.save();
        
        return plotToResponse(plot);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Update plot error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update plot',
        });
      }
    }),

  /**
   * Delete a plot
   */
  delete: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      plotId: z.string()
    }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, plotId } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to delete (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this plot',
          });
        }
        
        // Delete plot
        const result = await Plot.deleteOne({
          _id: plotId,
          projectId
        });
        
        if (result.deletedCount === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plot not found',
          });
        }
        
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Delete plot error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete plot',
        });
      }
    }),

  /**
   * Add a plot point to a plot
   */
  addPlotPoint: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      plotId: z.string(),
      plotElement: createPlotElementSchema
    }))
    .output(plotSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, plotId, plotElement } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this plot',
          });
        }
        
        // Get plot
        const plot = await Plot.findOne({
          _id: plotId,
          projectId
        });
        
        if (!plot) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plot not found',
          });
        }
        
        // Convert string IDs to ObjectId
        const characters = plotElement.characters ? 
          plotElement.characters.map(id => new ObjectId(id)) : [];
        
        const settings = plotElement.settings ? 
          plotElement.settings.map(id => new ObjectId(id)) : [];
        
        const objects = plotElement.objects ? 
          plotElement.objects.map(id => new ObjectId(id)) : [];
        
        // Add new plot element
        plot.elements.push({
          type: plotElement.type,
          description: plotElement.description,
          characters,
          settings,
          objects,
          order: plotElement.order
        });
        
        // Sort plot elements by order
        plot.elements.sort((a, b) => a.order - b.order);
        
        await plot.save();
        
        return plotToResponse(plot);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Add plot element error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to add plot element',
        });
      }
    }),

  /**
   * Update a plot point
   */
  updatePlotPoint: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      plotId: z.string(),
      elementId: z.string(),
      data: updatePlotElementSchema
    }))
    .output(plotSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, plotId, elementId, data } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to update this plot point',
          });
        }
        
        // Get plot
        const plot = await Plot.findOne({
          _id: plotId,
          projectId
        });
        
        if (!plot) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plot not found',
          });
        }
        
        // Find plot element index
        const elementIndex = plot.elements.findIndex(element => 
          element._id?.toString() === elementId
        );
        
        if (elementIndex === -1) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plot element not found',
          });
        }
        
        // Update plot element fields
        if (data.description) plot.elements[elementIndex].description = data.description;
        if (data.order !== undefined) plot.elements[elementIndex].order = data.order;
        if (data.type) plot.elements[elementIndex].type = data.type;
        
        if (data.characters) {
          plot.elements[elementIndex].characters = data.characters.map(id => new ObjectId(id));
        }
        
        if (data.settings) {
          plot.elements[elementIndex].settings = data.settings.map(id => new ObjectId(id));
        }
        
        if (data.objects) {
          plot.elements[elementIndex].objects = data.objects.map(id => new ObjectId(id));
        }
        
        // Sort plot elements by order
        plot.elements.sort((a, b) => a.order - b.order);
        
        await plot.save();
        
        return plotToResponse(plot);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Update plot element error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update plot element',
        });
      }
    }),

  /**
   * Delete a plot point
   */
  deletePlotPoint: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      plotId: z.string(),
      elementId: z.string()
    }))
    .output(plotSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        const { projectId, plotId, elementId } = input;
        
        // Check if user has access to the project
        const { project, isOwner } = await checkProjectAccess(projectId, userId);
        
        // Check if user has permission to edit (owner or editor)
        const isEditor = project.collaborators.some(
          (c: any) => c.userId.toString() === userId && c.role === 'Editor'
        );
        
        if (!isOwner && !isEditor) {
          throw new TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to delete this plot point',
          });
        }
        
        // Get plot
        const plot = await Plot.findOne({
          _id: plotId,
          projectId
        });
        
        if (!plot) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plot not found',
          });
        }
        
        // Find plot element index
        const elementIndex = plot.elements.findIndex(element => 
          element._id?.toString() === elementId
        );
        
        if (elementIndex === -1) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Plot element not found',
          });
        }
        
        // Remove plot element
        plot.elements.splice(elementIndex, 1);
        
        await plot.save();
        
        return plotToResponse(plot);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Delete plot element error:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete plot element',
        });
      }
    })
}); 