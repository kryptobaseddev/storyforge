/**
 * Chapter Model
 * 
 * This file defines the schema for story chapters, including content,
 * metadata, and relationships to characters, settings, and plots.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IChapter extends Document {
  title: string;
  content: string;
  synopsis: string;
  order: number;
  status: 'draft' | 'review' | 'final';
  word_count: number;
  project: mongoose.Types.ObjectId;
  created_by: mongoose.Types.ObjectId;
  characters: mongoose.Types.ObjectId[];
  settings: mongoose.Types.ObjectId[];
  plot_points: mongoose.Types.ObjectId[];
  notes: string;
  ai_generated: boolean;
  ai_generation_data?: {
    prompt: string;
    model: string;
    timestamp: Date;
  };
  edits: Array<{
    timestamp: Date;
    edited_by: mongoose.Types.ObjectId;
    notes: string;
  }>;
  created_at: Date;
  updated_at: Date;
}

const ChapterSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Chapter title is required'],
      trim: true,
      maxlength: [100, 'Chapter title cannot exceed 100 characters']
    },
    content: {
      type: String,
      required: [true, 'Chapter content is required'],
      trim: true
    },
    synopsis: {
      type: String,
      required: [true, 'Chapter synopsis is required'],
      trim: true,
      maxlength: [1000, 'Chapter synopsis cannot exceed 1000 characters']
    },
    order: {
      type: Number,
      required: [true, 'Chapter order is required'],
      min: [0, 'Chapter order must be positive']
    },
    status: {
      type: String,
      required: [true, 'Chapter status is required'],
      enum: {
        values: ['draft', 'review', 'final'],
        message: 'Chapter status must be draft, review, or final'
      },
      default: 'draft'
    },
    word_count: {
      type: Number,
      default: 0
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
    },
    characters: [{
      type: Schema.Types.ObjectId,
      ref: 'Character'
    }],
    settings: [{
      type: Schema.Types.ObjectId,
      ref: 'Setting'
    }],
    plot_points: [{
      type: Schema.Types.ObjectId,
      ref: 'Plot.plot_points'
    }],
    notes: {
      type: String,
      default: ''
    },
    ai_generated: {
      type: Boolean,
      default: false
    },
    ai_generation_data: {
      prompt: String,
      model: String,
      timestamp: Date
    },
    edits: [{
      timestamp: {
        type: Date,
        default: Date.now
      },
      edited_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      notes: String
    }]
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

// Pre-save hook to calculate word count
ChapterSchema.pre('save', function(next) {
  if (this.content) {
    const content = this.content as string;
    this.word_count = content.split(/\s+/).filter((word: string) => word.length > 0).length;
  }
  next();
});

// Index for faster queries
ChapterSchema.index({ project: 1, order: 1 });
ChapterSchema.index({ title: 'text', synopsis: 'text', content: 'text' });

export default mongoose.model<IChapter>('Chapter', ChapterSchema); 