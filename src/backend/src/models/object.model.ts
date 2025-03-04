/**
 * Object Model
 * 
 * This model stores information about objects/items in the story,
 * including name, description, properties, and other object-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';

// Interface for Object document
export interface IObject extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  type: string;
  significance: string;
  properties: {
    physical: {
      size: string;
      material: string;
      appearance: string;
    };
    magical?: {
      powers: string[];
      limitations: string[];
      origin: string;
    };
  };
  history: string;
  location?: mongoose.Types.ObjectId;
  owner?: mongoose.Types.ObjectId;
  imageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Object
const ObjectSchema: Schema = new Schema({
  projectId: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Item', 'Artifact', 'Vehicle', 'Weapon', 'Tool', 'Clothing', 'Other']
  },
  significance: {
    type: String,
    default: ''
  },
  properties: {
    physical: {
      size: {
        type: String,
        default: ''
      },
      material: {
        type: String,
        default: ''
      },
      appearance: {
        type: String,
        default: ''
      }
    },
    magical: {
      powers: [{
        type: String
      }],
      limitations: [{
        type: String
      }],
      origin: {
        type: String,
        default: ''
      }
    }
  },
  history: {
    type: String,
    default: ''
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Setting'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Character'
  },
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
ObjectSchema.index({ name: 'text', description: 'text', history: 'text' });

// Create and export the model
export default mongoose.model<IObject>('Object', ObjectSchema); 