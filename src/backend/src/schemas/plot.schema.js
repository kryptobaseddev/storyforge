"use strict";
/**
 * Plot Schemas
 *
 * This file contains Zod schemas for plot-related data validation.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.plotListSchema = exports.plotSchema = exports.updatePlotSchema = exports.createPlotSchema = exports.plotElementSchema = exports.updatePlotElementSchema = exports.createPlotElementSchema = void 0;
const zod_1 = require("zod");
const mongodb_1 = require("mongodb");
// Helper for ObjectId validation
const objectIdSchema = zod_1.z.string().refine((val) => {
    try {
        new mongodb_1.ObjectId(val);
        return true;
    }
    catch (error) {
        return false;
    }
}, { message: 'Invalid ObjectId format' });
// Plot element type enum
const plotElementTypeEnum = zod_1.z.enum([
    'Setup',
    'Inciting Incident',
    'Rising Action',
    'Midpoint',
    'Complications',
    'Crisis',
    'Climax',
    'Resolution',
    'Custom'
]);
// Plot type enum
const plotTypeEnum = zod_1.z.enum([
    'Main Plot',
    'Subplot',
    'Character Arc'
]);
// Structure type enum
const structureTypeEnum = zod_1.z.enum([
    'Three-Act',
    'Hero\'s Journey',
    'Save the Cat',
    'Seven-Point',
    'Freytag\'s Pyramid',
    'Fichtean Curve',
    'Custom'
]);
// Status enum
const statusEnum = zod_1.z.enum([
    'Planned',
    'In Progress',
    'Completed',
    'Abandoned'
]);
// Schema for creating a plot element
exports.createPlotElementSchema = zod_1.z.object({
    type: plotElementTypeEnum,
    description: zod_1.z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters'),
    characters: zod_1.z.array(objectIdSchema).optional(),
    settings: zod_1.z.array(objectIdSchema).optional(),
    objects: zod_1.z.array(objectIdSchema).optional(),
    order: zod_1.z.number().int().min(0, 'Order number must be positive')
});
// Schema for updating a plot element
exports.updatePlotElementSchema = exports.createPlotElementSchema.partial();
// Schema for a complete plot element (including id)
exports.plotElementSchema = exports.createPlotElementSchema.extend({
    id: zod_1.z.string()
});
// Schema for creating a plot
exports.createPlotSchema = zod_1.z.object({
    projectId: objectIdSchema,
    title: zod_1.z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
    description: zod_1.z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters'),
    type: plotTypeEnum,
    structure: structureTypeEnum.default('Three-Act'),
    importance: zod_1.z.number().int().min(1).max(5).default(3),
    status: statusEnum.default('Planned'),
    elements: zod_1.z.array(exports.createPlotElementSchema).optional(),
    relatedPlots: zod_1.z.array(objectIdSchema).optional(),
    notes: zod_1.z.string().optional()
});
// Schema for updating a plot
exports.updatePlotSchema = exports.createPlotSchema.partial();
// Schema for a complete plot (including id and timestamps)
exports.plotSchema = zod_1.z.object({
    id: zod_1.z.string(),
    projectId: zod_1.z.string(),
    title: zod_1.z.string(),
    description: zod_1.z.string(),
    type: plotTypeEnum,
    structure: structureTypeEnum,
    importance: zod_1.z.number(),
    status: statusEnum,
    elements: zod_1.z.array(exports.plotElementSchema),
    relatedPlots: zod_1.z.array(zod_1.z.string()),
    notes: zod_1.z.string().optional(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
// Schema for a list of plots
exports.plotListSchema = zod_1.z.array(exports.plotSchema);
