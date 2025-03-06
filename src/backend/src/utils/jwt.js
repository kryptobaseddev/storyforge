"use strict";
/**
 * JWT Utilities
 *
 * This file contains utilities for JWT token generation and verification
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// JWT Secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';
/**
 * Generate a JWT token
 * @param id - User ID to encode in the token
 * @returns JWT token
 */
const generateToken = (id) => {
    // Note: We're simplifying the token generation to avoid TypeScript issues
    // In production, we'd need to ensure proper typing with jsonwebtoken
    return jsonwebtoken_1.default.sign({ id }, JWT_SECRET);
};
exports.generateToken = generateToken;
/**
 * Verify a JWT token
 * @param token - JWT token to verify
 * @returns Decoded token payload
 */
const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                reject(new Error('Invalid token'));
            }
            else {
                resolve(decoded);
            }
        });
    });
};
exports.verifyToken = verifyToken;
