/**
 * Basic test for API health
 * This is a minimal test to verify the API health endpoint is working
 */

import fetch from 'node-fetch';
import { describe, test, expect } from '@jest/globals';

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Skip tests if environment is marked as CI
const runTests = process.env.CI !== 'true';

// Basic health check test
(runTests ? describe : describe.skip)('API Health Check', () => {
  test('Health endpoint should return 200 OK', async () => {
    try {
      const response = await fetch(`${API_URL}/health`);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data).toHaveProperty('status', 'ok');
    } catch (error) {
      console.warn('Health check failed. Is the API running?');
      throw error;
    }
  }, 10000); // 10 second timeout
});