"use strict";
/**
 * Context adapters for different server environments
 * This provides context creation functions for different tRPC adapters
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createHTTPContext = void 0;
const jwt_1 = require("../utils/jwt");
/**
 * Create context for standalone HTTP server
 * Used primarily in testing
 */
const createHTTPContext = (_a) => __awaiter(void 0, [_a], void 0, function* ({ req, res, }) {
    // Initialize context
    const ctx = { req, res, user: null };
    // Parse Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(' ')[1];
    // If token exists, verify it and add user to context
    if (token) {
        try {
            const decoded = yield (0, jwt_1.verifyToken)(token);
            ctx.user = decoded;
        }
        catch (error) {
            // Invalid token, but we don't throw here
            console.warn('Invalid token in HTTP context:', error);
        }
    }
    return ctx;
});
exports.createHTTPContext = createHTTPContext;
