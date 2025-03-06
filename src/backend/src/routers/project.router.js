"use strict";
/**
 * Project Router
 *
 * This file contains all tRPC procedures related to project management.
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
exports.projectRouter = void 0;
const project_model_1 = __importDefault(require("../models/project.model"));
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const project_schema_1 = require("../schemas/project.schema");
const mongodb_1 = require("mongodb");
exports.projectRouter = (0, trpc_1.router)({
    /**
     * Create a new project
     */
    create: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'POST',
            path: '/projects',
            tags: ['projects'],
            summary: 'Create a new project',
        },
    })
        .input(project_schema_1.createProjectSchema)
        .output(project_schema_1.projectSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            // Log input for debugging
            console.log('Creating project with input:', JSON.stringify(input));
            const project = new project_model_1.default(Object.assign(Object.assign({}, input), { userId: new mongodb_1.ObjectId(userId), status: 'Draft', collaborators: [] }));
            yield project.save();
            return projectToResponse(project);
        }
        catch (error) {
            console.error('Project creation error:', error);
            // Provide more specific error message
            if (error instanceof Error) {
                if (error.message.includes('validation failed')) {
                    throw new server_1.TRPCError({
                        code: 'BAD_REQUEST',
                        message: `Validation error: ${error.message}`,
                        cause: error
                    });
                }
            }
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create project',
                cause: error
            });
        }
    })),
    /**
     * Get all projects for the current user
     */
    getAll: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'GET',
            path: '/projects',
            tags: ['projects'],
            summary: 'Get all projects for the current user',
        },
    })
        .input(zod_1.z.object({}).strict())
        .output(project_schema_1.projectListSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx }) {
        try {
            const userId = ctx.user.id;
            // Find projects where user is owner or collaborator
            const projects = yield project_model_1.default.find({
                $or: [
                    { userId: new mongodb_1.ObjectId(userId) },
                    { 'collaborators.userId': new mongodb_1.ObjectId(userId) }
                ]
            }).sort({ updatedAt: -1 });
            return projects.map(projectToResponse);
        }
        catch (error) {
            console.error('Get all projects error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve projects',
            });
        }
    })),
    /**
     * Get a project by ID
     */
    getById: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'GET',
            path: '/projects/{id}',
            tags: ['projects'],
            summary: 'Get a project by ID',
        },
    })
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .output(project_schema_1.projectSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { id } = input;
            const project = yield project_model_1.default.findById(new mongodb_1.ObjectId(id));
            if (!project) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found',
                });
            }
            // Check if user is owner or collaborator
            const isOwner = project.userId.toString() === userId;
            const isCollaborator = project.collaborators.some(c => c.userId.toString() === userId);
            if (!isOwner && !isCollaborator) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to view this project',
                });
            }
            return projectToResponse(project);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError)
                throw error;
            console.error('Get project by ID error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve project',
            });
        }
    })),
    /**
     * Update a project
     */
    update: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'PUT',
            path: '/projects/{id}',
            tags: ['projects'],
            summary: 'Update a project',
        },
    })
        .input(zod_1.z.object({
        id: zod_1.z.string(),
        data: project_schema_1.updateProjectSchema
    }))
        .output(project_schema_1.projectSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { id, data } = input;
            const project = yield project_model_1.default.findById(new mongodb_1.ObjectId(id));
            if (!project) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found',
                });
            }
            // Only owner or editor can update project
            const isOwner = project.userId.toString() === userId;
            const isEditor = project.collaborators.some(c => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update this project',
                });
            }
            // Update project fields
            Object.assign(project, data);
            yield project.save();
            return projectToResponse(project);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError)
                throw error;
            console.error('Update project error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update project',
            });
        }
    })),
    /**
     * Delete a project
     */
    delete: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'DELETE',
            path: '/projects/{id}',
            tags: ['projects'],
            summary: 'Delete a project',
        },
    })
        .input(zod_1.z.object({ id: zod_1.z.string() }))
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { id } = input;
            const project = yield project_model_1.default.findById(id);
            if (!project) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found',
                });
            }
            // Only owner can delete project
            if (project.userId.toString() !== userId) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to delete this project',
                });
            }
            yield project_model_1.default.findByIdAndDelete(id);
            // TODO: Delete related data (characters, settings, plots, chapters)
            return { success: true };
        }
        catch (error) {
            if (error instanceof server_1.TRPCError)
                throw error;
            console.error('Delete project error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete project',
            });
        }
    })),
    /**
     * Add a collaborator to a project
     */
    addCollaborator: trpc_1.protectedProcedure
        .meta({
        openapi: {
            method: 'POST',
            path: '/projects/{projectId}/collaborators',
            tags: ['projects', 'collaborators'],
            summary: 'Add a collaborator to a project',
        },
    })
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        collaborator: project_schema_1.addCollaboratorSchema
    }))
        .output(project_schema_1.collaboratorListSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, collaborator } = input;
            const project = yield project_model_1.default.findById(projectId);
            if (!project) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found',
                });
            }
            // Only owner can add collaborators
            if (project.userId.toString() !== userId) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to add collaborators',
                });
            }
            // Check if collaborator already exists
            const collaboratorExists = project.collaborators.some(c => c.userId.toString() === collaborator.userId);
            if (collaboratorExists) {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Collaborator already exists',
                });
            }
            // Add collaborator
            project.collaborators.push({
                userId: new mongodb_1.ObjectId(collaborator.userId),
                role: collaborator.role
            });
            yield project.save();
            return project.collaborators.map(c => ({
                userId: c.userId.toString(),
                role: c.role
            }));
        }
        catch (error) {
            if (error instanceof server_1.TRPCError)
                throw error;
            console.error('Add collaborator error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to add collaborator',
            });
        }
    })),
    /**
     * Remove a collaborator from a project
     */
    removeCollaborator: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        collaboratorId: zod_1.z.string()
    }))
        .output(project_schema_1.collaboratorListSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, collaboratorId } = input;
            const project = yield project_model_1.default.findById(projectId);
            if (!project) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found',
                });
            }
            // Only owner can remove collaborators
            if (project.userId.toString() !== userId) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to remove collaborators',
                });
            }
            // Check if user is a collaborator
            const collaboratorIndex = project.collaborators.findIndex((c) => c.userId.toString() === collaboratorId);
            if (collaboratorIndex === -1) {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'User is not a collaborator',
                });
            }
            // Remove collaborator
            project.collaborators.splice(collaboratorIndex, 1);
            yield project.save();
            return project.collaborators.map((c) => ({
                userId: c.userId.toString(),
                role: c.role
            }));
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Remove collaborator error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to remove collaborator',
            });
        }
    })),
    /**
     * Update a collaborator's role on a project
     */
    updateCollaboratorRole: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        collaboratorId: zod_1.z.string(),
        role: zod_1.z.enum(['Editor', 'Viewer', 'Contributor'])
    }))
        .output(project_schema_1.collaboratorListSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, collaboratorId, role } = input;
            const project = yield project_model_1.default.findById(projectId);
            if (!project) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Project not found',
                });
            }
            // Only owner can update collaborator roles
            if (project.userId.toString() !== userId) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update collaborator roles',
                });
            }
            // Find collaborator
            const collaborator = project.collaborators.find((c) => c.userId.toString() === collaboratorId);
            if (!collaborator) {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'User is not a collaborator',
                });
            }
            // Update role
            collaborator.role = role;
            yield project.save();
            return project.collaborators.map((c) => ({
                userId: c.userId.toString(),
                role: c.role
            }));
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Update collaborator role error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update collaborator role',
            });
        }
    }))
});
/**
 * Helper function to convert project document to response object
 */
const projectToResponse = (project) => {
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
