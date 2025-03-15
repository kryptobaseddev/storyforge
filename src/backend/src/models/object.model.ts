/**
 * Object Model
 * 
 * This model stores information about objects/items in the story,
 * including name, description, properties, and other object-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';
import { OBJECT_TYPES, ObjectType, CONNECTION_TYPES, ConnectionType } from '../types/object.types';
// Interface for Object document
export interface IObject extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  type: ObjectType;
  significance: string;
  culturalSignificance?: string;
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
      energySource?: string;
      activationMethod?: string;
      sideEffects?: string[];
      rarity?: string;
    };
  };
  history: string;
  timelineEvents: Array<{
    date: string;
    title: string;
    description: string;
    importance: number;
  }>;
  location?: mongoose.Types.ObjectId;
  owner?: mongoose.Types.ObjectId;
  connections: Array<{
    type: ConnectionType;
    entityId: mongoose.Types.ObjectId;
    description: string;
  }>;
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
    enum: OBJECT_TYPES
  },
  significance: {
    type: String,
    default: ''
  },
  culturalSignificance: {
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
      },
      energySource: {
        type: String,
        default: ''
      },
      activationMethod: {
        type: String,
        default: ''
      },
      sideEffects: [{
        type: String
      }],
      rarity: {
        type: String,
        default: ''
      }
    }
  },
  history: {
    type: String,
    default: ''
  },
  timelineEvents: [{
    date: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    importance: {
      type: Number,
      min: 1,
      max: 10,
      default: 5
    }
  }],
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Setting'
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Character'
  },
  connections: [{
    type: {
      type: String,
      enum: CONNECTION_TYPES,
      required: true
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'connections.type'
    },
    description: {
      type: String,
      default: ''
    }
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
ObjectSchema.index({ 
  name: 'text', 
  description: 'text', 
  history: 'text',
  'timelineEvents.title': 'text',
  'timelineEvents.description': 'text',
  culturalSignificance: 'text'
});

// Create and export the model
export default mongoose.model<IObject>('Object', ObjectSchema); 