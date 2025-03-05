/**
 * Export Router
 * 
 * This router handles export-related operations, including
 * creating, retrieving, and downloading exports.
 */

import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { 
  createExportSchema,
  projectIdSchema,
  exportIdSchema
} from '../schemas/export.schema';
import Export, { IExport } from '../models/export.model';
import Project from '../models/project.model';
import Chapter from '../models/chapter.model';
import { ObjectId } from 'mongodb';
import { Document } from 'mongoose';

// Helper function to check if user has access to a project
const checkProjectAccess = async (userId: string, projectId: string) => {
  const project = await Project.findOne({
    _id: new ObjectId(projectId),
    $or: [
      { userId: new ObjectId(userId) },
      { collaborators: { $in: [new ObjectId(userId)] } }
    ]
  });

  if (!project) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have access to this project'
    });
  }

  return project;
};

// Helper function to convert export document to response format
const formatExportResponse = (exportDoc: IExport & Document) => {
  // Use type assertion to handle the _id property
  const docWithId = exportDoc as unknown as { _id: { toString(): string } };

  // Handle the includeChapters array type conversion
  const includeChapters: string[] = [];
  if (Array.isArray(exportDoc.configuration.includeChapters)) {
    for (const id of exportDoc.configuration.includeChapters) {
      if (id && typeof id.toString === 'function') {
        includeChapters.push(id.toString());
      }
    }
  }

  return {
    id: docWithId._id.toString(),
    projectId: exportDoc.projectId.toString(),
    userId: exportDoc.userId.toString(),
    format: exportDoc.format,
    name: exportDoc.name,
    description: exportDoc.description,
    status: exportDoc.status,
    configuration: {
      includeChapters,
      includeTitlePage: exportDoc.configuration.includeTitlePage,
      includeTableOfContents: exportDoc.configuration.includeTableOfContents,
      includeCharacterList: exportDoc.configuration.includeCharacterList,
      includeSettingDescriptions: exportDoc.configuration.includeSettingDescriptions,
      customCss: exportDoc.configuration.customCss,
      templateId: exportDoc.configuration.templateId?.toString(),
      pageSize: exportDoc.configuration.pageSize,
      fontFamily: exportDoc.configuration.fontFamily,
      fontSize: exportDoc.configuration.fontSize
    },
    fileUrl: exportDoc.fileUrl,
    errorMessage: exportDoc.errorMessage,
    completedAt: exportDoc.completedAt,
    fileSize: exportDoc.fileSize,
    downloadCount: exportDoc.downloadCount,
    createdAt: exportDoc.createdAt,
    updatedAt: exportDoc.updatedAt
  };
};

export const exportRouter = router({
  // Get all exports for a project
  getExports: protectedProcedure
    .input(projectIdSchema)
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        
        // Check project access
        await checkProjectAccess(userId, input.projectId);
        
        // Get exports
        const exports = await Export.find({ 
          projectId: new ObjectId(input.projectId) 
        }).sort({ createdAt: -1 });
        
        return exports.map(formatExportResponse);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Error getting exports:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    }),
  
  // Create a new export
  createExport: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      export: createExportSchema
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        
        // Check project access
        await checkProjectAccess(userId, input.projectId);
        
        // If no specific chapters are selected, get all project chapters
        let chapters = input.export.configuration?.includeChapters || [];
        if (!chapters.length) {
          const allChapters = await Chapter.find({ 
            projectId: new ObjectId(input.projectId) 
          }).sort({ order: 1 });
          
          // Cast the chapter._id to the correct type to fix the linter error
          chapters = allChapters.map(chapter => {
            // Handle the _id value with proper type casting
            const chapterId = chapter._id as unknown;
            if (chapterId && typeof (chapterId as any).toString === 'function') {
              return (chapterId as any).toString();
            }
            return '';
          }).filter(id => id !== ''); // Remove any empty strings
        }
        
        // Create export
        const exportDoc = await Export.create({
          projectId: new ObjectId(input.projectId),
          userId: new ObjectId(userId),
          format: input.export.format,
          name: input.export.name,
          description: input.export.description || '',
          status: 'Pending',
          configuration: {
            includeChapters: chapters,
            includeTitlePage: input.export.configuration?.includeTitlePage !== false,
            includeTableOfContents: input.export.configuration?.includeTableOfContents !== false,
            includeCharacterList: input.export.configuration?.includeCharacterList || false,
            includeSettingDescriptions: input.export.configuration?.includeSettingDescriptions || false,
            customCss: input.export.configuration?.customCss || '',
            templateId: input.export.configuration?.templateId,
            pageSize: input.export.configuration?.pageSize || 'A4',
            fontFamily: input.export.configuration?.fontFamily || 'Times New Roman',
            fontSize: input.export.configuration?.fontSize || 12
          },
          downloadCount: 0
        });
        
        // TODO: Queue export job for processing
        // This would be a background job that generates the export file
        
        // For now, just simulate a completed export for testing
        setTimeout(async () => {
          try {
            await Export.findByIdAndUpdate(
              exportDoc._id,
              {
                status: 'Completed',
                fileUrl: `https://placeholder.url/${exportDoc._id}.${input.export.format}`,
                completedAt: new Date(),
                fileSize: Math.floor(Math.random() * 10000000) // Random file size for testing
              }
            );
            console.log(`Export ${exportDoc._id} marked as completed (simulated)`);
          } catch (err) {
            console.error('Error updating export status:', err);
          }
        }, 5000); // Simulate 5 second processing time
        
        return formatExportResponse(exportDoc);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Error creating export:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    }),
  
  // Get export by ID
  getExportById: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      id: z.string()
    }))
    .query(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        
        // Check project access
        await checkProjectAccess(userId, input.projectId);
        
        // Get export
        const exportDoc = await Export.findOne({
          _id: new ObjectId(input.id),
          projectId: new ObjectId(input.projectId)
        });
        
        if (!exportDoc) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Export not found'
          });
        }
        
        return formatExportResponse(exportDoc);
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Error getting export:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    }),
  
  // Download export
  downloadExport: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        
        // Check project access
        await checkProjectAccess(userId, input.projectId);
        
        // Get export
        const exportDoc = await Export.findOne({
          _id: new ObjectId(input.id),
          projectId: new ObjectId(input.projectId)
        });
        
        if (!exportDoc) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Export not found'
          });
        }
        
        // Check if export is completed
        if (exportDoc.status !== 'Completed') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: `Export is not ready for download. Current status: ${exportDoc.status}`
          });
        }
        
        // Check if file URL exists
        if (!exportDoc.fileUrl) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Export file is not available'
          });
        }
        
        // Update download count
        await Export.findByIdAndUpdate(
          input.id,
          { $inc: { downloadCount: 1 } }
        );
        
        return {
          message: 'Download initiated',
          fileUrl: exportDoc.fileUrl
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Error downloading export:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    }),
  
  // Delete export
  deleteExport: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      id: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      try {
        const userId = ctx.user.id;
        
        // Check project access
        await checkProjectAccess(userId, input.projectId);
        
        // Get export
        const exportDoc = await Export.findOne({
          _id: new ObjectId(input.id),
          projectId: new ObjectId(input.projectId)
        });
        
        if (!exportDoc) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Export not found'
          });
        }
        
        // Delete export
        await Export.deleteOne({ _id: new ObjectId(input.id) });
        
        return {
          message: 'Export deleted successfully'
        };
      } catch (error) {
        if (error instanceof TRPCError) {
          throw error;
        }
        
        console.error('Error deleting export:', error);
        
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error occurred',
          cause: error
        });
      }
    })
}); 