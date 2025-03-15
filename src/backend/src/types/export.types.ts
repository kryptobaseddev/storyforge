/**
 * Export Types
 * 
 * This file contains type definitions and constants related to exports.
 */

/**
 * Export format constants
 */
export const EXPORT_FORMATS = [
  'PDF',
  'EPUB',
  'DOCX',
  'Markdown',
  'HTML'
] as const;

export type ExportFormat = typeof EXPORT_FORMATS[number];

/**
 * Export status constants
 */
export const EXPORT_STATUSES = [
  'Pending',
  'Processing',
  'Completed',
  'Failed'
] as const;

export type ExportStatus = typeof EXPORT_STATUSES[number];

/**
 * Page size constants
 */
export const PAGE_SIZES = [
  'A4',
  'A5',
  'Letter',
  'Legal',
  'Custom'
] as const;

export type PageSize = typeof PAGE_SIZES[number];

/**
 * Export configuration interface
 */
export interface ExportConfig {
  includeChapters: string[];
  includeTitlePage: boolean;
  includeTableOfContents: boolean;
  includeCharacterList: boolean;
  includeSettingDescriptions: boolean;
  customCss?: string;
  templateId?: string;
  pageSize: PageSize;
  fontFamily: string;
  fontSize: number;
} 