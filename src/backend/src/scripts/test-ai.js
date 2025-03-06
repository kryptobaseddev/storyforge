"use strict";
/**
 * AI Integration Test Script
 *
 * This script tests the AI service by generating a character
 * and printing the response to the console.
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
const dotenv_1 = __importDefault(require("dotenv"));
const service_1 = require("../ai/service");
const extractCharacter_1 = require("../ai/parsers/extractCharacter");
// Load environment variables
dotenv_1.default.config();
// Initialize AI service
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
    console.error('Error: OPENAI_API_KEY environment variable is not set');
    process.exit(1);
}
const aiService = new service_1.AIService(apiKey);
// Test character generation
function testCharacterGeneration() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Testing character generation...');
        const request = {
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
            const response = yield aiService.generateContent(request);
            console.log('Response received:');
            console.log('Content:', response.content);
            console.log('Metadata:', response.metadata);
            // Try to extract character from response
            const character = (0, extractCharacter_1.extractCharacter)(response.content);
            if (character) {
                console.log('Successfully extracted character:');
                console.log(JSON.stringify(character, null, 2));
            }
            else {
                console.log('Failed to extract character from response');
            }
        }
        catch (error) {
            console.error('Error testing character generation:', error);
        }
    });
}
// Run the test
testCharacterGeneration()
    .then(() => console.log('Test completed'))
    .catch(error => console.error('Test failed:', error));
