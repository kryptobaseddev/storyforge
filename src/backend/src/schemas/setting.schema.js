"use strict";
/**
 * Setting schemas
 *
 * This file contains Zod schemas for setting-related data validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMapSchema = exports.settingListSchema = exports.settingSchema = exports.updateSettingSchema = exports.createSettingSchema = exports.mapSchema = exports.settingDetailsSchema = void 0;
const zod_1 = require("zod");
const mongodb_1 = require("mongodb");
// Helper function to validate ObjectId strings
const objectIdSchema = zod_1.z.string().refine((id) => {
    try {
        return new mongodb_1.ObjectId(id).toString() === id;
    }
    catch (error) {
        return false;
    }
}, {
    message: 'Invalid ObjectId format',
});
/**
 * Setting details schema
 */
exports.settingDetailsSchema = zod_1.z.object({
    geography: zod_1.z.string().optional().default(''),
    climate: zod_1.z.string().optional().default(''),
    architecture: zod_1.z.string().optional().default(''),
    culture: zod_1.z.string().optional().default(''),
    history: zod_1.z.string().optional().default(''),
    government: zod_1.z.string().optional().default(''),
    economy: zod_1.z.string().optional().default(''),
    technology: zod_1.z.string().optional().default('')
});
/**
 * Map schema
 */
exports.mapSchema = zod_1.z.object({
    imageUrl: zod_1.z.string(),
    coordinates: zod_1.z.any().optional()
});
/**
 * Create setting schema
 */
exports.createSettingSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    description: zod_1.z.string().optional().default(''),
    type: zod_1.z.enum([
        'City',
        'Country',
        'Planet',
        'Building',
        'Landscape',
        'Region',
        'World',
        'Room',
        'Other'
    ]),
    details: exports.settingDetailsSchema.optional().default({}),
    map: exports.mapSchema.optional(),
    relatedSettings: zod_1.z.array(objectIdSchema).optional().default([]),
    characters: zod_1.z.array(objectIdSchema).optional().default([]),
    objects: zod_1.z.array(objectIdSchema).optional().default([]),
    imageUrl: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional()
});
/**
 * Update setting schema
 */
exports.updateSettingSchema = exports.createSettingSchema.partial();
/**
 * Setting response schema
 */
exports.settingSchema = exports.createSettingSchema.extend({
    id: zod_1.z.string(),
    projectId: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
/**
 * Setting list schema
 */
exports.settingListSchema = zod_1.z.array(exports.settingSchema);
/**
 * Upload map schema
 */
exports.uploadMapSchema = zod_1.z.object({
    imageUrl: zod_1.z.string(),
    coordinates: zod_1.z.any().optional()
});
