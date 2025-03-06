"use strict";
/**
 * AI Service Configuration
 *
 * This file contains configurable parameters for the AI service,
 * including temperature, token limits, and response formats for different
 * story element types.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemPrompts = exports.apiProviders = exports.aiConfig = void 0;
exports.aiConfig = {
    // Controls creativity level - higher = more creative but potentially less focused
    temperature: {
        character: 0.7, // More creative for characters
        plot: 0.6, // Balanced for plot
        setting: 0.7, // More creative for settings
        chapter: 0.4, // More focused for chapter content
        editorial: 0.3, // Most focused for editorial feedback
    },
    // Maximum tokens for different response types
    maxTokens: {
        character: 500,
        plot: 800,
        setting: 600,
        chapter: 1500,
        editorial: 400,
    },
    // Format preferences for AI responses
    responseFormats: {
        preferJson: true, // Request structured JSON where possible
        markdownHeadings: 2, // Level of markdown headings to use
    },
    // Content filtering settings
    contentFiltering: {
        defaultLevel: 'standard', // 'strict', 'standard', or 'relaxed'
        enabledByDefault: true,
    },
    // Default model settings
    model: {
        default: 'gpt-4',
        fallback: 'gpt-3.5-turbo',
    },
    // Cache settings for AI responses
    cache: {
        enabled: true,
        ttl: 86400, // Time to live in seconds (24 hours)
    },
};
// API provider configurations
exports.apiProviders = {
    openai: {
        baseUrl: 'https://api.openai.com/v1',
        defaultHeaders: {
            'Content-Type': 'application/json',
        },
        endpoints: {
            chat: '/chat/completions',
            images: '/images/generations',
        },
        models: {
            chat: ['gpt-4', 'gpt-3.5-turbo'],
            image: ['dall-e-3'],
        },
        retryConfig: {
            maxRetries: 3,
            initialDelay: 1000,
            maxDelay: 10000,
        },
    },
};
// System prompts for different story elements
exports.systemPrompts = {
    character: 'You are a helpful AI writing assistant for StoryForge, a platform for young writers. Your task is to help create engaging and well-developed characters.',
    plot: 'You are a helpful AI writing assistant for StoryForge, a platform for young writers. Your task is to help create compelling plot elements that drive the narrative forward.',
    setting: 'You are a helpful AI writing assistant for StoryForge, a platform for young writers. Your task is to help create rich, immersive settings that enhance the story world.',
    chapter: 'You are a helpful AI writing assistant for StoryForge, a platform for young writers. Your task is to help write engaging chapters that advance the story.',
    editorial: 'You are a helpful AI writing assistant for StoryForge, a platform for young writers. Your task is to provide constructive editorial feedback to improve the story.',
};
