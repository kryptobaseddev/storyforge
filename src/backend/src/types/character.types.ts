/**
 * Character Types
 * 
 * This file contains type definitions and constants related to characters.
 */

/**
 * Character role constants
 */
export const CHARACTER_ROLES = [
  'Protagonist', 
  'Antagonist', 
  'Supporting', 
  'Minor'
] as const;

export type CharacterRole = typeof CHARACTER_ROLES[number];

/**
 * Relationship type constants
 */
export const RELATIONSHIP_TYPES = [
  'Friend', 
  'Enemy', 
  'Family', 
  'Romantic', 
  'Mentor', 
  'Colleague', 
  'Other'
] as const;

export type RelationshipType = typeof RELATIONSHIP_TYPES[number];

/**
 * Relationship family constants
 */
export const RELATIONSHIP_FAMILIES = [
  'Parent', 
  'Child', 
  'Sibling', 
  'Spouse', 
  'Other'
] as const;

export type RelationshipFamily = typeof RELATIONSHIP_FAMILIES[number];

/**
 * Relationship status constants
 */
export const RELATIONSHIP_STATUSES = [
  'Strong', 
  'Friendly', 
  'Neutral', 
  'Complex',
  'Hostile',
  'Unknown'
] as const;

export type RelationshipStatus = typeof RELATIONSHIP_STATUSES[number];

/**
 * Character relationship structure
 */
export interface CharacterRelationship {
  characterId: string;
  relationshipType: RelationshipType;
  relationshipFamily: RelationshipFamily;
  relationshipStatus: RelationshipStatus;
  notes?: string;
} 