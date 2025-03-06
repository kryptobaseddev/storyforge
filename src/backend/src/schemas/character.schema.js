"use strict";
/**
 * Character schemas
 *
 * This file contains Zod schemas for character-related data validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.relationshipListSchema = exports.addRelationshipSchema = exports.characterListSchema = exports.characterSchema = exports.updateCharacterSchema = exports.createCharacterSchema = exports.relationshipSchema = exports.attributesSchema = exports.backgroundAttributesSchema = exports.personalityAttributesSchema = exports.physicalAttributesSchema = void 0;
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
 * Physical attributes schema
 */
exports.physicalAttributesSchema = zod_1.z.object({
    age: zod_1.z.number().min(0).optional(),
    height: zod_1.z.string().optional(),
    build: zod_1.z.string().optional(),
    hairColor: zod_1.z.string().optional(),
    eyeColor: zod_1.z.string().optional(),
    distinguishingFeatures: zod_1.z.array(zod_1.z.string()).default([])
});
/**
 * Personality attributes schema
 */
exports.personalityAttributesSchema = zod_1.z.object({
    traits: zod_1.z.array(zod_1.z.string()).default([]),
    strengths: zod_1.z.array(zod_1.z.string()).default([]),
    weaknesses: zod_1.z.array(zod_1.z.string()).default([]),
    fears: zod_1.z.array(zod_1.z.string()).default([]),
    desires: zod_1.z.array(zod_1.z.string()).default([])
});
/**
 * Background attributes schema
 */
exports.backgroundAttributesSchema = zod_1.z.object({
    birthplace: zod_1.z.string().optional(),
    family: zod_1.z.string().optional(),
    education: zod_1.z.string().optional(),
    occupation: zod_1.z.string().optional(),
    significantEvents: zod_1.z.array(zod_1.z.string()).default([])
});
/**
 * Character attributes schema
 */
exports.attributesSchema = zod_1.z.object({
    physical: exports.physicalAttributesSchema.default({}),
    personality: exports.personalityAttributesSchema.default({}),
    background: exports.backgroundAttributesSchema.default({}),
    motivation: zod_1.z.string().optional(),
    arc: zod_1.z.string().optional()
});
/**
 * Character relationship schema
 */
exports.relationshipSchema = zod_1.z.object({
    characterId: objectIdSchema,
    relationshipType: zod_1.z.enum([
        'Friend',
        'Enemy',
        'Family',
        'Romantic',
        'Mentor',
        'Colleague',
        'Other'
    ]),
    notes: zod_1.z.string().optional().default('')
});
/**
 * Create character schema
 */
exports.createCharacterSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    shortDescription: zod_1.z.string().optional().default(''),
    detailedBackground: zod_1.z.string().optional().default(''),
    role: zod_1.z.string().optional().default(''),
    attributes: exports.attributesSchema.optional().default({}),
    relationships: zod_1.z.array(exports.relationshipSchema).optional().default([]),
    plotInvolvement: zod_1.z.array(objectIdSchema).optional().default([]),
    imageUrl: zod_1.z.string().optional(),
    notes: zod_1.z.string().optional()
});
/**
 * Update character schema
 */
exports.updateCharacterSchema = exports.createCharacterSchema.partial();
/**
 * Character response schema
 */
exports.characterSchema = exports.createCharacterSchema.extend({
    id: zod_1.z.string(),
    projectId: zod_1.z.string(),
    createdAt: zod_1.z.date(),
    updatedAt: zod_1.z.date()
});
/**
 * Character list schema
 */
exports.characterListSchema = zod_1.z.array(exports.characterSchema);
/**
 * Add relationship schema
 */
exports.addRelationshipSchema = exports.relationshipSchema;
/**
 * Relationship list schema
 */
exports.relationshipListSchema = zod_1.z.array(exports.relationshipSchema);
