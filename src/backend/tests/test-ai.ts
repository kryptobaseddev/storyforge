/**
 * AI Integration Test Script
 * 
 * This script tests the AI service by generating a character
 * and printing the response to the console.
 */

import dotenv from 'dotenv';
import { AIService } from '../src/ai/service';
import { CharacterGenerationRequest } from '../src/ai/types';
import { extractCharacter } from '../src/ai/parsers/extractCharacter';

// Load environment variables
dotenv.config();

// Initialize AI service
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.error('Error: OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

const aiService = new AIService(apiKey);

// Test character generation
async function testCharacterGeneration() {
  console.log('Testing character generation...');
  
  const request: CharacterGenerationRequest = {
    task: 'character',
    project_id: 'test-project',
    user_id: 'test-user',
    genre: 'fantasy',
    audience: 'middle grade',
    name: 'Elara',
    role: 'protagonist',
    key_traits: ['brave', 'curious', 'resourceful'],
    narrative_importance: 'protagonist'
  };
  
  try {
    console.log('Sending request to AI service...');
    const response = await aiService.generateContent(request);
    
    console.log('Response received:');
    console.log('Content:', response.content);
    console.log('Metadata:', response.metadata);
    
    // Try to extract character from response
    const character = extractCharacter(response.content);
    
    if (character) {
      console.log('Successfully extracted character:');
      console.log(JSON.stringify(character, null, 2));
    } else {
      console.log('Failed to extract character from response');
    }
  } catch (error) {
    console.error('Error testing character generation:', error);
  }
}

// Run the test
testCharacterGeneration()
  .then(() => console.log('Test completed'))
  .catch(error => console.error('Test failed:', error)); 