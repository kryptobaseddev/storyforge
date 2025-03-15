/**
 * Setting Types
 * 
 * This file contains type definitions and constants related to settings.
 */

/**
 * Setting type constants
 */
export const SETTING_TYPES = [
  'City', 
  'Country', 
  'Planet', 
  'Building', 
  'Landscape', 
  'Region', 
  'World', 
  'Room', 
  'Other'
] as const;

export type SettingType = typeof SETTING_TYPES[number];

/**
 * Setting details interface
 */
export interface SettingDetails {
  geography: string;
  climate: string;
  architecture: string;
  culture: string;
  history: string;
  government: string;
  economy: string;
  technology: string;
}

/**
 * Map interface
 */
export interface SettingMap {
  imageUrl: string;
  coordinates?: any;
} 