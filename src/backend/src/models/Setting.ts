/**
 * Setting Model
 * 
 * This file defines the schema for story settings, including locations, time periods,
 * and world-building elements.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ISetting extends Document {
  name: string;
  description: string;
  type: 'location' | 'time_period' | 'world_element';
  details: {
    [key: string]: any;
  };
  project: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
  created_at: Date;
  updated_at: Date;
}

const SettingSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Setting name is required'],
      trim: true,
      maxlength: [100, 'Setting name cannot exceed 100 characters']
    },
    description: {
      type: String,
      required: [true, 'Setting description is required'],
      trim: true,
      maxlength: [2000, 'Setting description cannot exceed 2000 characters']
    },
    type: {
      type: String,
      required: [true, 'Setting type is required'],
      enum: {
        values: ['location', 'time_period', 'world_element'],
        message: 'Setting type must be location, time_period, or world_element'
      }
    },
    details: {
      type: Schema.Types.Mixed,
      default: {}
    },
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
SettingSchema.index({ project: 1, type: 1 });
SettingSchema.index({ name: 'text', description: 'text' });

export default mongoose.model<ISetting>('Setting', SettingSchema); 