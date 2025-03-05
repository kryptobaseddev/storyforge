import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { createExpressMiddleware } from '@trpc/server/adapters/express';
import { createOpenApiExpressMiddleware } from 'trpc-openapi';
import swaggerUi from 'swagger-ui-express';

// Import tRPC router and context
import { appRouter } from './routers/_app';
import { createTRPCContext } from './trpc';

// Import OpenAPI document
import { openApiDocument } from './openapi';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); // Increased payload limit
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Database connection state
let dbConnection = {
  isConnected: false,
  hasError: false,
  lastError: null,
  retryCount: 0,
  lastReconnectAttempt: null as Date | null
};

// Connect to MongoDB with enhanced options
const connectDB = async () => {
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
    
    const conn = await mongoose.connect(mongoURI, {
      // These options are explicitly set for clarity, though they are defaults in newer mongoose versions
      serverSelectionTimeoutMS: 30000, // Timeout after 30 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      // These are good production settings for a high-traffic application
      maxPoolSize: 100, // Maintain up to 100 socket connections
      minPoolSize: 5,    // Maintain at least 5 socket connections
      retryWrites: true,  // Retry write operations on network errors
      retryReads: true    // Retry read operations on network errors
    });

    dbConnection.isConnected = true;
    dbConnection.hasError = false;
    dbConnection.lastError = null;
    dbConnection.retryCount = 0;
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Setup connection event listeners
    mongoose.connection.on('error', (err) => {
      console.error(`MongoDB connection error: ${err}`);
      dbConnection.hasError = true;
      dbConnection.lastError = err;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected. Attempting to reconnect...');
      dbConnection.isConnected = false;
      
      // Only retry if we haven't exceeded the retry count
      if (dbConnection.retryCount < 5) {
        dbConnection.retryCount++;
        setTimeout(() => {
          connectDB();
        }, 5000 * dbConnection.retryCount); // Exponential backoff
      } else {
        console.error('MongoDB reconnection failed after multiple attempts.');
      }
    });
    
    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected successfully');
      dbConnection.isConnected = true;
      dbConnection.retryCount = 0;
    });
    
  } catch (error: any) {
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
    } else {
      console.error('Failed to connect to MongoDB after multiple attempts.');
      process.exit(1);
    }
  }
};

// Health check route
app.get('/api/health', (req, res) => {
  // Check MongoDB connection
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  
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
        status: 'running',
        uptime: process.uptime()
      }
    }
  });
});

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to StoryForge API' });
});

// tRPC API endpoint
app.use(
  '/api/trpc',
  createExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  })
);

// OpenAPI/REST compatibility layer
app.use(
  '/api',
  createOpenApiExpressMiddleware({
    router: appRouter,
    createContext: createTRPCContext,
  })
);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiDocument));

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
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