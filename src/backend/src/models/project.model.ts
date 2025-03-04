/**
 * Project Model
 * 
 * This model stores project information including title, description,
 * genre, target audience, and other project-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Project document
export interface IProject extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  genre: string;
  targetAudience: string;
  narrativeType: string;
  status: string;
  tone: string;
  style: string;
  targetLength: {
    type: string;
    value: number;
  };
  collaborators: Array<{
    userId: mongoose.Types.ObjectId;
    role: string;
  }>;
  metadata: {
    createdWithTemplate: boolean;
    templateId?: mongoose.Types.ObjectId;
    tags: string[];
  };
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
    enum: [
      'fantasy', 
      'science fiction', 
      'mystery', 
      'adventure', 
      'historical fiction',
      'realistic fiction',
      'horror',
      'comedy',
      'drama',
      'fairy tale',
      'fable',
      'superhero'
    ]
  },
  targetAudience: {
    type: String,
    required: true,
    enum: ['children', 'middle grade', 'young adult', 'adult']
  },
  narrativeType: {
    type: String,
    required: true,
    enum: ['Short Story', 'Novel', 'Screenplay', 'Comic', 'Poem']
  },
  status: {
    type: String,
    default: 'Draft',
    enum: ['Draft', 'In Progress', 'Completed', 'Archived']
  },
  tone: {
    type: String,
    default: 'Neutral',
    enum: ['Serious', 'Humorous', 'Educational', 'Dramatic', 'Neutral', 'Uplifting']
  },
  style: {
    type: String,
    default: 'Neutral',
    enum: ['Descriptive', 'Dialogue-heavy', 'Action-oriented', 'Poetic', 'Neutral']
  },
  targetLength: {
    type: {
      type: String,
      enum: ['Words', 'Pages', 'Chapters'],
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
      enum: ['Editor', 'Viewer', 'Contributor'],
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
  }
}, {
  timestamps: true
});

// Add text index for search
ProjectSchema.index({ title: 'text', description: 'text' });

// Create and export the model
export default mongoose.model<IProject>('Project', ProjectSchema); 