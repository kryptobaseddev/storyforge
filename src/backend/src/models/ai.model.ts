/**
 * AI Generation Model
 * 
 * This model stores information about AI-generated content
 * including request parameters, response content, and metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';
import { 
  AI_TASK_TYPES, 
  AITaskType,
  AIGenerationMetadata
} from '../types/ai.types';

// Interface for AI Generation document
export interface IAIGeneration extends Document {
  projectId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  task: AITaskType;
  requestParams: Record<string, any>;
  responseContent: string;
  metadata: {
    model: string;
    timestamp: Date | string;
    tokenUsage: {
      prompt: number;
      completion: number;
      total: number;
    }
  };
  isSaved: boolean;
  parentId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for AI Generation
const AIGenerationSchema: Schema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: [true, 'Project ID is required']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  task: {
    type: String,
    required: [true, 'AI task type is required'],
    enum: AI_TASK_TYPES
  },
  requestParams: {
    type: Schema.Types.Mixed,
    required: [true, 'Request parameters are required']
  },
  responseContent: {
    type: String,
    required: [true, 'Response content is required']
  },
  metadata: {
    model: {
      type: String,
      required: [true, 'AI model name is required']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    tokenUsage: {
      prompt: {
        type: Number,
        required: [true, 'Prompt token usage is required']
      },
      completion: {
        type: Number,
        required: [true, 'Completion token usage is required']
      },
      total: {
        type: Number,
        required: [true, 'Total token usage is required']
      }
    }
  },
  isSaved: {
    type: Boolean,
    default: false
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'AIGeneration'
  }
}, {
  timestamps: true
});

// Index for faster query by project and user
AIGenerationSchema.index({ projectId: 1, userId: 1 });
AIGenerationSchema.index({ task: 1 });
AIGenerationSchema.index({ isSaved: 1 });

// Index for text search in response content
AIGenerationSchema.index({ responseContent: 'text' });

// Create and export the model
export default mongoose.model<IAIGeneration>('AIGeneration', AIGenerationSchema); 