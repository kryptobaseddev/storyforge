"use strict";
/**
 * tRPC server setup for StoryForge
 * This file initializes the tRPC server, creates context, and defines procedures
 */
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTRPCContext = exports.transformId = exports.protectedProcedure = exports.publicProcedure = exports.router = exports.isAuthed = void 0;
const server_1 = require("@trpc/server");
const superjson_1 = __importDefault(require("superjson"));
/**
 * Initialize tRPC
 */
const t = server_1.initTRPC.context().meta().create({
    transformer: superjson_1.default,
    errorFormatter({ shape, error }) {
        return Object.assign(Object.assign({}, shape), { data: Object.assign(Object.assign({}, shape.data), { zodError: error.cause instanceof Error &&
                    error.cause.name === 'ZodError'
                    ? error.cause.message
                    : null }) });
    },
});
/**
 * Authentication middleware
 * This ensures that the user is authenticated before running a procedure
 */
exports.isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.user || !ctx.user.id) {
        throw new server_1.TRPCError({
            code: 'UNAUTHORIZED',
            message: 'You must be logged in to access this resource',
        });
    }
    return next({
        ctx: Object.assign(Object.assign({}, ctx), { 
            // Ensures user is never undefined for authenticated procedures
            user: ctx.user })
    });
});
/**
 * Export tRPC router and procedures
 */
exports.router = t.router;
exports.publicProcedure = t.procedure;
exports.protectedProcedure = t.procedure.use(exports.isAuthed);
/**
 * Utility function to transform MongoDB _id to id in responses
 */
const transformId = (doc) => {
    const { _id } = doc, rest = __rest(doc, ["_id"]);
    return Object.assign({ id: _id.toString() }, rest);
};
exports.transformId = transformId;
// Re-export context to avoid circular dependencies
var context_1 = require("./trpc/context");
Object.defineProperty(exports, "createTRPCContext", { enumerable: true, get: function () { return context_1.createTRPCContext; } });
