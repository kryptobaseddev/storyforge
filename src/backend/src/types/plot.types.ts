/**
 * Plot Types
 * 
 * This file contains type definitions and constants related to plots.
 */

/**
 * Plot element type constants
 */
export const PLOT_ELEMENT_TYPES = [
  'Setup',
  'Inciting Incident',
  'Rising Action',
  'Midpoint',
  'Complications',
  'Crisis',
  'Climax',
  'Resolution',
  'Custom'
] as const;

export type PlotElementType = typeof PLOT_ELEMENT_TYPES[number];

/**
 * Plot type constants
 */
export const PLOT_TYPES = [
  'Main Plot',
  'Subplot',
  'Character Arc'
] as const;

export type PlotType = typeof PLOT_TYPES[number];

/**
 * Plot structure type constants
 */
export const STRUCTURE_TYPES = [
  'Three-Act',
  'Hero\'s Journey',
  'Save the Cat',
  'Seven-Point',
  'Freytag\'s Pyramid',
  'Fichtean Curve',
  'Custom'
] as const;

export type StructureType = typeof STRUCTURE_TYPES[number];

/**
 * Plot status constants
 */
export const PLOT_STATUSES = [
  'Planned',
  'In Progress',
  'Completed',
  'Abandoned'
] as const;

export type PlotStatusType = typeof PLOT_STATUSES[number];

/**
 * Plot element interface
 */
export interface PlotElement {
  id?: string;
  type: PlotElementType;
  description: string;
  characters: string[];
  settings: string[];
  objects: string[];
  order: number;
} 