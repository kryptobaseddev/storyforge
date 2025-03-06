"use strict";
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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_2 = require("@trpc/server/adapters/express");
const trpc_openapi_1 = require("trpc-openapi");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
// Import tRPC router and context
const router_1 = require("./trpc/router");
const context_1 = require("./trpc/context");
// Import OpenAPI document
const openapi_1 = require("./openapi");
// Load environment variables
dotenv_1.default.config();
// Create Express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json({ limit: '10mb' })); // Increased payload limit
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Database connection state
let dbConnection = {
    isConnected: false,
    hasError: false,
    lastError: null,
    retryCount: 0,
    lastReconnectAttempt: null
};
// Connect to MongoDB with enhanced options
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (dbConnection.isConnected) {
            console.log('MongoDB is already connected');
            return;
        }
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('MONGODB_URI environment variable is not set');
            process.exit(1);
        }
        dbConnection.lastReconnectAttempt = new Date();
        const conn = yield mongoose_1.default.connect(mongoURI, {
            // These options are explicitly set for clarity, though they are defaults in newer mongoose versions
            serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            // These are good production settings for a high-traffic application
            maxPoolSize: 100, // Maintain up to 100 socket connections
            minPoolSize: 5, // Maintain at least 5 socket connections
            retryWrites: true, // Retry write operations on network errors
            retryReads: true // Retry read operations on network errors
        });
        dbConnection.isConnected = true;
        dbConnection.hasError = false;
        dbConnection.lastError = null;
        dbConnection.retryCount = 0;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        // Setup connection event listeners
        mongoose_1.default.connection.on('error', (err) => {
            console.error(`MongoDB connection error: ${err}`);
            dbConnection.hasError = true;
            dbConnection.lastError = err;
        });
        mongoose_1.default.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected. Attempting to reconnect...');
            dbConnection.isConnected = false;
            // Only retry if we haven't exceeded the retry count
            if (dbConnection.retryCount < 5) {
                dbConnection.retryCount++;
                setTimeout(() => {
                    connectDB();
                }, 5000 * dbConnection.retryCount); // Exponential backoff
            }
            else {
                console.error('MongoDB reconnection failed after multiple attempts.');
            }
        });
        mongoose_1.default.connection.on('reconnected', () => {
            console.log('MongoDB reconnected successfully');
            dbConnection.isConnected = true;
            dbConnection.retryCount = 0;
        });
    }
    catch (error) {
        dbConnection.hasError = true;
        dbConnection.lastError = error;
        dbConnection.isConnected = false;
        console.error(`Error connecting to MongoDB: ${error.message}`);
        // Retry connection with exponential backoff
        if (dbConnection.retryCount < 5) {
            dbConnection.retryCount++;
            console.log(`Retrying connection in ${5 * dbConnection.retryCount} seconds...`);
            setTimeout(() => {
                connectDB();
            }, 5000 * dbConnection.retryCount);
        }
        else {
            console.error('Failed to connect to MongoDB after multiple attempts.');
            process.exit(1);
        }
    }
});
// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to StoryForge API' });
});
// Health check route - Keep this before OpenAPI middleware
app.get('/api/health', (req, res) => {
    // Check MongoDB connection
    const dbStatus = mongoose_1.default.connection.readyState === 1 ? 'connected' : 'disconnected';
    // Return health information
    res.status(200).json({
        status: 'ok',
        timestamp: new Date(),
        services: {
            database: {
                status: dbStatus,
                isConnected: dbConnection.isConnected,
                hasError: dbConnection.hasError,
                lastReconnectAttempt: dbConnection.lastReconnectAttempt
            },
            api: {
                status: 'ok',
                uptime: process.uptime()
            }
        }
    });
});
// tRPC API endpoint
app.use('/api/trpc', (0, express_2.createExpressMiddleware)({
    router: router_1.appRouter,
    createContext: context_1.createContext,
}));
// Swagger UI - Keep this before the OpenAPI middleware
app.use('/api/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapi_1.openApiDocument));
// OpenAPI/REST compatibility layer
app.use('/api', (0, trpc_openapi_1.createOpenApiExpressMiddleware)({
    router: router_1.appRouter,
    createContext: context_1.createContext,
}));
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'production' ? 'Server Error' : err.message,
        stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack
    });
});
// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});
// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to database
    connectDB();
});
