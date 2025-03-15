/**
 * Plots Model
 * 
 * This model stores plot information including title, description,
 * structure, importance, status, and other plot-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';
import { PLOT_ELEMENT_TYPES, PLOT_TYPES, STRUCTURE_TYPES, PLOT_STATUSES, PlotElementType, PlotType, StructureType, PlotStatusType } from '../types/plot.types';

// Element interface
export interface PlotElement {
  _id?: mongoose.Types.ObjectId;
  type: PlotElementType;
  description: string;
  characters: mongoose.Types.ObjectId[];
  settings: mongoose.Types.ObjectId[];
  objects: mongoose.Types.ObjectId[];
  order: number;
}

// Interface for Plot document
export interface IPlot extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: PlotType;
  structure: StructureType;
  importance: number;
  status: PlotStatusType;
  elements: PlotElement[];
  relatedPlots: mongoose.Types.ObjectId[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Plot
const PlotSchema: Schema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  title: {
    type: String,
    required: [true, 'Plot title is required'],
    trim: true,
    maxlength: [100, 'Plot title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Plot description is required'],
    maxlength: [2000, 'Plot description cannot exceed 2000 characters']
  },
  type: {
    type: String,
    required: [true, 'Plot type is required'],
    enum: {
      values: PLOT_TYPES,
      message: 'Type must be Main Plot, Subplot, or Character Arc'
    }
  },
  structure: {
    type: String,
    enum: {
      values: STRUCTURE_TYPES,
      message: 'Structure must be a valid story structure'
    },
    default: 'Three-Act'
  },
  importance: {
    type: Number,
    min: [1, 'Importance must be between 1 and 5'],
    max: [5, 'Importance must be between 1 and 5'],
    default: 3
  },
  status: {
    type: String,
    enum: {
      values: PLOT_STATUSES,
      message: 'Status must be Planned, In Progress, Completed, or Abandoned'
    },
    default: 'Planned'
  },
  elements: [{
    type: {
      type: String,
      enum: {
        values: PLOT_ELEMENT_TYPES,
        message: 'Element type must be valid'
      },
      required: [true, 'Element type is required']
    },
    description: {
      type: String,
      required: [true, 'Element description is required']
    },
    characters: [{
      type: Schema.Types.ObjectId,
      ref: 'Character'
    }],
    settings: [{
      type: Schema.Types.ObjectId,
      ref: 'Setting'
    }],
    objects: [{
      type: Schema.Types.ObjectId,
      ref: 'Object'
    }],
    order: {
      type: Number,
      required: [true, 'Element order is required']
    }
  }],
  relatedPlots: [{
    type: Schema.Types.ObjectId,
    ref: 'Plot'
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Add text index for search
PlotSchema.index({ title: 'text', description: 'text' });
PlotSchema.index({ projectId: 1 });

// Create and export the model
export default mongoose.model<IPlot>('Plot', PlotSchema); 