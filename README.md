# StoryForge

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Overview

StoryForge is a kid-friendly AI-assisted narrative development platform that helps young writers create, develop, and export stories with interactive tools and AI guidance. The platform guides users through the process of creating characters, settings, plot structures, and narrative content with age-appropriate AI assistance.

## Features

- **Character Workshop**: Create and develop characters with AI-assisted suggestions
- **Settings Workshop**: Build detailed settings and environments for your story
- **Plot Architect**: Design and structure your story's plot with visual tools
- **Chapter Forge**: Write and organize your story with contextual assistance
- **AI Story Coach**: Get helpful suggestions and guidance throughout the process
- **Export Studio**: Generate your story in various formats for sharing and reading

## Tech Stack

### Frontend
- React
- Tailwind CSS
- shadcn/UI (based on Radix UI)
- TipTap rich text editor
- Redux for state management
- D3.js for visualizations

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT authentication
- OpenAI/Claude API integration
- PDF generation

## Project Structure

```
storyforge/
│
├── projectDocs/           # Project documentation and development guides
│
├── src/                   # Source code
│   ├── frontend/          # React frontend application
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   ├── hooks/         # Custom hooks
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── styles/        # Global styles
│   │   └── utils/         # Utility functions
│   │
│   └── backend/           # Node.js/Express backend
│       ├── config/        # Configuration files
│       ├── controllers/   # Route controllers
│       ├── middleware/    # Express middleware
│       ├── models/        # Mongoose models
│       ├── routes/        # API routes
│       ├── services/      # Business logic
│       └── utils/         # Utility functions
│
├── .env                   # Environment variables (create from .env.example)
├── .gitignore             # Git ignore file
├── package.json           # Project dependencies
└── README.md              # Project documentation
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- npm or yarn
- OpenAI API key or Claude API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/storyforge.git
   cd storyforge
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd src/frontend
   npm install
   
   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   ```bash
   # Create .env file in the backend directory
   cp .env.example .env
   
   # Edit .env with your configuration
   # DB_URI=your_mongodb_uri
   # AI_API_KEY=your_api_key
   # JWT_SECRET=your_jwt_secret
   ```

4. Start development servers:
   ```bash
   # Start backend server (from backend directory)
   npm run dev
   
   # Start frontend server (from frontend directory in a new terminal)
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Development

### Project Documentation

See the `projectDocs` folder for detailed documentation:

- [Project Roadmap](projectDocs/01-ProjectRoadmap.md)
- [Development Guidelines](projectDocs/02-DevelopmentGuidelines.md)
- [Technical Architecture](projectDocs/03-TechnicalArchitecture.md)
- [Database Schema](projectDocs/04-DatabaseSchema.md)
- [Frontend UI Design](projectDocs/05-FrontendUIDesign.md)
- [AI Integration](projectDocs/06-AIIntegration.md)
- [Implementation Plan](projectDocs/07-ImplementationPlan.md)

### Adding New Features

1. Refer to the Project Roadmap to understand the current phase
2. Follow the Development Guidelines for code standards
3. Update documentation as needed
4. Create a pull request with your changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for UI components
- [TipTap](https://tiptap.dev/) for rich text editing
- [MongoDB](https://www.mongodb.com/) for database
- [OpenAI](https://openai.com/) for AI capabilities 