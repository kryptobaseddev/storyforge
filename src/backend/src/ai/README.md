# AI Module

This module provides AI-powered content generation capabilities for the StoryForge application. It includes services for generating characters, plots, settings, chapters, and editorial feedback, as well as image generation.

## Structure

- `service.ts` - Main AI service class that handles API calls to the LLM provider
- `types.ts` - TypeScript interfaces and types for the AI service
- `config.ts` - Configuration for the AI service, including prompt templates and API providers
- `helpers/` - Helper functions and utilities
  - `contextManager.ts` - Manages context for AI requests
- `templates/` - Prompt templates for different generation tasks
- `parsers/` - Functions for parsing and extracting data from AI responses

## Usage

### Basic Usage

```typescript
import { AIService } from './ai/service';
import { CharacterGenerationRequest } from './ai/types';

// Initialize the AI service with your API key
const aiService = new AIService(process.env.OPENAI_API_KEY || '');

// Create a request
const request: CharacterGenerationRequest = {
  task: 'character',
  project_id: 'your-project-id',
  user_id: 'your-user-id',
  genre: 'fantasy',
  audience: 'young adult',
  name: 'Elara',
  role: 'protagonist',
  key_traits: ['brave', 'curious', 'resourceful'],
  narrative_importance: 'protagonist'
};

// Generate content
const response = await aiService.generateContent(request);
console.log(response.content);
```

### Image Generation

```typescript
import { AIService } from './ai/service';

// Initialize the AI service with your API key
const aiService = new AIService(process.env.OPENAI_API_KEY || '');

// Generate an image
const imageUrl = await aiService.generateImage(
  'A fantasy character named Elara, a brave and curious young girl with flowing red hair and bright green eyes, standing in a magical forest.',
  '512x512'
);
console.log(imageUrl);
```

## API Routes

The AI functionality is exposed through the following API routes:

- `POST /api/ai/generate` - Generate AI content (character, plot, setting, chapter, editorial)
- `POST /api/ai/generate-image` - Generate an AI image
- `PUT /api/ai/generations/:generation_id/save` - Save an AI generation

## Testing

You can test the AI functionality using the provided test scripts:

```bash
# Test the AI service directly
npm run test:ai

# Test the AI routes through HTTP requests
npm run test:ai-routes
```

## Environment Variables

The AI service requires the following environment variables:

- `OPENAI_API_KEY` - Your OpenAI API key
- `API_BASE_URL` - Base URL for the API (for testing routes, defaults to http://localhost:3000/api)

## Models

The AI service uses the following models by default:

- Text generation: GPT-4 (configurable in `config.ts`)
- Image generation: DALL-E 3

## Error Handling

The AI service includes comprehensive error handling for API errors, validation errors, and other issues. Errors are logged to the console and returned as structured error responses. 