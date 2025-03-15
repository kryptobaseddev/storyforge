/**
 * Plot Schemas
 * 
 * This file contains Zod schemas for plot-related data validation.
 */

import { z } from 'zod';
import { ObjectId } from 'mongodb';
import {
  PLOT_ELEMENT_TYPES,
  PLOT_TYPES,
  STRUCTURE_TYPES,
  PLOT_STATUSES,
  PlotElement
} from '../types/plot.types';

// Helper for ObjectId validation
const objectIdSchema = z.string().refine(
  (val) => {
    try {
      new ObjectId(val);
      return true;
    } catch (error) {
      return false;
    }
  },
  { message: 'Invalid ObjectId format' }
);

// Plot element type enum
const plotElementTypeEnum = z.enum(PLOT_ELEMENT_TYPES);

// Plot type enum
const plotTypeEnum = z.enum(PLOT_TYPES);

// Structure type enum
const structureTypeEnum = z.enum(STRUCTURE_TYPES);

// Status enum
const statusEnum = z.enum(PLOT_STATUSES);

// Schema for creating a plot element
export const createPlotElementSchema = z.object({
  type: plotElementTypeEnum,
  description: z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters'),
  characters: z.array(objectIdSchema).optional(),
  settings: z.array(objectIdSchema).optional(),
  objects: z.array(objectIdSchema).optional(),
  order: z.number().int().min(0, 'Order number must be positive')
});

// Schema for updating a plot element
export const updatePlotElementSchema = createPlotElementSchema.partial();

// Schema for a complete plot element (including id)
export const plotElementSchema = createPlotElementSchema.extend({
  id: z.string()
});

// Schema for creating a plot
export const createPlotSchema = z.object({
  projectId: objectIdSchema,
  title: z.string().min(1, 'Title is required').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(1, 'Description is required').max(2000, 'Description cannot exceed 2000 characters'),
  type: plotTypeEnum,
  structure: structureTypeEnum.default('Three-Act'),
  importance: z.number().int().min(1).max(5).default(3),
  status: statusEnum.default('Planned'),
  elements: z.array(createPlotElementSchema).optional(),
  relatedPlots: z.array(objectIdSchema).optional(),
  notes: z.string().optional()
});

// Schema for updating a plot
export const updatePlotSchema = createPlotSchema.partial();

// Schema for a complete plot (including id and timestamps)
export const plotSchema = z.object({
  id: z.string(),
  projectId: z.string(),
  title: z.string(),
  description: z.string(),
  type: plotTypeEnum,
  structure: structureTypeEnum,
  importance: z.number(),
  status: statusEnum,
  elements: z.array(plotElementSchema),
  relatedPlots: z.array(z.string()),
  notes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

// Schema for a list of plots
export const plotListSchema = z.array(plotSchema);

// Types exported for use in other files
export type CreatePlotElementInput = z.infer<typeof createPlotElementSchema>;
export type UpdatePlotElementInput = z.infer<typeof updatePlotElementSchema>;
export type PlotElementResponse = z.infer<typeof plotElementSchema>;
export type CreatePlotInput = z.infer<typeof createPlotSchema>;
export type UpdatePlotInput = z.infer<typeof updatePlotSchema>;
export type PlotResponse = z.infer<typeof plotSchema>; 