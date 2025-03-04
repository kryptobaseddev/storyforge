/**
 * AI Service Type Definitions
 * 
 * This file contains TypeScript interfaces and types for the AI service,
 * including prompt templates, response formats, and configuration options.
 */

// Generic prompt template type
export type PromptTemplate<T extends Record<string, any>> = (params: T) => string;

// Supported AI task types
export type AITaskType = 'character' | 'plot' | 'setting' | 'chapter' | 'editorial';

// Supported genres for stories
export type GenreType = 
  | 'fantasy' 
  | 'science fiction' 
  | 'mystery' 
  | 'adventure' 
  | 'historical fiction'
  | 'realistic fiction'
  | 'horror'
  | 'comedy'
  | 'drama'
  | 'fairy tale'
  | 'fable'
  | 'superhero';

// Target audience age ranges
export type AudienceType = 'children' | 'middle grade' | 'young adult' | 'adult';

// Content filtering levels
export type ContentFilterLevel = 'strict' | 'standard' | 'relaxed';

// AI response format options
export interface ResponseFormatOptions {
  as_json?: boolean;
  markdown_level?: number;
  include_reasoning?: boolean;
}

// Base request interface for all AI generation tasks
export interface AIGenerationRequest {
  task: AITaskType;
  project_id: string;
  user_id: string;
  genre?: GenreType;
  audience?: AudienceType;
  filter_level?: ContentFilterLevel;
  format_options?: ResponseFormatOptions;
  max_tokens?: number;
  temperature?: number;
}

// Character generation request
export interface CharacterGenerationRequest extends AIGenerationRequest {
  task: 'character';
  name?: string;
  role?: string;
  age_range?: string;
  key_traits?: string[];
  related_characters?: string[];
  narrative_importance?: 'protagonist' | 'antagonist' | 'supporting' | 'minor';
}

// Plot generation request
export interface PlotGenerationRequest extends AIGenerationRequest {
  task: 'plot';
  plot_points?: string[];
  characters?: string[];
  setting?: string;
  conflict_type?: string;
  desired_length?: 'short' | 'medium' | 'long';
}

// Setting generation request
export interface SettingGenerationRequest extends AIGenerationRequest {
  task: 'setting';
  location_type?: string;
  time_period?: string;
  mood?: string;
  key_features?: string[];
}

// Chapter generation request
export interface ChapterGenerationRequest extends AIGenerationRequest {
  task: 'chapter';
  title?: string;
  characters_present?: string[];
  setting?: string;
  previous_chapter_summary?: string;
  goals?: string[];
  word_count?: number;
}

// Editorial feedback request
export interface EditorialFeedbackRequest extends AIGenerationRequest {
  task: 'editorial';
  content: string;
  focus_areas?: ('pacing' | 'character' | 'plot' | 'dialogue' | 'description')[];
}

// Union type of all AI generation requests
export type AIRequest = 
  | CharacterGenerationRequest
  | PlotGenerationRequest
  | SettingGenerationRequest
  | ChapterGenerationRequest
  | EditorialFeedbackRequest;

// AI service response structure
export interface AIResponse {
  content: string;
  metadata: {
    model: string;
    timestamp: string;
    token_usage: {
      prompt: number;
      completion: number;
      total: number;
    }
  }
}

// Error response for AI service
export interface AIErrorResponse {
  error: {
    code: string;
    message: string;
    details?: any;
  }
} 