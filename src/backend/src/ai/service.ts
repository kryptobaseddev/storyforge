/**
 * AI Service
 * 
 * This service handles all AI-related functionality, including prompt
 * template selection, context management, API calls to the LLM provider,
 * and response parsing.
 */

import axios from 'axios';
import { aiConfig, apiProviders, systemPrompts } from './config';
import { 
  AIResponse, 
  AIErrorResponse, 
  AITaskType,
  AIRequest,
  CharacterGenerationRequest,
  PlotGenerationRequest,
  SettingGenerationRequest,
  ChapterGenerationRequest,
  EditorialFeedbackRequest,
  ResponseFormatOptions,
  ContentFilterLevelType,
  ResponseFormatType,
  AIFocusAreaType,
} from '../types/ai.types';
import { GenreType, PROJECT_GENRES, TARGET_AUDIENCES, TargetAudienceType, TargetLength, TargetLengthType } from '../types/project.types';

import { createCharacterTemplate, expandCharacterTemplate } from './templates/character/create';
import { extractCharacter, extractCharacterExpansion } from './parsers/extractCharacter';

/**
 * Main AI Service class
 */
export class AIService {
  private apiKey: string;
  private defaultModel: string;
  
  /**
   * Create a new AIService instance
   * 
   * @param apiKey - The API key for the LLM provider
   * @param model - The model to use (defaults to config value)
   */
  constructor(apiKey: string, model?: string) {
    this.apiKey = apiKey;
    this.defaultModel = model || aiConfig.model.default;
  }
  
  /**
   * Generate content based on the request type
   * 
   * @param request - The AI generation request
   * @returns Promise with the generated content
   */
  async generateContent(request: AIRequest): Promise<AIResponse> {
    try {
      // Select the appropriate template and handling based on request type
      switch (request.task) {
        case 'character':
          return this.generateCharacter(request as CharacterGenerationRequest);
        case 'plot':
          return this.generatePlot(request as PlotGenerationRequest);
        case 'setting':
          return this.generateSetting(request as SettingGenerationRequest);
        case 'chapter':
          return this.generateChapter(request as ChapterGenerationRequest);
        case 'editorial':
          return this.generateEditorialFeedback(request as EditorialFeedbackRequest);
        default:
          throw new Error(`Unsupported task type: ${(request as any).task}`);
      }
    } catch (error) {
      console.error('Error generating AI content:', error);
      throw error;
    }
  }
  
  /**
   * Generate a character based on the request parameters
   * 
   * @param request - The character generation request
   * @returns Promise with the generated character
   */
  private async generateCharacter(request: CharacterGenerationRequest): Promise<AIResponse> {
    // Get appropriate system prompt
    const systemPrompt = systemPrompts.character;
    
    // Create user prompt from template
    const userPrompt = createCharacterTemplate({
      genre: request.genre || 'fantasy',
      audience: request.audience || 'young adult',
      role: request.role,
      name: request.name,
      age_range: request.age_range,
      key_traits: request.key_traits,
      narrative_importance: request.narrative_importance,
    });
    
    // Call AI API
    const response = await this.callLLMAPI(
      systemPrompt, 
      userPrompt, 
      request.temperature || aiConfig.temperature.character,
      request.max_tokens || aiConfig.maxTokens.character
    );
    
    return response;
  }
  
  /**
   * Generate a plot based on the request parameters
   * 
   * @param request - The plot generation request
   * @returns Promise with the generated plot
   */
  private async generatePlot(request: PlotGenerationRequest): Promise<AIResponse> {
    // Placeholder for plot generation logic
    const systemPrompt = systemPrompts.plot;
    const userPrompt = `Generate a plot for a ${request.genre || 'fantasy'} story.`;
    
    const response = await this.callLLMAPI(
      systemPrompt, 
      userPrompt, 
      request.temperature || aiConfig.temperature.plot,
      request.max_tokens || aiConfig.maxTokens.plot
    );
    
    return response;
  }
  
  /**
   * Generate a setting based on the request parameters
   * 
   * @param request - The setting generation request
   * @returns Promise with the generated setting
   */
  private async generateSetting(request: SettingGenerationRequest): Promise<AIResponse> {
    // Placeholder for setting generation logic
    const systemPrompt = systemPrompts.setting;
    const userPrompt = `Generate a setting for a ${request.genre || 'fantasy'} story.`;
    
    const response = await this.callLLMAPI(
      systemPrompt, 
      userPrompt, 
      request.temperature || aiConfig.temperature.setting,
      request.max_tokens || aiConfig.maxTokens.setting
    );
    
    return response;
  }
  
  /**
   * Generate a chapter based on the request parameters
   * 
   * @param request - The chapter generation request
   * @returns Promise with the generated chapter
   */
  private async generateChapter(request: ChapterGenerationRequest): Promise<AIResponse> {
    // Placeholder for chapter generation logic
    const systemPrompt = systemPrompts.chapter;
    const userPrompt = `Generate a chapter for a ${request.genre || 'fantasy'} story.`;
    
    const response = await this.callLLMAPI(
      systemPrompt, 
      userPrompt, 
      request.temperature || aiConfig.temperature.chapter,
      request.max_tokens || aiConfig.maxTokens.chapter
    );
    
    return response;
  }
  
  /**
   * Generate editorial feedback based on the request parameters
   * 
   * @param request - The editorial feedback request
   * @returns Promise with the generated feedback
   */
  private async generateEditorialFeedback(request: EditorialFeedbackRequest): Promise<AIResponse> {
    // Placeholder for editorial feedback generation logic
    const systemPrompt = systemPrompts.editorial;
    const userPrompt = `Provide editorial feedback on the following content: ${request.content}`;
    
    const response = await this.callLLMAPI(
      systemPrompt, 
      userPrompt, 
      request.temperature || aiConfig.temperature.editorial,
      request.max_tokens || aiConfig.maxTokens.editorial
    );
    
    return response;
  }
  
  /**
   * Make a call to the LLM API
   * 
   * @param systemPrompt - The system prompt providing context to the AI
   * @param userPrompt - The user prompt containing the specific request
   * @param temperature - The temperature parameter for generation
   * @param maxTokens - The maximum number of tokens to generate
   * @returns Promise with the AI response
   */
  private async callLLMAPI(
    systemPrompt: string,
    userPrompt: string,
    temperature: number,
    maxTokens: number
  ): Promise<AIResponse> {
    try {
      // Get API configuration
      const apiConfig = apiProviders.openai;
      
      // Make request to OpenAI API
      const response = await axios.post(
        `${apiConfig.baseUrl}${apiConfig.endpoints.chat}`,
        {
          model: this.defaultModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature,
          max_tokens: maxTokens,
        },
        {
          headers: {
            ...apiConfig.defaultHeaders,
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Extract and format response
      const responseContent = response.data.choices[0].message.content;
      const tokenUsage = response.data.usage;
      
      const aiResponse: AIResponse = {
        content: responseContent,
        metadata: {
          model: response.data.model,
          timestamp: new Date().toISOString(),
          token_usage: {
            prompt: tokenUsage.prompt_tokens,
            completion: tokenUsage.completion_tokens,
            total: tokenUsage.total_tokens
          }
        }
      };
      
      return aiResponse;
    } catch (error) {
      console.error('Error calling LLM API:', error);
      
      // Format error response
      const errorResponse: AIErrorResponse = {
        error: {
          code: 'api_error',
          message: error instanceof Error ? error.message : 'Unknown error',
          details: error
        }
      };
      
      throw errorResponse;
    }
  }
  
  /**
   * Generate an image based on a prompt
   * 
   * @param prompt - The image generation prompt
   * @param size - The size of the image to generate
   * @returns Promise with the image URL
   */
  async generateImage(prompt: string, size: '256x256' | '512x512' | '1024x1024' = '512x512'): Promise<string> {
    try {
      // Get API configuration
      const apiConfig = apiProviders.openai;
      
      // Make request to OpenAI API
      const response = await axios.post(
        `${apiConfig.baseUrl}${apiConfig.endpoints.images}`,
        {
          prompt,
          n: 1,
          size,
        },
        {
          headers: {
            ...apiConfig.defaultHeaders,
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );
      
      // Return the image URL
      return response.data.data[0].url;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  }
} 