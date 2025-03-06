"use strict";
/**
 * Character Router
 *
 * This file contains all tRPC procedures related to character management.
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
exports.characterRouter = void 0;
const character_model_1 = __importDefault(require("../models/character.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const server_1 = require("@trpc/server");
const zod_1 = require("zod");
const trpc_1 = require("../trpc");
const character_schema_1 = require("../schemas/character.schema");
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
 * Helper function to convert character document to response object
 */
const characterToResponse = (character) => {
    const id = character._id ? character._id.toString() : '';
    const projectId = character.projectId ? character.projectId.toString() : '';
    return {
        id,
        projectId,
        name: character.name,
        shortDescription: character.shortDescription || '',
        detailedBackground: character.detailedBackground || '',
        role: character.role || '',
        attributes: character.attributes || {},
        relationships: character.relationships.map((rel) => ({
            characterId: rel.characterId.toString(),
            relationshipType: rel.relationshipType,
            notes: rel.notes || ''
        })),
        plotInvolvement: character.plotInvolvement.map((id) => id.toString()),
        imageUrl: character.imageUrl,
        notes: character.notes,
        createdAt: character.createdAt,
        updatedAt: character.updatedAt
    };
};
exports.characterRouter = (0, trpc_1.router)({
    /**
     * Create a new character
     */
    create: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        character: character_schema_1.createCharacterSchema
    }))
        .output(character_schema_1.characterSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, character } = input;
            // Check if user has access to the project
            yield checkProjectAccess(projectId, userId);
            // Create new character
            const newCharacter = new character_model_1.default(Object.assign(Object.assign({}, character), { projectId: new mongodb_1.ObjectId(projectId) }));
            yield newCharacter.save();
            return characterToResponse(newCharacter);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Create character error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to create character',
            });
        }
    })),
    /**
     * Get all characters for a project
     */
    getAll: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string()
    }))
        .output(character_schema_1.characterListSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId } = input;
            // Check if user has access to the project
            yield checkProjectAccess(projectId, userId);
            // Get all characters for the project
            const characters = yield character_model_1.default.find({ projectId });
            return characters.map(characterToResponse);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Get all characters error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve characters',
            });
        }
    })),
    /**
     * Get a character by ID
     */
    getById: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        characterId: zod_1.z.string()
    }))
        .output(character_schema_1.characterSchema)
        .query((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, characterId } = input;
            // Check if user has access to the project
            yield checkProjectAccess(projectId, userId);
            // Get character
            const character = yield character_model_1.default.findOne({
                _id: characterId,
                projectId
            });
            if (!character) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Character not found',
                });
            }
            return characterToResponse(character);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Get character by ID error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to retrieve character',
            });
        }
    })),
    /**
     * Update a character
     */
    update: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        characterId: zod_1.z.string(),
        data: character_schema_1.updateCharacterSchema
    }))
        .output(character_schema_1.characterSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, characterId, data } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update this character',
                });
            }
            // Get and update character
            const character = yield character_model_1.default.findOne({
                _id: characterId,
                projectId
            });
            if (!character) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Character not found',
                });
            }
            // Update character fields
            Object.assign(character, data);
            yield character.save();
            return characterToResponse(character);
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Update character error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update character',
            });
        }
    })),
    /**
     * Delete a character
     */
    delete: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        characterId: zod_1.z.string()
    }))
        .output(zod_1.z.object({ success: zod_1.z.boolean() }))
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, characterId } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to delete (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to delete this character',
                });
            }
            // Delete character
            const result = yield character_model_1.default.deleteOne({
                _id: characterId,
                projectId
            });
            if (result.deletedCount === 0) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Character not found',
                });
            }
            // Also update relationships in other characters
            yield character_model_1.default.updateMany({ projectId, 'relationships.characterId': characterId }, { $pull: { relationships: { characterId: characterId } } });
            return { success: true };
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Delete character error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to delete character',
            });
        }
    })),
    /**
     * Add relationship to a character
     */
    addRelationship: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        characterId: zod_1.z.string(),
        relationship: character_schema_1.addRelationshipSchema
    }))
        .output(character_schema_1.relationshipListSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, characterId, relationship } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update character relationships',
                });
            }
            // Get character
            const character = yield character_model_1.default.findOne({
                _id: characterId,
                projectId
            });
            if (!character) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Character not found',
                });
            }
            // Check if related character exists
            const relatedCharacter = yield character_model_1.default.findOne({
                _id: relationship.characterId,
                projectId
            });
            if (!relatedCharacter) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Related character not found',
                });
            }
            // Check if relationship already exists
            const existingRelationship = character.relationships.find((rel) => rel.characterId.toString() === relationship.characterId);
            if (existingRelationship) {
                throw new server_1.TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Relationship already exists',
                });
            }
            // Add relationship
            character.relationships.push({
                characterId: new mongodb_1.ObjectId(relationship.characterId),
                relationshipType: relationship.relationshipType,
                notes: relationship.notes || ''
            });
            yield character.save();
            return character.relationships.map((rel) => ({
                characterId: rel.characterId.toString(),
                relationshipType: rel.relationshipType,
                notes: rel.notes || ''
            }));
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Add relationship error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to add relationship',
            });
        }
    })),
    /**
     * Update a relationship
     */
    updateRelationship: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        characterId: zod_1.z.string(),
        relatedCharacterId: zod_1.z.string(),
        data: zod_1.z.object({
            relationshipType: zod_1.z.enum([
                'Friend',
                'Enemy',
                'Family',
                'Romantic',
                'Mentor',
                'Colleague',
                'Other'
            ]).optional(),
            notes: zod_1.z.string().optional()
        })
    }))
        .output(character_schema_1.relationshipListSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, characterId, relatedCharacterId, data } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update character relationships',
                });
            }
            // Get character
            const character = yield character_model_1.default.findOne({
                _id: characterId,
                projectId
            });
            if (!character) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Character not found',
                });
            }
            // Find relationship
            const relationshipIndex = character.relationships.findIndex((rel) => rel.characterId.toString() === relatedCharacterId);
            if (relationshipIndex === -1) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Relationship not found',
                });
            }
            // Update relationship
            const relationship = character.relationships[relationshipIndex];
            if (data.relationshipType) {
                relationship.relationshipType = data.relationshipType;
            }
            if (data.notes !== undefined) {
                relationship.notes = data.notes;
            }
            yield character.save();
            return character.relationships.map((rel) => ({
                characterId: rel.characterId.toString(),
                relationshipType: rel.relationshipType,
                notes: rel.notes || ''
            }));
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Update relationship error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to update relationship',
            });
        }
    })),
    /**
     * Remove a relationship
     */
    removeRelationship: trpc_1.protectedProcedure
        .input(zod_1.z.object({
        projectId: zod_1.z.string(),
        characterId: zod_1.z.string(),
        relatedCharacterId: zod_1.z.string()
    }))
        .output(character_schema_1.relationshipListSchema)
        .mutation((_a) => __awaiter(void 0, [_a], void 0, function* ({ ctx, input }) {
        try {
            const userId = ctx.user.id;
            const { projectId, characterId, relatedCharacterId } = input;
            // Check if user has access to the project
            const { project, isOwner } = yield checkProjectAccess(projectId, userId);
            // Check if user has permission to edit (owner or editor)
            const isEditor = project.collaborators.some((c) => c.userId.toString() === userId && c.role === 'Editor');
            if (!isOwner && !isEditor) {
                throw new server_1.TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You do not have permission to update character relationships',
                });
            }
            // Get character
            const character = yield character_model_1.default.findOne({
                _id: characterId,
                projectId
            });
            if (!character) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Character not found',
                });
            }
            // Find relationship
            const relationshipIndex = character.relationships.findIndex((rel) => rel.characterId.toString() === relatedCharacterId);
            if (relationshipIndex === -1) {
                throw new server_1.TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Relationship not found',
                });
            }
            // Remove relationship
            character.relationships.splice(relationshipIndex, 1);
            yield character.save();
            return character.relationships.map((rel) => ({
                characterId: rel.characterId.toString(),
                relationshipType: rel.relationshipType,
                notes: rel.notes || ''
            }));
        }
        catch (error) {
            if (error instanceof server_1.TRPCError) {
                throw error;
            }
            console.error('Remove relationship error:', error);
            throw new server_1.TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Failed to remove relationship',
            });
        }
    }))
});
