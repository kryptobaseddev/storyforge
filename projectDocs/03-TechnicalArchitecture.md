# StoryForge - Technical Architecture

## System Architecture

### Component Overview
```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                     React Frontend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   UI        │  │  State      │  │  Component          │  │
│  │ Components  │◄─┤ Management  │◄─┤  Libraries          │  │
│  │(shadcn/UI)  │  │  (Redux)    │  │(TipTap, D3.js, etc)│  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Express Backend                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   tRPC      │  │  Auth       │  │  AI Integration     │  │
│  │   Routers   │◄─┤  System     │◄─┤  Service            │  │
│  │ + OpenAPI   │  │  (JWT)      │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    MongoDB Database                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  User       │  │  Story      │  │  Generated          │  │
│  │  Data       │◄─┤  Elements   │◄─┤  Content            │  │
│  │             │  │             │  │                     │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                  External AI Services                       │
│  ┌─────────────┐  ┌─────────────┐                           │
│  │  OpenAI     │  │  Anthropic  │                           │
│  │   API       │  │  Claude API │                           │
│  │             │  │             │                           │
│  └─────────────┘  └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

1. User interacts with React UI components
2. Frontend sends requests to Express backend using tRPC procedures
3. Backend authenticates requests using JWT
4. Backend processes requests and interacts with MongoDB
5. For AI-related features, backend communicates with external AI services
6. Results flow back through the stack to the user interface with full type safety

## Technology Stack

### Frontend
- **Framework**: React
- **State Management**: Redux
- **API Communication**: tRPC client with React Query
- **Styling**: Tailwind CSS
- **Component Library**: shadcn/UI (based on Radix UI)
- **Rich Text Editing**: TipTap (based on ProseMirror)
- **Visualization**: D3.js for relationship mapping
- **Build Tools**: Vite

### Backend
- **Framework**: Node.js with Express
- **API Architecture**: tRPC with OpenAPI/Swagger generation
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Zod (integrated with tRPC)
- **Middleware**: tRPC middleware, CORS, Helmet, Morgan
- **File Handling**: Multer
- **API Documentation**: OpenAPI/Swagger (generated from tRPC)

### Database
- **Database**: MongoDB
- **ODM**: Mongoose
- **Indexing**: For performance optimization
- **Validation**: Schema-level validation

### AI Integration
- **LLM Services**: OpenAI API / Anthropic Claude API
- **Context Management**: Custom prompt engineering system
- **Text Processing**: Natural language processing utilities

### Export System
- **Document Generation**: Custom export service
- **Supported Formats**: TXT, MD, PDF, ePub
- **Formatting Engine**: Custom templates

## Key Implementation Considerations

### Security
- JWT-based authentication
- HTTPS for all communications
- Input validation with Zod schema validation
- Protection against common web vulnerabilities

### Performance
- Efficient database queries
- Optimized AI token usage
- Frontend performance optimization with React Query caching
- Caching strategies

### Scalability
- Modular tRPC router architecture for easy expansion
- Stateless backend for horizontal scaling
- Efficient database indexing
- Chunking large narratives for processing

### Accessibility
- Kid-friendly interface elements
- Screen reader compatibility
- Keyboard navigation
- Color contrast compliance 