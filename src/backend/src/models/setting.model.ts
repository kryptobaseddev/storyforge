/**
 * Setting Model
 * 
 * This model stores setting information including name, description,
 * details, and other setting-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';
import { SETTING_TYPES, SettingType } from '../types/setting.types';

// Interface for Setting document
export interface ISetting extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  type: SettingType;
  details: {
    geography: string;
    climate: string;
    architecture: string;
    culture: string;
    history: string;
    government: string;
    economy: string;
    technology: string;
  };
  map?: {
    imageUrl: string;
    coordinates: any;
  };
  relatedSettings: mongoose.Types.ObjectId[];
  characters: mongoose.Types.ObjectId[];
  objects: mongoose.Types.ObjectId[];
  imageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Setting
const SettingSchema: Schema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  name: {
    type: String,
    required: [true, 'Setting name is required'],
    trim: true,
    maxlength: [100, 'Setting name cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Setting description is required'],
    maxlength: [2000, 'Setting description cannot exceed 2000 characters']
  },
  type: {
    type: String,
    required: [true, 'Setting type is required'],
    enum: {
      values: SETTING_TYPES,
      message: 'Type must be a valid setting type'
    }
  },
  details: {
    geography: {
      type: String,
      default: ''
    },
    climate: {
      type: String,
      default: ''
    },
    architecture: {
      type: String,
      default: ''
    },
    culture: {
      type: String,
      default: ''
    },
    history: {
      type: String,
      default: ''
    },
    government: {
      type: String,
      default: ''
    },
    economy: {
      type: String,
      default: ''
    },
    technology: {
      type: String,
      default: ''
    }
  },
  map: {
    imageUrl: {
      type: String
    },
    coordinates: {
      type: Schema.Types.Mixed
    }
  },
  relatedSettings: [{
    type: Schema.Types.ObjectId,
    ref: 'Setting'
  }],
  characters: [{
    type: Schema.Types.ObjectId,
    ref: 'Character'
  }],
  objects: [{
    type: Schema.Types.ObjectId,
    ref: 'Object'
  }],
  imageUrl: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Add text index for search
SettingSchema.index({ name: 'text', description: 'text' });
SettingSchema.index({ projectId: 1 });

// Create and export the model
export default mongoose.model<ISetting>('Setting', SettingSchema); 