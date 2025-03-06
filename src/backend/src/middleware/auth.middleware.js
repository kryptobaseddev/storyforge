"use strict";
/**
 * Authentication Middleware
 *
 * This middleware handles authentication and authorization for protected routes.
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
exports.projectAccess = exports.ownerOrAdmin = exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
/**
 * Middleware to protect routes that require authentication
 */
const protect = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    // Check if token exists in Authorization header
    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1];
            // Verify token
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || 'default_secret');
            // Get user from the token
            req.user = yield user_model_1.default.findById(decoded.id).select('-passwordHash');
            next();
        }
        catch (error) {
            console.error('Authentication error:', error);
            res.status(401).json({
                error: {
                    code: 'authentication_failed',
                    message: 'Not authorized, token failed'
                }
            });
        }
    }
    if (!token) {
        res.status(401).json({
            error: {
                code: 'no_token',
                message: 'Not authorized, no token'
            }
        });
    }
});
exports.protect = protect;
/**
 * Middleware to check if user has admin role
 */
const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    }
    else {
        res.status(403).json({
            error: {
                code: 'not_admin',
                message: 'Not authorized as an admin'
            }
        });
    }
};
exports.admin = admin;
/**
 * Middleware to check if user owns the resource or is an admin
 */
const ownerOrAdmin = (req, res, next) => {
    const resourceUserId = req.params.userId || req.body.userId;
    if (req.user &&
        (req.user.isAdmin || req.user._id.toString() === resourceUserId)) {
        next();
    }
    else {
        res.status(403).json({
            error: {
                code: 'not_authorized',
                message: 'Not authorized to access this resource'
            }
        });
    }
};
exports.ownerOrAdmin = ownerOrAdmin;
/**
 * Middleware to check if user has access to a project
 */
const projectAccess = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const projectId = req.params.projectId || req.body.projectId;
        if (!projectId) {
            return res.status(400).json({
                error: {
                    code: 'missing_project_id',
                    message: 'Project ID is required'
                }
            });
        }
        // Check if user is the owner or a collaborator
        const project = yield require('../models/project.model').default.findById(projectId);
        if (!project) {
            return res.status(404).json({
                error: {
                    code: 'project_not_found',
                    message: 'Project not found'
                }
            });
        }
        const isOwner = project.userId.toString() === req.user._id.toString();
        const isCollaborator = project.collaborators.some((collab) => collab.userId.toString() === req.user._id.toString());
        if (isOwner || isCollaborator || req.user.isAdmin) {
            next();
        }
        else {
            res.status(403).json({
                error: {
                    code: 'no_project_access',
                    message: 'Not authorized to access this project'
                }
            });
        }
    }
    catch (error) {
        console.error('Project access error:', error);
        res.status(500).json({
            error: {
                code: 'server_error',
                message: 'Server error while checking project access'
            }
        });
    }
});
exports.projectAccess = projectAccess;
