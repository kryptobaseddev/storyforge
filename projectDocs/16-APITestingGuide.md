# StoryForge - API Testing Guide

This guide provides instructions for testing the StoryForge tRPC API endpoints before integrating with the frontend.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Starting the Server](#starting-the-server)
- [Using Test Scripts](#using-test-scripts)
- [Manual Testing with Swagger UI](#manual-testing-with-swagger-ui)
- [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
- [Related Documentation](#related-documentation)

## Prerequisites

Before testing the API, ensure you have:

1. **Node.js** (v16+) installed
2. **MongoDB** running locally or connection to a MongoDB instance
3. **API Keys** for external services (if testing AI features)
4. **Environment variables** properly configured in `.env`
5. For test scripts:
   - **Bash & curl & jq** (for Linux/Mac users)
   - **PowerShell** (for Windows users)

## Starting the Server

1. Navigate to the backend directory:
   ```bash
   cd src/backend
   ```

2. Install dependencies if not already done:
   ```bash
   npm install
   ```

3. Ensure your environment variables are set up correctly in `.env` or `.env.local`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/storyforge
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
```

4. Start the server in development mode:
   ```bash
   npm run dev
   ```

5. The server should start on http://localhost:5000 (or the port specified in your `.env`)

## Using Test Scripts

We've created two test scripts to verify API functionality:

### For Bash (Linux/Mac)

1. Navigate to the backend directory:
   ```bash
   cd src/backend
   ```

2. Make the script executable:
   ```bash
   chmod +x test-api.sh
   ```

3. Run the script:
   ```bash
   ./test-api.sh
   ```

### For PowerShell (Windows)

1. Navigate to the backend directory:
   ```powershell
   cd src/backend
   ```

2. You may need to adjust PowerShell execution policy:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
   ```

3. Run the script:
   ```powershell
   .\test-api.ps1
   ```

### Endpoints Tested by Scripts

The scripts test the following functionality:

1. **Health Check** - Verifies the API is running
2. **Authentication** - Tests user registration and login
3. **User Profile** - Retrieves user profile with authentication
4. **Project Creation** - Creates a new project
5. **Character Creation** - Creates a character within a project
6. **Plot Creation** - Creates a plot within a project
7. **Chapter Creation** - Creates a chapter within a project
8. **AI Text Generation** - Tests the AI text generation endpoint
9. **Export Creation** - Tests creating an export

## Manual Testing with Swagger UI

The API is documented with OpenAPI and includes a Swagger UI interface:

1. Start the server as described above
2. Navigate to `http://localhost:5000/api/docs` in your browser
3. You'll see all available endpoints with descriptions

To test authenticated endpoints:
1. First execute the `auth.login` or `auth.register` endpoint
2. Copy the token from the response
3. Click the "Authorize" button at the top of the page
4. Enter the token in the format: `Bearer YOUR_TOKEN_HERE`
5. Click "Authorize" to save
6. Now you can test authenticated endpoints

## Common Issues and Troubleshooting

### Authentication Issues
- **Error**: "Authentication failed" or "Invalid token"
- **Solution**: Ensure you're including the JWT token in the Authorization header with the "Bearer" prefix

### Schema Validation Errors
- **Error**: "Input validation failed" with specific field errors
- **Solution**: Check the request payload against the expected schema (documented in Swagger UI)

### Database Connection
- **Error**: "Could not connect to database"
- **Solution**: Verify MongoDB is running and connection string in `.env` is correct

### tRPC-Specific Issues
- **Error**: "No matching procedure" or "Procedure not found"
- **Solution**: Double-check endpoint name and ensure it's implemented in the router

## Related Documentation

For more information, refer to:
- [15-tRPCMigrationPlan.md](./15-tRPCMigrationPlan.md) - Overview of the tRPC migration
- [15.1-ImplementedEndpoints.md](./15.1-ImplementedEndpoints.md) - Complete list of implemented endpoints
- [17-FrontendIntegration.md](./17-FrontendIntegration.md) - Guide for frontend integration 