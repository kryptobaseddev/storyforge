"use strict";
/**
 * AI Service
 *
 * This service handles all AI-related functionality, including prompt
 * template selection, context management, API calls to the LLM provider,
 * and response parsing.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const create_1 = require("./templates/character/create");
/**
 * Main AI Service class
 */
class AIService {
    /**
     * Create a new AIService instance
     *
     * @param apiKey - The API key for the LLM provider
     * @param model - The model to use (defaults to config value)
     */
    constructor(apiKey, model) {
        this.apiKey = apiKey;
        this.defaultModel = model || config_1.aiConfig.model.default;
    }
    /**
     * Generate content based on the request type
     *
     * @param request - The AI generation request
     * @returns Promise with the generated content
     */
    generateContent(request) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Select the appropriate template and handling based on request type
                switch (request.task) {
                    case 'character':
                        return this.generateCharacter(request);
                    case 'plot':
                        return this.generatePlot(request);
                    case 'setting':
                        return this.generateSetting(request);
                    case 'chapter':
                        return this.generateChapter(request);
                    case 'editorial':
                        return this.generateEditorialFeedback(request);
                    default:
                        throw new Error(`Unsupported task type: ${request.task}`);
                }
            }
            catch (error) {
                console.error('Error generating AI content:', error);
                throw error;
            }
        });
    }
    /**
     * Generate a character based on the request parameters
     *
     * @param request - The character generation request
     * @returns Promise with the generated character
     */
    generateCharacter(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get appropriate system prompt
            const systemPrompt = config_1.systemPrompts.character;
            // Create user prompt from template
            const userPrompt = (0, create_1.createCharacterTemplate)({
                genre: request.genre || 'fantasy',
                audience: request.audience || 'young adult',
                role: request.role,
                name: request.name,
                age_range: request.age_range,
                key_traits: request.key_traits,
                narrative_importance: request.narrative_importance,
            });
            // Call AI API
            const response = yield this.callLLMAPI(systemPrompt, userPrompt, request.temperature || config_1.aiConfig.temperature.character, request.max_tokens || config_1.aiConfig.maxTokens.character);
            return response;
        });
    }
    /**
     * Generate a plot based on the request parameters
     *
     * @param request - The plot generation request
     * @returns Promise with the generated plot
     */
    generatePlot(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // Placeholder for plot generation logic
            const systemPrompt = config_1.systemPrompts.plot;
            const userPrompt = `Generate a plot for a ${request.genre || 'fantasy'} story.`;
            const response = yield this.callLLMAPI(systemPrompt, userPrompt, request.temperature || config_1.aiConfig.temperature.plot, request.max_tokens || config_1.aiConfig.maxTokens.plot);
            return response;
        });
    }
    /**
     * Generate a setting based on the request parameters
     *
     * @param request - The setting generation request
     * @returns Promise with the generated setting
     */
    generateSetting(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // Placeholder for setting generation logic
            const systemPrompt = config_1.systemPrompts.setting;
            const userPrompt = `Generate a setting for a ${request.genre || 'fantasy'} story.`;
            const response = yield this.callLLMAPI(systemPrompt, userPrompt, request.temperature || config_1.aiConfig.temperature.setting, request.max_tokens || config_1.aiConfig.maxTokens.setting);
            return response;
        });
    }
    /**
     * Generate a chapter based on the request parameters
     *
     * @param request - The chapter generation request
     * @returns Promise with the generated chapter
     */
    generateChapter(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // Placeholder for chapter generation logic
            const systemPrompt = config_1.systemPrompts.chapter;
            const userPrompt = `Generate a chapter for a ${request.genre || 'fantasy'} story.`;
            const response = yield this.callLLMAPI(systemPrompt, userPrompt, request.temperature || config_1.aiConfig.temperature.chapter, request.max_tokens || config_1.aiConfig.maxTokens.chapter);
            return response;
        });
    }
    /**
     * Generate editorial feedback based on the request parameters
     *
     * @param request - The editorial feedback request
     * @returns Promise with the generated feedback
     */
    generateEditorialFeedback(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // Placeholder for editorial feedback generation logic
            const systemPrompt = config_1.systemPrompts.editorial;
            const userPrompt = `Provide editorial feedback on the following content: ${request.content}`;
            const response = yield this.callLLMAPI(systemPrompt, userPrompt, request.temperature || config_1.aiConfig.temperature.editorial, request.max_tokens || config_1.aiConfig.maxTokens.editorial);
            return response;
        });
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
    callLLMAPI(systemPrompt, userPrompt, temperature, maxTokens) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Get API configuration
                const apiConfig = config_1.apiProviders.openai;
                // Make request to OpenAI API
                const response = yield axios_1.default.post(`${apiConfig.baseUrl}${apiConfig.endpoints.chat}`, {
                    model: this.defaultModel,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userPrompt }
                    ],
                    temperature,
                    max_tokens: maxTokens,
                }, {
                    headers: Object.assign(Object.assign({}, apiConfig.defaultHeaders), { 'Authorization': `Bearer ${this.apiKey}` })
                });
                // Extract and format response
                const responseContent = response.data.choices[0].message.content;
                const tokenUsage = response.data.usage;
                const aiResponse = {
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
            }
            catch (error) {
                console.error('Error calling LLM API:', error);
                // Format error response
                const errorResponse = {
                    error: {
                        code: 'api_error',
                        message: error instanceof Error ? error.message : 'Unknown error',
                        details: error
                    }
                };
                throw errorResponse;
            }
        });
    }
    /**
     * Generate an image based on a prompt
     *
     * @param prompt - The image generation prompt
     * @param size - The size of the image to generate
     * @returns Promise with the image URL
     */
    generateImage(prompt_1) {
        return __awaiter(this, arguments, void 0, function* (prompt, size = '512x512') {
            try {
                // Get API configuration
                const apiConfig = config_1.apiProviders.openai;
                // Make request to OpenAI API
                const response = yield axios_1.default.post(`${apiConfig.baseUrl}${apiConfig.endpoints.images}`, {
                    prompt,
                    n: 1,
                    size,
                }, {
                    headers: Object.assign(Object.assign({}, apiConfig.defaultHeaders), { 'Authorization': `Bearer ${this.apiKey}` })
                });
                // Return the image URL
                return response.data.data[0].url;
            }
            catch (error) {
                console.error('Error generating image:', error);
                throw error;
            }
        });
    }
}
exports.AIService = AIService;
