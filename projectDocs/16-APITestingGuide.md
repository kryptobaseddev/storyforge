# StoryForge API Testing Guide

This guide provides instructions for testing the StoryForge tRPC API and preparing for frontend integration.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Starting the Server](#starting-the-server)
3. [Using the Test Scripts](#using-the-test-scripts)
4. [Manual Testing with Swagger UI](#manual-testing-with-swagger-ui)
5. [Common Issues and Troubleshooting](#common-issues-and-troubleshooting)
6. [Frontend Integration Notes](#frontend-integration-notes)

## Prerequisites

Before testing the API, ensure you have the following:

- Node.js (v16+) installed
- MongoDB running locally or a connection to a remote MongoDB instance
- API keys for external services (OpenAI, etc.) if testing AI features

Required packages for testing:
- `curl` - for Bash script
- `jq` - for JSON formatting in Bash script
- PowerShell 5.1+ for Windows users

## Starting the Server

1. Navigate to the backend directory:

```bash
cd src/backend
```

2. Install dependencies (if not already installed):

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

The server should start on port 5000 (or the port specified in your .env file).

## Using the Test Scripts

We've provided two test scripts - one for Bash (Linux/Mac) and one for PowerShell (Windows).

### Bash Script (Linux/Mac)

1. Make the script executable:

```bash
chmod +x test-api.sh
```

2. Run the test script:

```bash
./test-api.sh
```

### PowerShell Script (Windows)

1. You may need to set the execution policy to run the script:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

2. Run the test script:

```powershell
.\test-api.ps1
```

### Understanding the Test Scripts

The scripts test the following endpoints:

1. **Health Check**: Tests the server health endpoint
2. **Auth**: Tests registration and login
3. **User**: Tests retrieving user profile (authenticated)
4. **Project**: Tests creating and retrieving projects
5. **Character**: Tests character creation
6. **Plot**: Tests plot creation
7. **Chapter**: Tests chapter creation
8. **AI**: Tests text generation
9. **Export**: Tests export creation

The scripts use a sequential flow, where each successful request enables the next set of tests.

## Manual Testing with Swagger UI

The API also exposes Swagger documentation that you can use for manual testing:

1. Start the server (as explained above)
2. Open a browser and navigate to: `http://localhost:5000/api/docs`
3. The Swagger UI allows you to:
   - View all available endpoints
   - Test endpoints directly from the UI
   - Understand the required request/response formats

For authenticated endpoints, you'll need to:
1. Get a token by using the login endpoint
2. Click the "Authorize" button at the top of the page
3. Enter your token in the format: `Bearer your_token_here`
4. Click "Authorize" to use the token for all subsequent requests

## Common Issues and Troubleshooting

### Authentication Issues

- **Problem**: "Unauthorized" or 401 errors
- **Solution**: Ensure you're passing the token correctly in the Authorization header as `Bearer your_token_here`

### Schema Validation Errors

- **Problem**: 400 Bad Request with validation errors
- **Solution**: Check the error message for details about which fields are invalid. Ensure you're sending all required fields with the correct data types.

### Database Connection Issues

- **Problem**: Server fails to start with MongoDB connection errors
- **Solution**: 
  - Verify MongoDB is running
  - Check your connection string in the .env file
  - Ensure network access to the database (if using a remote instance)

### tRPC-specific Issues

- **Problem**: "No such procedure" errors
- **Solution**: Verify the procedure name exactly matches what's defined in the router (case-sensitive)

- **Problem**: Input validation errors
- **Solution**: Ensure your input exactly matches the Zod schema defined for the procedure

## Frontend Integration Notes

When integrating with the frontend:

1. **tRPC Client Setup**:
   - Ensure your frontend is correctly set up with the tRPC client
   - Match the types exported from the backend
   - Use the same baseUrl as your API server

2. **Authentication Flow**:
   - Store JWT tokens securely (e.g., in HttpOnly cookies or localStorage)
   - Implement a system to refresh tokens
   - Handle unauthorized errors gracefully

3. **Error Handling**:
   - Implement consistent error handling for tRPC errors
   - Pay special attention to validation errors

4. **Performance Considerations**:
   - Use tRPC's built-in caching for read-heavy operations
   - Consider implementing optimistic updates for better UX

5. **Progressive Enhancement**:
   - Start with core functionality and add features incrementally
   - Test each feature thoroughly before moving to the next

Remember that the tRPC implementation maintains type safety between frontend and backend, so leverage the TypeScript compiler to catch potential issues early. 