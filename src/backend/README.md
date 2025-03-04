# StoryForge Backend

This is the backend API for the StoryForge application, a creative writing platform that leverages AI to help writers create and develop their stories.

## Features

- **AI-powered content generation**: Generate characters, plots, settings, chapters, and editorial feedback
- **Image generation**: Create images for characters, settings, and scenes
- **Project management**: Create, read, update, and delete writing projects
- **User authentication**: Register, login, and manage user accounts
- **Content management**: Save, organize, and retrieve generated content

## Tech Stack

- **Node.js**: JavaScript runtime
- **Express**: Web framework
- **TypeScript**: Type-safe JavaScript
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling
- **OpenAI API**: AI content and image generation
- **JWT**: Authentication

## Project Structure

```
src/
├── ai/                 # AI service and related utilities
│   ├── helpers/        # Helper functions for AI
│   ├── parsers/        # Functions to parse AI responses
│   ├── templates/      # Prompt templates
│   ├── config.ts       # AI configuration
│   ├── service.ts      # Main AI service
│   └── types.ts        # Type definitions
├── controllers/        # Request handlers
├── middleware/         # Express middleware
├── models/             # Mongoose models
├── routes/             # API routes
├── scripts/            # Utility scripts
├── utils/              # Utility functions
└── index.ts            # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd src/backend
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/storyforge
   JWT_SECRET=your_jwt_secret
   OPENAI_API_KEY=your_openai_api_key
   ```

### Development

```bash
# Start the development server
npm run dev

# Build the project
npm run build

# Start the production server
npm start
```

### Testing

```bash
# Test the AI service directly
npm run test:ai

# Test the AI routes through HTTP requests
npm run test:ai-routes
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user

### Projects

- `GET /api/projects` - Get all projects for the current user
- `POST /api/projects` - Create a new project
- `GET /api/projects/:id` - Get a project by ID
- `PUT /api/projects/:id` - Update a project
- `DELETE /api/projects/:id` - Delete a project

### AI

- `POST /api/ai/generate` - Generate AI content
- `POST /api/ai/generate-image` - Generate an AI image
- `PUT /api/ai/generations/:generation_id/save` - Save an AI generation

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a pull request

## License

This project is licensed under the MIT License. 