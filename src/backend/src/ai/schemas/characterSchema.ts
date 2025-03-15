/**
 * Character Schema
 * 
 * This file defines the TypeScript interfaces for character data structures
 * used throughout the application, particularly for AI-generated character content.
 */

// TODO: clean up and replace this character schema with the one in the character.schema.ts file

// Base character relationship interface
export interface CharacterRelationship {
  with: string;         // Name of the related character or "potential" for planned relationships
  type: string;         // Type of relationship (friend, enemy, mentor, etc.)
  dynamics: string;     // Brief description of relationship dynamics
  strength?: number;    // Optional strength indicator (1-10)
}

// Complete character interface with all possible properties
export interface Character {
  name: string;
  shortDescription: string;
  background: string;
  physicalTraits: string[];
  personalityTraits: string[];
  goals: string[];
  fears: string[];
  skills: string[];
  voice: string;
  role: string;
  relationships: CharacterRelationship[];
  arc: string;
  
  // Optional properties that may be added during expansion
  age?: string;
  occupation?: string;
  nationality?: string;
  education?: string;
  socioeconomicStatus?: string;
  religion?: string;
  politicalViews?: string;
  hobbies?: string[];
  quirks?: string[];
  secrets?: string[];
  backstory?: {
    childhood?: string;
    adolescence?: string;
    adulthood?: string;
    keyEvents?: {
      event: string;
      impact: string;
      age?: number;
    }[];
  };
  
  // Metadata fields
  createdAt?: Date;
  updatedAt?: Date;
  aiGenerated?: boolean;
  editedByUser?: boolean;
}

// Character template for initial creation with minimal required fields
export type CharacterTemplate = Pick<Character, 
  'name' | 
  'shortDescription' | 
  'role'
>;

// Character expansion for background focus
export interface CharacterBackgroundExpansion {
  background: string;
  backstory: {
    childhood: string;
    adolescence?: string;
    adulthood?: string;
    keyEvents: {
      event: string;
      impact: string;
      age?: number;
    }[];
  };
}

// Character expansion for relationships focus
export interface CharacterRelationshipsExpansion {
  relationships: CharacterRelationship[];
}

// Character expansion for development focus
export interface CharacterDevelopmentExpansion {
  arc: string;
  developmentStages?: {
    incitingIncident: string;
    midpointChange: string;
    climax: string;
    resolution: string;
  };
  growthAreas?: string[];
}

// Character expansion for details focus
export interface CharacterDetailsExpansion {
  physicalTraits: string[];
  personalityTraits: string[];
  voice: string;
  hobbies?: string[];
  quirks?: string[];
  mannerisms?: string[];
  preferences?: Record<string, string>;
}

// Union type for different character expansions
export type CharacterExpansion = 
  | CharacterBackgroundExpansion
  | CharacterRelationshipsExpansion
  | CharacterDevelopmentExpansion
  | CharacterDetailsExpansion; 