/**
 * Chapter Types
 * 
 * This file contains type definitions and constants related to chapters.
 */

/**
 * Chapter status constants
 */
export const CHAPTER_STATUSES = [
  'Draft', 
  'Revised', 
  'Final', 
  'Needs Review'
] as const;

export type ChapterStatus = typeof CHAPTER_STATUSES[number];

/**
 * Chapter edit interface
 */
export interface ChapterEdit {
  timestamp: Date;
  userId: string;
  changes: string;
}

/**
 * AI generation metadata interface
 */
export interface AiGenerated {
  isGenerated: boolean;
  generatedTimestamp?: Date;
  prompt?: string;
  model?: string;
}


