"use strict";
/**
 * OpenAPI document generator for StoryForge API
 * This file generates the OpenAPI/Swagger documentation from tRPC routers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.openApiDocument = void 0;
const trpc_openapi_1 = require("trpc-openapi");
const _app_1 = require("./routers/_app");
// Generate OpenAPI document
exports.openApiDocument = (0, trpc_openapi_1.generateOpenApiDocument)(_app_1.appRouter, {
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
