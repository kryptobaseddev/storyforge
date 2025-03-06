/**
 * OpenAPI document generator for StoryForge API
 * This file generates the OpenAPI/Swagger documentation from tRPC routers
 */

import { generateOpenApiDocument } from 'trpc-openapi';
import { appRouter } from './routers/_app';

// Generate OpenAPI document
export const openApiDocument = generateOpenApiDocument(appRouter, {
  title: 'StoryForge API',
  description: 'API documentation for StoryForge creative writing application',
  version: '1.0.0',
  baseUrl: '/api',
  tags: [
    'auth',
    'users',
    'projects',
    'characters',
    'settings',
    'plots',
    'chapters',
    'exports',
    'ai'
  ],
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT'
    }
  },
  docsUrl: '/api/docs'
}); 