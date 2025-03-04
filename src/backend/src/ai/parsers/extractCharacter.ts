/**
 * Character Extraction Parser
 * 
 * This file contains functions to extract structured character data
 * from AI-generated responses, handling different formats and ensuring
 * the data meets the application's requirements.
 */

import { Character, CharacterExpansion } from '../schemas/characterSchema';

/**
 * Extracts a complete character object from an AI response
 * 
 * @param aiResponse - The raw text response from the AI service
 * @returns A validated Character object or null if parsing fails
 */
export function extractCharacter(aiResponse: string): Character | null {
  try {
    // Find JSON in the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    // Parse the JSON
    const characterData = JSON.parse(jsonMatch[0]);
    
    // Validate required fields
    const requiredFields = [
      'name', 
      'shortDescription', 
      'background', 
      'physicalTraits', 
      'personalityTraits', 
      'goals', 
      'fears', 
      'skills',
      'voice',
      'role'
    ];
    
    const missingFields = requiredFields.filter(field => !characterData[field]);
    
    if (missingFields.length > 0) {
      console.warn(`Character data missing required fields: ${missingFields.join(', ')}`);
      
      // Fill in any missing fields with placeholder values
      missingFields.forEach(field => {
        if (Array.isArray(characterData[field])) {
          characterData[field] = ['Not specified'];
        } else {
          characterData[field] = 'Not specified';
        }
      });
    }
    
    // Ensure arrays are properly formatted
    const arrayFields = ['physicalTraits', 'personalityTraits', 'goals', 'fears', 'skills'];
    arrayFields.forEach(field => {
      if (!Array.isArray(characterData[field])) {
        // If the field exists but isn't an array, try to convert it
        if (characterData[field]) {
          if (typeof characterData[field] === 'string') {
            // Try to convert comma-separated string to array
            characterData[field] = characterData[field].split(',').map(item => item.trim());
          } else {
            // Create a single-item array with the value
            characterData[field] = [String(characterData[field])];
          }
        } else {
          // If field doesn't exist, set empty array
          characterData[field] = [];
        }
      }
    });
    
    // Ensure relationships is an array
    if (!characterData.relationships) {
      characterData.relationships = [];
    } else if (!Array.isArray(characterData.relationships)) {
      characterData.relationships = [characterData.relationships];
    }
    
    // Add metadata
    characterData.aiGenerated = true;
    characterData.createdAt = new Date();
    characterData.editedByUser = false;
    
    return characterData as Character;
  } catch (error) {
    console.error('Failed to parse character from AI response:', error);
    return null;
  }
}

/**
 * Extracts character expansion data from an AI response
 * 
 * @param aiResponse - The raw text response from the AI service
 * @param expansionType - The type of expansion being extracted
 * @returns A validated CharacterExpansion object or null if parsing fails
 */
export function extractCharacterExpansion(
  aiResponse: string, 
  expansionType: 'background' | 'relationships' | 'development' | 'details'
): CharacterExpansion | null {
  try {
    // Find JSON in the response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    
    // Parse the JSON
    const expansionData = JSON.parse(jsonMatch[0]);
    
    // Validate based on expansion type
    switch (expansionType) {
      case 'background':
        if (!expansionData.background && !expansionData.backstory) {
          return null;
        }
        break;
      case 'relationships':
        if (!expansionData.relationships || !Array.isArray(expansionData.relationships)) {
          return null;
        }
        break;
      case 'development':
        if (!expansionData.arc) {
          return null;
        }
        break;
      case 'details':
        if (!expansionData.physicalTraits && !expansionData.personalityTraits && !expansionData.voice) {
          return null;
        }
        break;
    }
    
    return expansionData as CharacterExpansion;
  } catch (error) {
    console.error(`Failed to parse character ${expansionType} expansion from AI response:`, error);
    return null;
  }
}

/**
 * Extracts character data from markdown formatted response
 * 
 * This is a fallback method when JSON parsing fails
 * 
 * @param aiResponse - The raw text response from the AI service
 * @returns A partially populated Character object or null if extraction fails
 */
export function extractCharacterFromMarkdown(aiResponse: string): Partial<Character> | null {
  try {
    const character: Partial<Character> = {
      physicalTraits: [],
      personalityTraits: [],
      goals: [],
      fears: [],
      skills: [],
      relationships: []
    };
    
    // Extract name (usually in a heading)
    const nameMatch = aiResponse.match(/# ([^\n]+)/);
    if (nameMatch) {
      character.name = nameMatch[1].trim();
    }
    
    // Extract description
    const descriptionMatch = aiResponse.match(/## Description\s*\n([^\n#]+)/i);
    if (descriptionMatch) {
      character.shortDescription = descriptionMatch[1].trim();
    }
    
    // Extract background
    const backgroundMatch = aiResponse.match(/## Background\s*\n([\s\S]*?)(?=##|$)/i);
    if (backgroundMatch) {
      character.background = backgroundMatch[1].trim();
    }
    
    // Extract traits as lists
    const traitsMatch = aiResponse.match(/## (?:Physical )?Traits\s*\n([\s\S]*?)(?=##|$)/i);
    if (traitsMatch) {
      const traits = traitsMatch[1].match(/- ([^\n]+)/g);
      if (traits) {
        character.physicalTraits = traits.map(t => t.replace('- ', '').trim());
      }
    }
    
    // Extract personality
    const personalityMatch = aiResponse.match(/## Personality\s*\n([\s\S]*?)(?=##|$)/i);
    if (personalityMatch) {
      const traits = personalityMatch[1].match(/- ([^\n]+)/g);
      if (traits) {
        character.personalityTraits = traits.map(t => t.replace('- ', '').trim());
      }
    }
    
    // Return the partially extracted character
    return character;
  } catch (error) {
    console.error('Failed to parse character from markdown:', error);
    return null;
  }
} 