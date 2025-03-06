"use strict";
/**
 * Chapter Router
 *
 * This router handles chapter-related operations, including
 * CRUD operations, content management, and reordering.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.chapterRouter = void 0;
const trpc_1 = require("../trpc");
const server_1 = require("@trpc/server");
const mongodb_1 = require("mongodb");
const chapter_model_1 = __importDefault(require("../models/chapter.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const chapter_schema_1 = require("../schemas/chapter.schema");
const zod_1 = require("zod");
// Helper function to check if a user has access to a project
const checkProjectAccess = (userId, projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findOne({
        _id: new mongodb_1.ObjectId(projectId),
        $or: [
            { createdBy: new mongodb_1.ObjectId(userId) },
            { collaborators: { $elemMatch: { userId: new mongodb_1.ObjectId(userId) } } }
        ]
    });
    if (!project) {
        throw new server_1.TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this project',
        });
    }
    return project;
});
// Helper function to format chapter data for response
const formatChapterResponse = (chapter) => {
    return {
        id: chapter._id.toString(),
        projectId: chapter.projectId.toString(),
        title: chapter.title,
        position: chapter.position,
        synopsis: chapter.synopsis,
        content: chapter.content,
        status: chapter.status,
        wordCount: chapter.wordCount,
        characters: chapter.characters.map((id) => id.toString()),
        settings: chapter.settings.map((id) => id.toString()),
        plotlines: chapter.plotlines.map((id) => id.toString()),
        objects: chapter.objects.map((id) => id.toString()),
        notes: chapter.notes,
        aiGenerated: chapter.aiGenerated,
        edits: chapter.edits.map((edit) => ({
            timestamp: edit.timestamp,
            userId: edit.userId.toString(),
            changes: edit.changes
        })),
        createdAt: chapter.createdAt,
        updatedAt: chapter.updatedAt
    };
};
exports.chapterRouter = (0, trpc_1.router)({
    /**
     * Get all chapters for a project
     */
    getAll: trpc_1.protectedProcedure
        .input(zod_1.z.object({ projectId: zod_1.z.string() }))
        .output(chapter_schema_1.chapterListSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Check if user has access to the project
        yield checkProjectAccess(ctx.user.id, input.projectId);
        // Get all chapters for the project
        const chapters = yield chapter_model_1.default.find({
            projectId: new mongodb_1.ObjectId(input.projectId)
        }).sort({ position: 1 });
        return chapters.map(formatChapterResponse);
    })),
    /**
     * Get chapter by ID
     */
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        chapterId: zod_1.z.string()
    }))
        .output(chapter_schema_1.chapterSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Check if user has access to the project
        yield checkProjectAccess(ctx.user.id, input.projectId);
        // Get the chapter
        const chapter = yield chapter_model_1.default.findOne({
            _id: new mongodb_1.ObjectId(input.chapterId),
            projectId: new mongodb_1.ObjectId(input.projectId)
        });
        if (!chapter) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Chapter not found',
            });
        }
        return formatChapterResponse(chapter);
    })),
    /**
     * Create a new chapter
     */
    create: trpc_1.protectedProcedure
        .input(chapter_schema_1.createChapterSchema)
        .output(chapter_schema_1.chapterSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        var _b, _c, _d, _e;
        // Check if user has access to the project
        yield checkProjectAccess(ctx.user.id, input.projectId);
        // Determine the next position value if not provided
        if (input.position === undefined) {
            const highestPositionChapter = yield chapter_model_1.default.findOne({
                projectId: new mongodb_1.ObjectId(input.projectId)
            }).sort({ position: -1 });
            input.position = highestPositionChapter ? highestPositionChapter.position + 1 : 0;
        }
        // Create the chapter
        const chapter = yield chapter_model_1.default.create(Object.assign(Object.assign({}, input), { projectId: new mongodb_1.ObjectId(input.projectId), characters: ((_b = input.characters) === null || _b === void 0 ? void 0 : _b.map(id => new mongodb_1.ObjectId(id))) || [], settings: ((_c = input.settings) === null || _c === void 0 ? void 0 : _c.map(id => new mongodb_1.ObjectId(id))) || [], plotlines: ((_d = input.plotlines) === null || _d === void 0 ? void 0 : _d.map(id => new mongodb_1.ObjectId(id))) || [], objects: ((_e = input.objects) === null || _e === void 0 ? void 0 : _e.map(id => new mongodb_1.ObjectId(id))) || [], wordCount: input.content ? input.content.split(/\s+/).filter(word => word.length > 0).length : 0 }));
        return formatChapterResponse(chapter);
    })),
    /**
     * Update a chapter
     */
    update: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        chapterId: zod_1.z.string(),
        data: chapter_schema_1.updateChapterSchema
    }))
        .output(chapter_schema_1.chapterSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Check if user has access to the project
        yield checkProjectAccess(ctx.user.id, input.projectId);
        // Find the chapter
        const chapter = yield chapter_model_1.default.findOne({
            _id: new mongodb_1.ObjectId(input.chapterId),
            projectId: new mongodb_1.ObjectId(input.projectId)
        });
        if (!chapter) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Chapter not found',
            });
        }
        // Update the chapter fields
        if (input.data.title !== undefined)
            chapter.title = input.data.title;
        if (input.data.position !== undefined)
            chapter.position = input.data.position;
        if (input.data.synopsis !== undefined)
            chapter.synopsis = input.data.synopsis;
        if (input.data.content !== undefined)
            chapter.content = input.data.content;
        if (input.data.status !== undefined)
            chapter.status = input.data.status;
        if (input.data.characters !== undefined)
            chapter.characters = input.data.characters.map(id => new mongodb_1.ObjectId(id));
        if (input.data.settings !== undefined)
            chapter.settings = input.data.settings.map(id => new mongodb_1.ObjectId(id));
        if (input.data.plotlines !== undefined)
            chapter.plotlines = input.data.plotlines.map(id => new mongodb_1.ObjectId(id));
        if (input.data.objects !== undefined)
            chapter.objects = input.data.objects.map(id => new mongodb_1.ObjectId(id));
        if (input.data.notes !== undefined)
            chapter.notes = input.data.notes;
        if (input.data.aiGenerated !== undefined)
            chapter.aiGenerated = input.data.aiGenerated;
        // Add edit record
        chapter.edits.push({
            timestamp: new Date(),
            userId: new mongodb_1.ObjectId(ctx.user.id),
            changes: 'Updated chapter metadata'
        });
        // Save the chapter
        yield chapter.save();
        return formatChapterResponse(chapter);
    })),
    /**
     * Update chapter content
     */
    updateContent: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        chapterId: zod_1.z.string(),
        data: chapter_schema_1.updateChapterContentSchema
    }))
        .output(chapter_schema_1.chapterSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Check if user has access to the project
        yield checkProjectAccess(ctx.user.id, input.projectId);
        // Find the chapter
        const chapter = yield chapter_model_1.default.findOne({
            _id: new mongodb_1.ObjectId(input.chapterId),
            projectId: new mongodb_1.ObjectId(input.projectId)
        });
        if (!chapter) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Chapter not found',
            });
        }
        // Update the content
        chapter.content = input.data.content;
        // Calculate word count if not provided
        if (input.data.wordCount === undefined) {
            chapter.wordCount = input.data.content.split(/\s+/).filter(word => word.length > 0).length;
        }
        else {
            chapter.wordCount = input.data.wordCount;
        }
        // Add edit record
        chapter.edits.push({
            timestamp: new Date(),
            userId: new mongodb_1.ObjectId(ctx.user.id),
            changes: 'Updated chapter content'
        });
        // Save the chapter
        yield chapter.save();
        return formatChapterResponse(chapter);
    })),
    /**
     * Delete a chapter
     */
    delete: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        chapterId: zod_1.z.string()
    }))
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Check if user has access to the project
        yield checkProjectAccess(ctx.user.id, input.projectId);
        // Delete the chapter
        const result = yield chapter_model_1.default.deleteOne({
            _id: new mongodb_1.ObjectId(input.chapterId),
            projectId: new mongodb_1.ObjectId(input.projectId)
        });
        if (result.deletedCount === 0) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Chapter not found',
            });
        }
        // Reorder remaining chapters
        yield chapter_model_1.default.updateMany({
            projectId: new mongodb_1.ObjectId(input.projectId),
            position: { $gt: result.deletedCount }
        }, { $inc: { position: -1 } });
        return { success: true };
    })),
    /**
     * Reorder chapters
     */
    reorder: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        data: chapter_schema_1.reorderChaptersSchema
    }))
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Check if user has access to the project
        yield checkProjectAccess(ctx.user.id, input.projectId);
        // Update positions in a transaction
        const session = yield chapter_model_1.default.startSession();
        session.startTransaction();
        try {
            for (const { id, position } of input.data.chapters) {
                yield chapter_model_1.default.updateOne({
                    _id: new mongodb_1.ObjectId(id),
                    projectId: new mongodb_1.ObjectId(input.projectId)
                }, { $set: { position } });
            }
            yield session.commitTransaction();
            return { success: true };
        }
        catch (error) {
            yield session.abortTransaction();
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to reorder chapters',
            });
        }
        finally {
            session.endSession();
        }
    })),
    /**
     * Add an edit record to a chapter
     */
    addEdit: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        chapterId: zod_1.z.string(),
        data: chapter_schema_1.addChapterEditSchema
    }))
        .output(chapter_schema_1.chapterSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        // Check if user has access to the project
        yield checkProjectAccess(ctx.user.id, input.projectId);
        // Find the chapter
        const chapter = yield chapter_model_1.default.findOne({
            _id: new mongodb_1.ObjectId(input.chapterId),
            projectId: new mongodb_1.ObjectId(input.projectId)
        });
        if (!chapter) {
            throw new server_1.TRPCError({
                code: 'NOT_FOUND',
                message: 'Chapter not found',
            });
        }
        // Add edit record
        chapter.edits.push({
            timestamp: new Date(),
            userId: new mongodb_1.ObjectId(input.data.userId),
            changes: input.data.changes
        });
        // Save the chapter
        yield chapter.save();
        return formatChapterResponse(chapter);
    })),
});
