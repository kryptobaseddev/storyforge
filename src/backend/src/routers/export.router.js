"use strict";
/**
 * Export Router
 *
 * This router handles export-related operations, including
 * creating, retrieving, and downloading exports.
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
exports.exportRouter = void 0;
const trpc_1 = require("../trpc");
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const export_schema_1 = require("../schemas/export.schema");
const export_model_1 = __importDefault(require("../models/export.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const chapter_model_1 = __importDefault(require("../models/chapter.model"));
const mongodb_1 = require("mongodb");
// Helper function to check if user has access to a project
const checkProjectAccess = (userId, projectId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findOne({
        _id: new mongodb_1.ObjectId(projectId),
        $or: [
            { userId: new mongodb_1.ObjectId(userId) },
            { collaborators: { $in: [new mongodb_1.ObjectId(userId)] } }
        ]
    });
    if (!project) {
        throw new server_1.TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this project'
        });
    }
    return project;
});
// Helper function to convert export document to response format
const formatExportResponse = (exportDoc) => {
    var _a;
    // Use type assertion to handle the _id property
    const docWithId = exportDoc;
    // Handle the includeChapters array type conversion
    const includeChapters = [];
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
            templateId: (_a = exportDoc.configuration.templateId) === null || _a === void 0 ? void 0 : _a.toString(),
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
exports.exportRouter = (0, trpc_1.router)({
    // Get all exports for a project
    getExports: trpc_1.protectedProcedure
        .input(export_schema_1.projectIdSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            // Check project access
            yield checkProjectAccess(userId, input.projectId);
            // Get exports
            const exports = yield export_model_1.default.find({
                projectId: new mongodb_1.ObjectId(input.projectId)
            }).sort({ createdAt: -1 });
            return exports.map(formatExportResponse);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Error getting exports:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    })),
    // Create a new export
    createExport: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        export: export_schema_1.createExportSchema
    }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        try {
            const userId = ctx.user.id;
            // Check project access
            yield checkProjectAccess(userId, input.projectId);
            // If no specific chapters are selected, get all project chapters
            let chapters = ((_b = input.export.configuration) === null || _b === void 0 ? void 0 : _b.includeChapters) || [];
            if (!chapters.length) {
                const allChapters = yield chapter_model_1.default.find({
                    projectId: new mongodb_1.ObjectId(input.projectId)
                }).sort({ order: 1 });
                // Cast the chapter._id to the correct type to fix the linter error
                chapters = allChapters.map(chapter => {
                    // Handle the _id value with proper type casting
                    const chapterId = chapter._id;
                    if (chapterId && typeof chapterId.toString === 'function') {
                        return chapterId.toString();
                    }
                    return '';
                }).filter(id => id !== ''); // Remove any empty strings
            }
            // Create export
            const exportDoc = yield export_model_1.default.create({
                projectId: new mongodb_1.ObjectId(input.projectId),
                userId: new mongodb_1.ObjectId(userId),
                format: input.export.format,
                name: input.export.name,
                description: input.export.description || '',
                status: 'Pending',
                configuration: {
                    includeChapters: chapters,
                    includeTitlePage: ((_c = input.export.configuration) === null || _c === void 0 ? void 0 : _c.includeTitlePage) !== false,
                    includeTableOfContents: ((_d = input.export.configuration) === null || _d === void 0 ? void 0 : _d.includeTableOfContents) !== false,
                    includeCharacterList: ((_e = input.export.configuration) === null || _e === void 0 ? void 0 : _e.includeCharacterList) || false,
                    includeSettingDescriptions: ((_f = input.export.configuration) === null || _f === void 0 ? void 0 : _f.includeSettingDescriptions) || false,
                    customCss: ((_g = input.export.configuration) === null || _g === void 0 ? void 0 : _g.customCss) || '',
                    templateId: (_h = input.export.configuration) === null || _h === void 0 ? void 0 : _h.templateId,
                    pageSize: ((_j = input.export.configuration) === null || _j === void 0 ? void 0 : _j.pageSize) || 'A4',
                    fontFamily: ((_k = input.export.configuration) === null || _k === void 0 ? void 0 : _k.fontFamily) || 'Times New Roman',
                    fontSize: ((_l = input.export.configuration) === null || _l === void 0 ? void 0 : _l.fontSize) || 12
                },
                downloadCount: 0
            });
            // TODO: Queue export job for processing
            // This would be a background job that generates the export file
            // For now, just simulate a completed export for testing
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                try {
                    yield export_model_1.default.findByIdAndUpdate(exportDoc._id, {
                        status: 'Completed',
                        fileUrl: `https://placeholder.url/${exportDoc._id}.${input.export.format}`,
                        completedAt: new Date(),
                        fileSize: Math.floor(Math.random() * 10000000) // Random file size for testing
                    });
                    console.log(`Export ${exportDoc._id} marked as completed (simulated)`);
                }
                catch (err) {
                    console.error('Error updating export status:', err);
                }
            }), 5000); // Simulate 5 second processing time
            return formatExportResponse(exportDoc);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Error creating export:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    })),
    // Get export by ID
    getExportById: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        id: zod_1.z.string()
    }))
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            // Check project access
            yield checkProjectAccess(userId, input.projectId);
            // Get export
            const exportDoc = yield export_model_1.default.findOne({
                _id: new mongodb_1.ObjectId(input.id),
                projectId: new mongodb_1.ObjectId(input.projectId)
            });
            if (!exportDoc) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Export not found'
                });
            }
            return formatExportResponse(exportDoc);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Error getting export:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    })),
    // Download export
    downloadExport: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        id: zod_1.z.string()
    }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            // Check project access
            yield checkProjectAccess(userId, input.projectId);
            // Get export
            const exportDoc = yield export_model_1.default.findOne({
                _id: new mongodb_1.ObjectId(input.id),
                projectId: new mongodb_1.ObjectId(input.projectId)
            });
            if (!exportDoc) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Export not found'
                });
            }
            // Check if export is completed
            if (exportDoc.status !== 'Completed') {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: `Export is not ready for download. Current status: ${exportDoc.status}`
                });
            }
            // Check if file URL exists
            if (!exportDoc.fileUrl) {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Export file is not available'
                });
            }
            // Update download count
            yield export_model_1.default.findByIdAndUpdate(input.id, { $inc: { downloadCount: 1 } });
            return {
                message: 'Download initiated',
                fileUrl: exportDoc.fileUrl
            };
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Error downloading export:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    })),
    // Delete export
    deleteExport: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        id: zod_1.z.string()
    }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            // Check project access
            yield checkProjectAccess(userId, input.projectId);
            // Get export
            const exportDoc = yield export_model_1.default.findOne({
                _id: new mongodb_1.ObjectId(input.id),
                projectId: new mongodb_1.ObjectId(input.projectId)
            });
            if (!exportDoc) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Export not found'
                });
            }
            // Delete export
            yield export_model_1.default.deleteOne({ _id: new mongodb_1.ObjectId(input.id) });
            return {
                message: 'Export deleted successfully'
            };
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Error deleting export:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: error instanceof Error ? error.message : 'Unknown error occurred',
                cause: error
            });
        }
    }))
});
