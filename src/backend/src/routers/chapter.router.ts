/**
 * Chapter Router
 * 
 * This router handles chapter-related operations, including
 * CRUD operations, content management, and reordering.
 */

import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { ObjectId } from 'mongodb';
import Chapter from '../models/chapter.model';
import Project from '../models/project.model';
import { 
  chapterSchema,
  chapterListSchema,
  createChapterSchema,
  updateChapterSchema,
  updateChapterContentSchema,
  addChapterEditSchema,
  reorderChaptersSchema
} from '../schemas/chapter.schema';
import { z } from 'zod';

// Helper function to check if a user has access to a project
const checkProjectAccess = async (userId: string, projectId: string) => {
  const project = await Project.findOne({
    _id: new ObjectId(projectId),
    $or: [
      { createdBy: new ObjectId(userId) },
      { collaborators: { $elemMatch: { userId: new ObjectId(userId) } } }
    ]
  });

  if (!project) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'You do not have access to this project',
    });
  }

  return project;
};

// Helper function to format chapter data for response
const formatChapterResponse = (chapter: any) => {
  return {
    id: chapter._id.toString(),
    projectId: chapter.projectId.toString(),
    title: chapter.title,
    position: chapter.position,
    synopsis: chapter.synopsis,
    content: chapter.content,
    status: chapter.status,
    wordCount: chapter.wordCount,
    characters: chapter.characters.map((id: any) => id.toString()),
    settings: chapter.settings.map((id: any) => id.toString()),
    plotlines: chapter.plotlines.map((id: any) => id.toString()),
    objects: chapter.objects.map((id: any) => id.toString()),
    notes: chapter.notes,
    aiGenerated: chapter.aiGenerated,
    edits: chapter.edits.map((edit: any) => ({
      timestamp: edit.timestamp,
      userId: edit.userId.toString(),
      changes: edit.changes
    })),
    createdAt: chapter.createdAt,
    updatedAt: chapter.updatedAt
  };
};

export const chapterRouter = router({
  /**
   * Get all chapters for a project
   */
  getAll: protectedProcedure
    .input(z.object({ projectId: z.string() }))
    .output(chapterListSchema)
    .query(async ({ ctx, input }) => {
      // Check if user has access to the project
      await checkProjectAccess(ctx.user!.id, input.projectId);

      // Get all chapters for the project
      const chapters = await Chapter.find({ 
        projectId: new ObjectId(input.projectId) 
      }).sort({ position: 1 });

      return chapters.map(formatChapterResponse);
    }),

  /**
   * Get chapter by ID
   */
  getById: protectedProcedure
    .input(z.object({ 
      projectId: z.string(),
      chapterId: z.string()
    }))
    .output(chapterSchema)
    .query(async ({ ctx, input }) => {
      // Check if user has access to the project
      await checkProjectAccess(ctx.user!.id, input.projectId);

      // Get the chapter
      const chapter = await Chapter.findOne({
        _id: new ObjectId(input.chapterId),
        projectId: new ObjectId(input.projectId)
      });

      if (!chapter) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chapter not found',
        });
      }

      return formatChapterResponse(chapter);
    }),

  /**
   * Create a new chapter
   */
  create: protectedProcedure
    .input(createChapterSchema)
    .output(chapterSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user has access to the project
      await checkProjectAccess(ctx.user!.id, input.projectId);

      // Determine the next position value if not provided
      if (input.position === undefined) {
        const highestPositionChapter = await Chapter.findOne({
          projectId: new ObjectId(input.projectId)
        }).sort({ position: -1 });
        
        input.position = highestPositionChapter ? highestPositionChapter.position + 1 : 0;
      }

      // Create the chapter
      const chapter = await Chapter.create({
        ...input,
        projectId: new ObjectId(input.projectId),
        characters: input.characters?.map(id => new ObjectId(id)) || [],
        settings: input.settings?.map(id => new ObjectId(id)) || [],
        plotlines: input.plotlines?.map(id => new ObjectId(id)) || [],
        objects: input.objects?.map(id => new ObjectId(id)) || [],
        wordCount: input.content ? input.content.split(/\s+/).filter(word => word.length > 0).length : 0
      });

      return formatChapterResponse(chapter);
    }),

  /**
   * Update a chapter
   */
  update: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      chapterId: z.string(),
      data: updateChapterSchema
    }))
    .output(chapterSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user has access to the project
      await checkProjectAccess(ctx.user!.id, input.projectId);

      // Find the chapter
      const chapter = await Chapter.findOne({
        _id: new ObjectId(input.chapterId),
        projectId: new ObjectId(input.projectId)
      });

      if (!chapter) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chapter not found',
        });
      }

      // Update the chapter fields
      if (input.data.title !== undefined) chapter.title = input.data.title;
      if (input.data.position !== undefined) chapter.position = input.data.position;
      if (input.data.synopsis !== undefined) chapter.synopsis = input.data.synopsis;
      if (input.data.content !== undefined) chapter.content = input.data.content;
      if (input.data.status !== undefined) chapter.status = input.data.status;
      if (input.data.characters !== undefined) chapter.characters = input.data.characters.map(id => new ObjectId(id));
      if (input.data.settings !== undefined) chapter.settings = input.data.settings.map(id => new ObjectId(id));
      if (input.data.plotlines !== undefined) chapter.plotlines = input.data.plotlines.map(id => new ObjectId(id));
      if (input.data.objects !== undefined) chapter.objects = input.data.objects.map(id => new ObjectId(id));
      if (input.data.notes !== undefined) chapter.notes = input.data.notes;
      if (input.data.aiGenerated !== undefined) chapter.aiGenerated = input.data.aiGenerated;

      // Add edit record
      chapter.edits.push({
        timestamp: new Date(),
        userId: new ObjectId(ctx.user!.id),
        changes: 'Updated chapter metadata'
      });

      // Save the chapter
      await chapter.save();

      return formatChapterResponse(chapter);
    }),

  /**
   * Update chapter content
   */
  updateContent: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      chapterId: z.string(),
      data: updateChapterContentSchema
    }))
    .output(chapterSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user has access to the project
      await checkProjectAccess(ctx.user!.id, input.projectId);

      // Find the chapter
      const chapter = await Chapter.findOne({
        _id: new ObjectId(input.chapterId),
        projectId: new ObjectId(input.projectId)
      });

      if (!chapter) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chapter not found',
        });
      }

      // Update the content
      chapter.content = input.data.content;
      
      // Calculate word count if not provided
      if (input.data.wordCount === undefined) {
        chapter.wordCount = input.data.content.split(/\s+/).filter(word => word.length > 0).length;
      } else {
        chapter.wordCount = input.data.wordCount;
      }

      // Add edit record
      chapter.edits.push({
        timestamp: new Date(),
        userId: new ObjectId(ctx.user!.id),
        changes: 'Updated chapter content'
      });

      // Save the chapter
      await chapter.save();

      return formatChapterResponse(chapter);
    }),

  /**
   * Delete a chapter
   */
  delete: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      chapterId: z.string()
    }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user has access to the project
      await checkProjectAccess(ctx.user!.id, input.projectId);

      // Delete the chapter
      const result = await Chapter.deleteOne({
        _id: new ObjectId(input.chapterId),
        projectId: new ObjectId(input.projectId)
      });

      if (result.deletedCount === 0) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chapter not found',
        });
      }

      // Reorder remaining chapters
      await Chapter.updateMany(
        { 
          projectId: new ObjectId(input.projectId),
          position: { $gt: result.deletedCount }
        },
        { $inc: { position: -1 } }
      );

      return { success: true };
    }),

  /**
   * Reorder chapters
   */
  reorder: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      data: reorderChaptersSchema
    }))
    .output(z.object({ success: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user has access to the project
      await checkProjectAccess(ctx.user!.id, input.projectId);

      // Update positions in a transaction
      const session = await Chapter.startSession();
      session.startTransaction();

      try {
        for (const { id, position } of input.data.chapters) {
          await Chapter.updateOne(
            { 
              _id: new ObjectId(id),
              projectId: new ObjectId(input.projectId)
            },
            { $set: { position } }
          );
        }

        await session.commitTransaction();
        return { success: true };
      } catch (error) {
        await session.abortTransaction();
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to reorder chapters',
        });
      } finally {
        session.endSession();
      }
    }),

  /**
   * Add an edit record to a chapter
   */
  addEdit: protectedProcedure
    .input(z.object({
      projectId: z.string(),
      chapterId: z.string(),
      data: addChapterEditSchema
    }))
    .output(chapterSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if user has access to the project
      await checkProjectAccess(ctx.user!.id, input.projectId);

      // Find the chapter
      const chapter = await Chapter.findOne({
        _id: new ObjectId(input.chapterId),
        projectId: new ObjectId(input.projectId)
      });

      if (!chapter) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Chapter not found',
        });
      }

      // Add edit record
      chapter.edits.push({
        timestamp: new Date(),
        userId: new ObjectId(input.data.userId),
        changes: input.data.changes
      });

      // Save the chapter
      await chapter.save();

      return formatChapterResponse(chapter);
    }),
}); 