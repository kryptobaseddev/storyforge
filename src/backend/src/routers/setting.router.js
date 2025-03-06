"use strict";
/**
 * Setting Router
 *
 * This file contains all tRPC procedures related to setting management.
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
exports.settingRouter = void 0;
const setting_model_1 = __importDefault(require("../models/setting.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const setting_schema_1 = require("../schemas/setting.schema");
const mongodb_1 = require("mongodb");
/**
 * Helper function to check if user has access to the project
 */
const checkProjectAccess = (projectId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield project_model_1.default.findById(projectId);
    if (!project) {
        throw new server_1.TRPCError({
            code: 'NOT_FOUND',
            message: 'Project not found',
        });
    }
    const isOwner = project.userId.toString() === userId;
    const isCollaborator = project.collaborators.some((c) => c.userId.toString() === userId);
    if (!isOwner && !isCollaborator) {
        throw new server_1.TRPCError({
            code: 'FORBIDDEN',
            message: 'You do not have permission to access this project',
        });
    }
    return { project, isOwner };
});
/**
 * Helper function to convert setting document to response object
 */
const settingToResponse = (setting) => {
    const id = setting._id ? setting._id.toString() : '';
    const projectId = setting.projectId ? setting.projectId.toString() : '';
    return {
        id,
        projectId,
        name: setting.name,
        description: setting.description || '',
        // Cast type to the expected union type, assuming the DB value is valid
        type: setting.type,
        details: setting.details || {},
        map: setting.map || { imageUrl: '', coordinates: {} },
        relatedSettings: (setting.relatedSettings || []).map((id) => id.toString()),
        characters: (setting.characters || []).map((id) => id.toString()),
        objects: (setting.objects || []).map((id) => id.toString()),
        imageUrl: setting.imageUrl || '',
        notes: setting.notes || '',
        createdAt: setting.createdAt,
        updatedAt: setting.updatedAt
    };
};
exports.settingRouter = (0, trpc_1.router)({
    /**
     * Create a new setting
     */
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        setting: setting_schema_1.createSettingSchema
    }))
        .output(setting_schema_1.settingSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, setting } = input;
            // Check if user has access to the project
            yield checkProjectAccess(projectId, userId);
            // Create new setting
            const newSetting = new setting_model_1.default(Object.assign(Object.assign({}, setting), { projectId: new mongodb_1.ObjectId(projectId) }));
            yield newSetting.save();
            return settingToResponse(newSetting);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Create setting error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create setting',
            });
        }
    })),
    /**
     * Get all settings for a project
     */
    getAll: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string()
    }))
        .output(setting_schema_1.settingListSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId } = input;
            // Check if user has access to the project
            yield checkProjectAccess(projectId, userId);
            // Get all settings for the project
            const settings = yield setting_model_1.default.find({ projectId });
            return settings.map(settingToResponse);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Get all settings error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve settings',
            });
        }
    })),
    /**
     * Get a setting by ID
     */
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        settingId: zod_1.z.string()
    }))
        .output(setting_schema_1.settingSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, settingId } = input;
            // Check if user has access to the project
            yield checkProjectAccess(projectId, userId);
            // Get setting
            const setting = yield setting_model_1.default.findOne({
                _id: settingId,
                projectId
            });
            if (!setting) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Setting not found',
                });
            }
            return settingToResponse(setting);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Get setting by ID error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve setting',
            });
        }
    })),
    /**
     * Update a setting
     */
    update: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        settingId: zod_1.z.string(),
        data: setting_schema_1.updateSettingSchema
    }))
        .output(setting_schema_1.settingSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, settingId, data } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update this setting',
                });
            }
            // Get and update setting
            const setting = yield setting_model_1.default.findOne({
                _id: settingId,
                projectId
            });
            if (!setting) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Setting not found',
                });
            }
            // Update setting fields
            Object.assign(setting, data);
            yield setting.save();
            return settingToResponse(setting);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Update setting error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update setting',
            });
        }
    })),
    /**
     * Delete a setting
     */
    delete: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        settingId: zod_1.z.string()
    }))
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, settingId } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to delete (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to delete this setting',
                });
            }
            // Delete setting
            const result = yield setting_model_1.default.deleteOne({
                _id: settingId,
                projectId
            });
            if (result.deletedCount === 0) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Setting not found',
                });
            }
            // Also update related settings to remove references
            yield setting_model_1.default.updateMany({ projectId, relatedSettings: settingId }, { $pull: { relatedSettings: settingId } });
            return { success: true };
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Delete setting error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete setting',
            });
        }
    })),
    /**
     * Upload map for a setting
     */
    uploadMap: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        settingId: zod_1.z.string(),
        map: setting_schema_1.uploadMapSchema
    }))
        .output(setting_schema_1.settingSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, settingId, map } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update this setting',
                });
            }
            // Get and update setting
            const setting = yield setting_model_1.default.findOne({
                _id: settingId,
                projectId
            });
            if (!setting) {
                throw new server_1.TRPCError({
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
            yield setting.save();
            return settingToResponse(setting);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Upload map error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to upload map',
            });
        }
    }))
});
