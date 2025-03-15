/**
 * Character Model
 * 
 * This model stores character information including name, description,
 * attributes, relationships, and other character-related metadata.
 */

import mongoose, { Schema, Document } from 'mongoose';
import { 
  CHARACTER_ROLES,
  RELATIONSHIP_TYPES, 
  RELATIONSHIP_FAMILIES, 
  RELATIONSHIP_STATUSES,
  CharacterRole,
  RelationshipType,
  RelationshipFamily,
  RelationshipStatus
} from '../types/character.types';

// Interface for Character document
export interface ICharacter extends Document {
  projectId: mongoose.Types.ObjectId;
  name: string;
  shortDescription: string;
  detailedBackground: string;
  role: CharacterRole;
  attributes: {
    physical: {
      age: number;
      height: string;
      build: string;
      hairColor: string;
      eyeColor: string;
      distinguishingFeatures: string[];
    };
    personality: {
      traits: string[];
      strengths: string[];
      weaknesses: string[];
      fears: string[];
      desires: string[];
    };
    background: {
      birthplace: string;
      family: string;
      education: string;
      occupation: string;
      significantEvents: string[];
    };
    motivation: string;
    arc: string;
  };
  relationships: Array<{
    characterId: mongoose.Types.ObjectId;
    relationshipType: RelationshipType;
    relationshipFamily: RelationshipFamily;
    relationshipStatus: RelationshipStatus;
    notes: string;
  }>;
  plotInvolvement: mongoose.Types.ObjectId[];
  possessions: mongoose.Types.ObjectId[];
  imageUrl?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Schema for Character
const CharacterSchema: Schema = new Schema({
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
  shortDescription: {
    type: String,
    required: true
  },
  detailedBackground: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    required: true,
    enum: CHARACTER_ROLES
  },
  attributes: {
    physical: {
      age: {
        type: Number,
        default: 0
      },
      height: {
        type: String,
        default: ''
      },
      build: {
        type: String,
        default: ''
      },
      hairColor: {
        type: String,
        default: ''
      },
      eyeColor: {
        type: String,
        default: ''
      },
      distinguishingFeatures: [{
        type: String
      }]
    },
    personality: {
      traits: [{
        type: String
      }],
      strengths: [{
        type: String
      }],
      weaknesses: [{
        type: String
      }],
      fears: [{
        type: String
      }],
      desires: [{
        type: String
      }]
    },
    background: {
      birthplace: {
        type: String,
        default: ''
      },
      family: {
        type: String,
        default: ''
      },
      education: {
        type: String,
        default: ''
      },
      occupation: {
        type: String,
        default: ''
      },
      significantEvents: [{
        type: String
      }]
    },
    motivation: {
      type: String,
      default: ''
    },
    arc: {
      type: String,
      default: ''
    }
  },
  relationships: [{
    characterId: {
      type: Schema.Types.ObjectId,
      ref: 'Character'
    },
    relationshipType: {
      type: String,
      enum: RELATIONSHIP_TYPES
    },
    relationshipFamily: {
      type: String,
      enum: RELATIONSHIP_FAMILIES
    },
    relationshipStatus: {
      type: String,
      enum: RELATIONSHIP_STATUSES
    },
    notes: {
      type: String,
      default: ''
    }
  }],
  plotInvolvement: [{
    type: Schema.Types.ObjectId,
    ref: 'Plot'
  }],
  possessions: [{
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
CharacterSchema.index({ name: 'text', shortDescription: 'text' });

// Create and export the model
export default mongoose.model<ICharacter>('Character', CharacterSchema); 