/**
 * Plot Model
 * 
 * This file defines the schema for story plots, including plot points,
 * story arcs, and narrative structure.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IPlotPoint {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  sequence: number;
  type: 'exposition' | 'rising_action' | 'climax' | 'falling_action' | 'resolution' | 'custom';
  characters?: mongoose.Types.ObjectId[];
  settings?: mongoose.Types.ObjectId[];
}

export interface IPlot extends Document {
  title: string;
  description: string;
  structure_type: 'three_act' | 'hero_journey' | 'save_the_cat' | 'custom';
  plot_points: IPlotPoint[];
  project: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const PlotPointSchema: Schema = new Schema({
  title: {
    type: String,
    required: [true, 'Plot point title is required'],
    trim: true,
    maxlength: [100, 'Plot point title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Plot point description is required'],
    trim: true,
    maxlength: [2000, 'Plot point description cannot exceed 2000 characters']
  },
  sequence: {
    type: Number,
    required: [true, 'Sequence number is required'],
    min: [0, 'Sequence number must be positive']
  },
  type: {
    type: String,
    required: [true, 'Plot point type is required'],
    enum: {
      values: ['exposition', 'rising_action', 'climax', 'falling_action', 'resolution', 'custom'],
      message: 'Plot point type must be valid'
    }
  },
  characters: [{
    type: Schema.Types.ObjectId,
    ref: 'Character'
  }],
  settings: [{
    type: Schema.Types.ObjectId,
    ref: 'Setting'
  }]
});

const PlotSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Plot title is required'],
      trim: true,
      maxlength: [100, 'Plot title cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Plot description is required'],
      trim: true,
      maxlength: [2000, 'Plot description cannot exceed 2000 characters']
    },
    structure_type: {
      type: String,
      required: [true, 'Structure type is required'],
      enum: {
        values: ['three_act', 'hero_journey', 'save_the_cat', 'custom'],
        message: 'Structure type must be valid'
      }
    },
    plot_points: [PlotPointSchema],
    project: {
      type: Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Project ID is required']
    },
    created_by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required']
    }
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Index for faster queries
PlotSchema.index({ project: 1 });
PlotSchema.index({ title: 'text', description: 'text' });

export default mongoose.model<IPlot>('Plot', PlotSchema); 