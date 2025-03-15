/**
 * Chapter Model
 * 
 * This model stores chapter information including title, position,
 * content, and other chapter-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';
import { CHAPTER_STATUSES, ChapterStatus } from '../types/chapter.types';
// Interface for Chapter document
export interface IChapter extends Document {
  projectId: mongoose.Types.ObjectId;
  title: string;
  position: number;
  synopsis: string;
  content: string;
  status: ChapterStatus;
  wordCount: number;
  characters: mongoose.Types.ObjectId[];
  settings: mongoose.Types.ObjectId[];
  plots: mongoose.Types.ObjectId[];
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
    required: [true, 'Project ID is required']
  },
  title: {
    type: String,
    required: [true, 'Chapter title is required'],
    trim: true,
    maxlength: [100, 'Chapter title cannot exceed 100 characters']
  },
  position: {
    type: Number,
    required: [true, 'Chapter position is required'],
    min: [0, 'Chapter position must be a positive number']
  },
  synopsis: {
    type: String,
    required: [true, 'Chapter synopsis is required'],
    trim: true,
    maxlength: [1000, 'Chapter synopsis cannot exceed 1000 characters'],
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: {
      values: CHAPTER_STATUSES,
      message: 'Status must be Draft, Revised, Final, or Needs Review'
    },
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
  plots: [{
    type: Schema.Types.ObjectId,
    ref: 'Plot'
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
      ref: 'User',
      required: true
    },
    changes: {
      type: String,
      required: true
    }
  }]
}, {
  timestamps: true
});

// Pre-save hook to calculate word count
ChapterSchema.pre('save', function(next) {
  if (this.content) {
    const content = this.content as string;
    this.wordCount = content.split(/\s+/).filter((word: string) => word.length > 0).length;
  }
  next();
});

// Index for faster query by project and position
ChapterSchema.index({ projectId: 1, position: 1 }, { unique: true });

// Index for text search
ChapterSchema.index({ title: 'text', synopsis: 'text', content: 'text' });

// Create and export the model
export default mongoose.model<IChapter>('Chapter', ChapterSchema); 