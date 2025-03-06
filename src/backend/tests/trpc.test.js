"use strict";
/**
 * Basic test for API health
 * This is a minimal test to verify the API health endpoint is working
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
const node_fetch_1 = __importDefault(require("node-fetch"));
// Base URL for API
const API_URL = 'http://localhost:5000/api';
// Skip tests if environment is marked as CI
const runTests = process.env.CI !== 'true';
// Basic health check test
(runTests ? describe : describe.skip)('API Health Check', () => {
    test('Health endpoint should return 200 OK', () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const response = yield (0, node_fetch_1.default)(`${API_URL}/health`);
            expect(response.status).toBe(200);
            const data = yield response.json();
            expect(data).toHaveProperty('status', 'ok');
        }
        catch (error) {
            console.warn('Health check failed. Is the API running?');
            throw error;
        }
    }), 10000); // 10 second timeout
});
