/**
 * Project Model
 * 
 * This model stores project information including title, description,
 * genre, target audience, and other project-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';
import {
  PROJECT_GENRES,
  TARGET_AUDIENCES,
  NARRATIVE_TYPES,
  TONES,
  STYLES,
  PROJECT_STATUSES,
  TARGET_LENGTH_TYPES,
  COLLABORATOR_ROLES,
  GenreType,
  TargetAudienceType,
  NarrativeType,
  ToneType,
  StyleType,
  StatusType,
  TargetLengthType,
  CollaboratorRoleType
} from '../types/project.types';

// Interface for Project document
export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  genre: GenreType;
  targetAudience: TargetAudienceType;
  narrativeType: NarrativeType;
  status: StatusType;
  tone: ToneType;
  style: StyleType;
  targetLength: {
    type: TargetLengthType;
    value: number;
  };
  collaborators: Array<{
    userId: mongoose.Types.ObjectId;
    role: CollaboratorRoleType;
  }>;
  metadata: {
    createdWithTemplate: boolean;
    templateId?: mongoose.Types.ObjectId;
    tags: string[];
  };
  completionDate?: Date;
  isPublic?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Project
const ProjectSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  genre: {
    type: String,
    required: true,
    enum: PROJECT_GENRES
  },
  targetAudience: {
    type: String,
    required: true,
    enum: TARGET_AUDIENCES
  },
  narrativeType: {
    type: String,
    required: true,
    enum: NARRATIVE_TYPES
  },
  status: {
    type: String,
    default: 'Draft',
    enum: PROJECT_STATUSES
  },
  tone: {
    type: String,
    default: 'Neutral',
    enum: TONES
  },
  style: {
    type: String,
    default: 'Neutral',
    enum: STYLES
  },
  targetLength: {
    type: {
      type: String,
      enum: TARGET_LENGTH_TYPES,
      default: 'Words'
    },
    value: {
      type: Number,
      default: 0
    }
  },
  collaborators: [{
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: COLLABORATOR_ROLES,
      default: 'Viewer'
    }
  }],
  metadata: {
    createdWithTemplate: {
      type: Boolean,
      default: false
    },
    templateId: {
      type: Schema.Types.ObjectId,
      ref: 'Template'
    },
    tags: [{
      type: String,
      trim: true
    }]
  },
  completionDate: {
    type: Date,
    default: null
  },
  isPublic: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Add text index for search
ProjectSchema.index({ title: 'text', description: 'text' });

// Create and export the model
export default mongoose.model<IProject>('Project', ProjectSchema); 