/**
 * Test AI Routes
 * 
 * This script tests the AI routes by making HTTP requests to the API endpoints.
 * It tests character generation, image generation, and saving a generation.
 */

import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// API base URL
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000/api';

// Test data
const testCharacterRequest = {
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

/**
 * Test character generation
 */
async function testCharacterGeneration() {
  console.log('Testing character generation...');
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/ai/generate`,
      testCharacterRequest
    );
    
    console.log('Character generation successful!');
    console.log('Generation ID:', response.data.generation_id);
    console.log('Content:', response.data.content.substring(0, 200) + '...');
    
    // Return the generation ID for further testing
    return response.data.generation_id;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error testing character generation:', axiosError.response?.data || axiosError.message);
    return null;
  }
}

/**
 * Test image generation
 */
async function testImageGeneration() {
  console.log('\nTesting image generation...');
  
  try {
    const response = await axios.post(
      `${API_BASE_URL}/ai/generate-image`,
      {
        prompt: 'A fantasy character named Elara, a brave and curious young girl with flowing red hair and bright green eyes, standing in a magical forest.',
        size: '512x512',
        project_id: 'test-project',
        user_id: 'test-user'
      }
    );
    
    console.log('Image generation successful!');
    console.log('Generation ID:', response.data.generation_id);
    console.log('Image URL:', response.data.url);
    
    // Return the generation ID for further testing
    return response.data.generation_id;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error testing image generation:', axiosError.response?.data || axiosError.message);
    return null;
  }
}

/**
 * Test saving a generation
 */
async function testSaveGeneration(generationId: string) {
  console.log('\nTesting save generation...');
  
  try {
    const response = await axios.put(
      `${API_BASE_URL}/ai/generations/${generationId}/save`
    );
    
    console.log('Save generation successful!');
    console.log('Response:', response.data);
    
    return true;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error testing save generation:', axiosError.response?.data || axiosError.message);
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('Starting AI routes tests...\n');
  
  // Test character generation
  const characterGenerationId = await testCharacterGeneration();
  
  // Test image generation
  const imageGenerationId = await testImageGeneration();
  
  // Test saving a generation
  if (characterGenerationId) {
    await testSaveGeneration(characterGenerationId);
  }
  
  console.log('\nTests completed!');
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 