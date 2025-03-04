/**
 * Plotline Model
 * 
 * This model stores plot information including title, description,
 * structure, importance, status, and other plot-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Plotline document
export interface IPlotline extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  type: string;
  structure: string;
  importance: number;
  status: string;
  elements: Array<{
    type: string;
    description: string;
    characters: mongoose.Types.ObjectId[];
    settings: mongoose.Types.ObjectId[];
    objects: mongoose.Types.ObjectId[];
    order: number;
  }>;
  relatedPlotlines: mongoose.Types.ObjectId[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Plotline
const PlotlineSchema: Schema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Main Plot', 'Subplot', 'Character Arc']
  },
  structure: {
    type: String,
    enum: [
      'Three-Act',
      'Hero\'s Journey',
      'Save the Cat',
      'Seven-Point',
      'Freytag\'s Pyramid',
      'Fichtean Curve',
      'Custom'
    ],
    default: 'Three-Act'
  },
  importance: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  },
  status: {
    type: String,
    enum: ['Planned', 'In Progress', 'Completed', 'Abandoned'],
    default: 'Planned'
  },
  elements: [{
    type: {
      type: String,
      enum: ['Setup', 'Inciting Incident', 'Rising Action', 'Midpoint', 'Complications', 'Crisis', 'Climax', 'Resolution', 'Custom'],
      required: true
    },
    description: {
      type: String,
      required: true
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
      required: true
    }
  }],
  relatedPlotlines: [{
    type: Schema.Types.ObjectId,
    ref: 'Plotline'
  }],
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Add text index for search
PlotlineSchema.index({ title: 'text', description: 'text' });

// Create and export the model
export default mongoose.model<IPlotline>('Plotline', PlotlineSchema); 