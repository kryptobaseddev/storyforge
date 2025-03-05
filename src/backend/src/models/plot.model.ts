/**
 * Plots Model
 * 
 * This model stores plot information including title, description,
 * structure, importance, status, and other plot-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';

// Element type
export type PlotElementType = 'Setup' | 'Inciting Incident' | 'Rising Action' | 
                           'Midpoint' | 'Complications' | 'Crisis' | 
                           'Climax' | 'Resolution' | 'Custom';

// Plot type
export type PlotType = 'Main Plot' | 'Subplot' | 'Character Arc';

// Structure type
export type StructureType = 'Three-Act' | 'Hero\'s Journey' | 'Save the Cat' | 
                          'Seven-Point' | 'Freytag\'s Pyramid' | 
                          'Fichtean Curve' | 'Custom';

// Status type
export type StatusType = 'Planned' | 'In Progress' | 'Completed' | 'Abandoned';

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
  status: StatusType;
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
      values: ['Main Plot', 'Subplot', 'Character Arc'],
      message: 'Type must be Main Plot, Subplot, or Character Arc'
    }
  },
  structure: {
    type: String,
    enum: {
      values: [
        'Three-Act',
        'Hero\'s Journey',
        'Save the Cat',
        'Seven-Point',
        'Freytag\'s Pyramid',
        'Fichtean Curve',
        'Custom'
      ],
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
      values: ['Planned', 'In Progress', 'Completed', 'Abandoned'],
      message: 'Status must be Planned, In Progress, Completed, or Abandoned'
    },
    default: 'Planned'
  },
  elements: [{
    type: {
      type: String,
      enum: {
        values: ['Setup', 'Inciting Incident', 'Rising Action', 'Midpoint', 'Complications', 'Crisis', 'Climax', 'Resolution', 'Custom'],
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