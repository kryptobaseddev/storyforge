/**
 * AI Generation Model
 * 
 * This model stores records of AI-generated content, including
 * the request parameters, response content, and metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';
import { AITaskType } from '../ai/types';

// Interface for AI generation document
export interface IAIGeneration extends Document {
  project_id: mongoose.Types.ObjectId;
  user_id: mongoose.Types.ObjectId;
  task: AITaskType;
  request_params: Record<string, any>;
  response_content: string;
  metadata: {
    model: string;
    timestamp: Date;
    token_usage: {
      prompt: number;
      completion: number;
      total: number;
    }
  };
  created_at: Date;
  is_saved: boolean;
  parent_id?: mongoose.Types.ObjectId;
}

// Schema for AI generation
const AIGenerationSchema: Schema = new Schema({
  project_id: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  task: {
    type: String,
    enum: ['character', 'plot', 'setting', 'chapter', 'editorial'],
    required: true
  },
  request_params: {
    type: Object,
    required: true
  },
  response_content: {
    type: String,
    required: true
  },
  metadata: {
    model: String,
    timestamp: Date,
    token_usage: {
      prompt: Number,
      completion: Number,
      total: Number
    }
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  is_saved: {
    type: Boolean,
    default: false
  },
  parent_id: {
    type: Schema.Types.ObjectId,
    ref: 'AIGeneration'
  }
});

// Create and export the model
export default mongoose.model<IAIGeneration>('AIGeneration', AIGenerationSchema); 