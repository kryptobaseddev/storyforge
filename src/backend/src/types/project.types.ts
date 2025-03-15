/**
 * Project Types
 * 
 * This file contains type definitions and constants related to projects.
 */

/**
 * Project genre constants
 */
export const PROJECT_GENRES = [
  'fantasy', 
  'science fiction', 
  'mystery', 
  'adventure', 
  'historical fiction',
  'realistic fiction',
  'horror',
  'comedy',
  'drama',
  'fairy tale',
  'fable',
  'superhero'
] as const;

export type GenreType = typeof PROJECT_GENRES[number];

/**
 * Target audience constants
 */
export const TARGET_AUDIENCES = [
  'children', 
  'middle grade', 
  'young adult', 
  'adult'
] as const;

export type TargetAudienceType = typeof TARGET_AUDIENCES[number];

/**
 * Narrative type constants
 */
export const NARRATIVE_TYPES = [
  'Short Story', 
  'Novel', 
  'Screenplay', 
  'Comic', 
  'Poem'
] as const;

export type NarrativeType = typeof NARRATIVE_TYPES[number];

/**
 * Project tone constants
 */
export const TONES = [
  'Serious', 
  'Humorous', 
  'Educational', 
  'Dramatic', 
  'Neutral', 
  'Uplifting'
] as const;

export type ToneType = typeof TONES[number];

/**
 * Project style constants
 */
export const STYLES = [
  'Descriptive', 
  'Dialogue-heavy', 
  'Action-oriented', 
  'Poetic', 
  'Neutral'
] as const;

export type StyleType = typeof STYLES[number];

/**
 * Project status constants
 */
export const PROJECT_STATUSES = [
  'Draft', 
  'In Progress', 
  'Completed', 
  'Archived'
] as const;

export type StatusType = typeof PROJECT_STATUSES[number];

/**
 * Target length type constants
 */
export const TARGET_LENGTH_TYPES = [
  'Words', 
  'Pages', 
  'Chapters'
] as const;

export type TargetLengthType = typeof TARGET_LENGTH_TYPES[number];

/**
 * Collaborator role constants
 */
export const COLLABORATOR_ROLES = [
  'Editor', 
  'Viewer', 
  'Contributor'
] as const;

export type CollaboratorRoleType = typeof COLLABORATOR_ROLES[number];

/**
 * Project collaborator interface
 */
export interface ProjectCollaborator {
  userId: string;
  role: CollaboratorRoleType;
}

/**
 * Target length interface
 */
export interface TargetLength {
  type: TargetLengthType;
  value: number;
}

/**
 * Project metadata interface
 */
export interface ProjectMetadata {
  createdWithTemplate: boolean;
  templateId?: string;
  tags: string[];
} 