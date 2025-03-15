/**
 * Object Types
 * 
 * This file contains type definitions and constants related to objects/items.
 */

/**
 * Object type constants
 */
export const OBJECT_TYPES = [
  'Item',
  'Artifact',
  'Vehicle',
  'Weapon',
  'Tool',
  'Clothing',
  'Other'
] as const;

export type ObjectType = typeof OBJECT_TYPES[number];

/**
 * Connection type constants
 */
export const CONNECTION_TYPES = [
  'Owner',
  'Location',
  'RelatedCharacter',
  'RelatedEvent',
  'PlotPoint',
  'Other'
] as const;

export type ConnectionType = typeof CONNECTION_TYPES[number];

/**
 * Physical properties interface
 */
export interface PhysicalProperties {
  size: string;
  material: string;
  appearance: string;
}

/**
 * Magical properties interface
 */
export interface MagicalProperties {
  powers: string[];
  limitations: string[];
  origin: string;
  // Enhanced magical properties
  energySource?: string;
  activationMethod?: string;
  sideEffects?: string[];
  rarity?: string;
}

/**
 * Object properties interface
 */
export interface ObjectProperties {
  physical: PhysicalProperties;
  magical?: MagicalProperties;
}

/**
 * Timeline event interface
 */
export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  importance: number; // 1-10 scale of importance
}

/**
 * Connection interface
 */
export interface Connection {
  type: ConnectionType;
  entityId: string; // ObjectId as string
  description: string;
} 