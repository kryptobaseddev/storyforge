/**
 * Chapter Model
 * 
 * This model stores chapter information including title, position,
 * content, and other chapter-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Chapter document
export interface IChapter extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  position: number;
  synopsis: string;
  content: string;
  status: string;
  wordCount: number;
  characters: mongoose.Types.ObjectId[];
  settings: mongoose.Types.ObjectId[];
  plotlines: mongoose.Types.ObjectId[];
  objects: mongoose.Types.ObjectId[];
  notes?: string;
  aiGenerated: {
    isGenerated: boolean;
    generatedTimestamp?: Date;
    prompt?: string;
    model?: string;
  };
  edits: Array<{
    timestamp: Date;
    userId: mongoose.Types.ObjectId;
    changes: string;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Chapter
const ChapterSchema: Schema = new Schema({
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
  position: {
    type: Number,
    required: true
  },
  synopsis: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['Draft', 'Revised', 'Final', 'Needs Review'],
    default: 'Draft'
  },
  wordCount: {
    type: Number,
    default: 0
  },
  characters: [{
    type: Schema.Types.ObjectId,
    ref: 'Character'
  }],
  settings: [{
    type: Schema.Types.ObjectId,
    ref: 'Setting'
  }],
  plotlines: [{
    type: Schema.Types.ObjectId,
    ref: 'Plotline'
  }],
  objects: [{
    type: Schema.Types.ObjectId,
    ref: 'Object'
  }],
  notes: {
    type: String
  },
  aiGenerated: {
    isGenerated: {
      type: Boolean,
      default: false
    },
    generatedTimestamp: {
      type: Date
    },
    prompt: {
      type: String
    },
    model: {
      type: String
    }
  },
  edits: [{
    timestamp: {
      type: Date,
      default: Date.now
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    changes: {
      type: String
    }
  }]
}, {
  timestamps: true
});

// Index for faster query by project and position
ChapterSchema.index({ projectId: 1, position: 1 }, { unique: true });

// Index for text search
ChapterSchema.index({ title: 'text', synopsis: 'text', content: 'text' });

// Create and export the model
export default mongoose.model<IChapter>('Chapter', ChapterSchema); 