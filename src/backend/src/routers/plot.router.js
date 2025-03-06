"use strict";
/**
 * Plot Router
 *
 * This file contains all tRPC procedures related to plot management.
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
exports.plotRouter = void 0;
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const plot_schema_1 = require("../schemas/plot.schema");
const plot_model_1 = __importDefault(require("../models/plot.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
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
 * Helper function to convert plot document to response object
 */
const plotToResponse = (plot) => {
    var _a;
    const id = plot._id ? plot._id.toString() : '';
    return {
        id,
        projectId: plot.projectId.toString(),
        title: plot.title,
        description: plot.description,
        type: plot.type,
        structure: plot.structure,
        importance: plot.importance,
        status: plot.status,
        elements: plot.elements.map(element => {
            var _a, _b, _c, _d;
            return ({
                id: ((_a = element._id) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                type: element.type,
                description: element.description,
                characters: ((_b = element.characters) === null || _b === void 0 ? void 0 : _b.map(id => id.toString())) || [],
                settings: ((_c = element.settings) === null || _c === void 0 ? void 0 : _c.map(id => id.toString())) || [],
                objects: ((_d = element.objects) === null || _d === void 0 ? void 0 : _d.map(id => id.toString())) || [],
                order: element.order
            });
        }),
        relatedPlots: ((_a = plot.relatedPlots) === null || _a === void 0 ? void 0 : _a.map(id => id.toString())) || [],
        notes: plot.notes,
        createdAt: plot.createdAt,
        updatedAt: plot.updatedAt
    };
};
exports.plotRouter = (0, trpc_1.router)({
    /**
     * Get all plots for a project
     */
    getAll: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string()
    }))
        .output(plot_schema_1.plotListSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId } = input;
            // Check if user has access to the project
            yield checkProjectAccess(projectId, userId);
            // Get all plots for the project
            const plots = yield plot_model_1.default.find({ projectId }).sort({ title: 1 });
            return plots.map(plotToResponse);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Get all plots error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve plots',
            });
        }
    })),
    /**
     * Get a plot by ID
     */
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        plotId: zod_1.z.string()
    }))
        .output(plot_schema_1.plotSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, plotId } = input;
            // Check if user has access to the project
            yield checkProjectAccess(projectId, userId);
            // Get plot
            const plot = yield plot_model_1.default.findOne({
                _id: plotId,
                projectId
            }).populate('elements.characters', 'name')
                .populate('elements.settings', 'name')
                .populate('elements.objects', 'name');
            if (!plot) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plot not found',
                });
            }
            return plotToResponse(plot);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Get plot by ID error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve plot',
            });
        }
    })),
    /**
     * Create a new plot
     */
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        plot: plot_schema_1.createPlotSchema
    }))
        .output(plot_schema_1.plotSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, plot } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to create (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to create plots for this project',
                });
            }
            // Create new plot
            const newPlot = yield plot_model_1.default.create(Object.assign(Object.assign({}, plot), { projectId: new mongodb_1.ObjectId(projectId), elements: plot.elements || [] }));
            return plotToResponse(newPlot);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Create plot error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create plot',
            });
        }
    })),
    /**
     * Update a plot
     */
    update: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        plotId: zod_1.z.string(),
        data: plot_schema_1.updatePlotSchema
    }))
        .output(plot_schema_1.plotSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, plotId, data } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update this plot',
                });
            }
            // Get and update plot
            const plot = yield plot_model_1.default.findOne({
                _id: plotId,
                projectId
            });
            if (!plot) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plot not found',
                });
            }
            // Update plot fields
            if (data.title)
                plot.title = data.title;
            if (data.description)
                plot.description = data.description;
            if (data.structure)
                plot.structure = data.structure;
            if (data.type)
                plot.type = data.type;
            if (data.importance !== undefined)
                plot.importance = data.importance;
            if (data.status)
                plot.status = data.status;
            if (data.notes !== undefined)
                plot.notes = data.notes;
            // Handle elements update if provided - make sure to convert string IDs to ObjectId
            if (data.elements) {
                // Map each element to have the proper ObjectId types
                plot.elements = data.elements.map(element => ({
                    type: element.type,
                    description: element.description,
                    order: element.order,
                    characters: element.characters ? element.characters.map(id => new mongodb_1.ObjectId(id)) : [],
                    settings: element.settings ? element.settings.map(id => new mongodb_1.ObjectId(id)) : [],
                    objects: element.objects ? element.objects.map(id => new mongodb_1.ObjectId(id)) : []
                }));
            }
            // Handle related plots if provided - convert string IDs to ObjectId
            if (data.relatedPlots) {
                plot.relatedPlots = data.relatedPlots.map(id => new mongodb_1.ObjectId(id));
            }
            yield plot.save();
            return plotToResponse(plot);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Update plot error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update plot',
            });
        }
    })),
    /**
     * Delete a plot
     */
    delete: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        plotId: zod_1.z.string()
    }))
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, plotId } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to delete (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to delete this plot',
                });
            }
            // Delete plot
            const result = yield plot_model_1.default.deleteOne({
                _id: plotId,
                projectId
            });
            if (result.deletedCount === 0) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plot not found',
                });
            }
            return { success: true };
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Delete plot error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete plot',
            });
        }
    })),
    /**
     * Add a plot point to a plot
     */
    addPlotPoint: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        plotId: zod_1.z.string(),
        plotElement: plot_schema_1.createPlotElementSchema
    }))
        .output(plot_schema_1.plotSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, plotId, plotElement } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update this plot',
                });
            }
            // Get plot
            const plot = yield plot_model_1.default.findOne({
                _id: plotId,
                projectId
            });
            if (!plot) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plot not found',
                });
            }
            // Convert string IDs to ObjectId
            const characters = plotElement.characters ?
                plotElement.characters.map(id => new mongodb_1.ObjectId(id)) : [];
            const settings = plotElement.settings ?
                plotElement.settings.map(id => new mongodb_1.ObjectId(id)) : [];
            const objects = plotElement.objects ?
                plotElement.objects.map(id => new mongodb_1.ObjectId(id)) : [];
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
            yield plot.save();
            return plotToResponse(plot);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Add plot element error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to add plot element',
            });
        }
    })),
    /**
     * Update a plot point
     */
    updatePlotPoint: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        plotId: zod_1.z.string(),
        elementId: zod_1.z.string(),
        data: plot_schema_1.updatePlotElementSchema
    }))
        .output(plot_schema_1.plotSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, plotId, elementId, data } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update this plot point',
                });
            }
            // Get plot
            const plot = yield plot_model_1.default.findOne({
                _id: plotId,
                projectId
            });
            if (!plot) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plot not found',
                });
            }
            // Find plot element index
            const elementIndex = plot.elements.findIndex(element => { var _a; return ((_a = element._id) === null || _a === void 0 ? void 0 : _a.toString()) === elementId; });
            if (elementIndex === -1) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plot element not found',
                });
            }
            // Update plot element fields
            if (data.description)
                plot.elements[elementIndex].description = data.description;
            if (data.order !== undefined)
                plot.elements[elementIndex].order = data.order;
            if (data.type)
                plot.elements[elementIndex].type = data.type;
            if (data.characters) {
                plot.elements[elementIndex].characters = data.characters.map(id => new mongodb_1.ObjectId(id));
            }
            if (data.settings) {
                plot.elements[elementIndex].settings = data.settings.map(id => new mongodb_1.ObjectId(id));
            }
            if (data.objects) {
                plot.elements[elementIndex].objects = data.objects.map(id => new mongodb_1.ObjectId(id));
            }
            // Sort plot elements by order
            plot.elements.sort((a, b) => a.order - b.order);
            yield plot.save();
            return plotToResponse(plot);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Update plot element error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update plot element',
            });
        }
    })),
    /**
     * Delete a plot point
     */
    deletePlotPoint: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        plotId: zod_1.z.string(),
        elementId: zod_1.z.string()
    }))
        .output(plot_schema_1.plotSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, plotId, elementId } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to delete this plot point',
                });
            }
            // Get plot
            const plot = yield plot_model_1.default.findOne({
                _id: plotId,
                projectId
            });
            if (!plot) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plot not found',
                });
            }
            // Find plot element index
            const elementIndex = plot.elements.findIndex(element => { var _a; return ((_a = element._id) === null || _a === void 0 ? void 0 : _a.toString()) === elementId; });
            if (elementIndex === -1) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Plot element not found',
                });
            }
            // Remove plot element
            plot.elements.splice(elementIndex, 1);
            yield plot.save();
            return plotToResponse(plot);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Delete plot element error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete plot element',
            });
        }
    }))
});
