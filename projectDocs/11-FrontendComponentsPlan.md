# StoryForge - Frontend Components Plan (Updated)

This document outlines the UI components needed for the StoryForge application, their relationships, and how they'll connect to our backend APIs, aligned with the current project structure.

## Current Frontend Structure

The frontend is currently organized as follows:
```
src/
├── components/
│   ├── features/       (Feature-specific components)
│   │   ├── ai/         (AI generation components)
│   │   ├── characters/ (Character management components)
│   │   ├── projects/   (Project management components)
│   │   └── auth/       (Authentication components)
│   ├── layout/         (Layout components)
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Footer.tsx
│   │   └── MainLayout.tsx
│   ├── common/         (Common reusable components)
│   └── ui/             (shadcn/UI components)
├── context/            (React context providers)
├── pages/              (Page components)
│   ├── dashboard/
│   └── projects/
├── lib/                (Utility functions)
├── hooks/              (Custom React hooks)
├── services/           (API service modules)
├── assets/             (Static resources)
├── App.tsx             (Main application component)
├── App.css             (Global styles)
├── index.css           (Global styles with Tailwind)
├── main.tsx            (Application entry point)
└── vite-env.d.ts       (Type declarations)
```

## Component Organization (Revised)

Building on the existing structure, we will organize components as follows:

### 1. Feature Components
```
src/components/features/
├── ai/                        (AI generation components)
│   ├── AIGenerationForm.tsx   (Form for generating AI content)
│   ├── AIResultDisplay.tsx    (Display for AI generation results)
│   ├── ImageGenerationForm.tsx (Form for image generation with OpenAI)
│   ├── TextGenerationForm.tsx  (Form for text generation)
│   ├── AISelectionControl.tsx  (Controls for selecting AI provider)
│   └── AIPromptBuilder.tsx     (Helper for building effective prompts)
├── auth/                      (Authentication components)
│   ├── LoginForm.tsx          (User login)
│   ├── RegisterForm.tsx       (User registration)
│   ├── ForgotPasswordForm.tsx (Password recovery)
│   ├── ProfileForm.tsx        (User profile editing)
│   └── PasswordChangeForm.tsx (Password change)
├── characters/                (Character management)
│   ├── CharacterList.tsx      (List of characters)
│   ├── CharacterCard.tsx      (Individual character display)
│   ├── CharacterForm.tsx      (Character creation/editing)
│   ├── CharacterRelationships.tsx (Relationship management)
│   ├── CharacterAttributes.tsx (Character attributes editing)
│   └── CharacterGenerationForm.tsx (AI character generation)
├── projects/                  (Project management)
│   ├── ProjectList.tsx        (List of projects)
│   ├── ProjectCard.tsx        (Individual project display)
│   ├── ProjectForm.tsx        (Project creation/editing)
│   ├── ProjectCollaborators.tsx (Collaborator management)
│   └── ProjectSettings.tsx    (Project settings)
├── settings/                  (Setting management)
│   ├── SettingList.tsx        (List of settings)
│   ├── SettingCard.tsx        (Individual setting display)
│   ├── SettingForm.tsx        (Setting creation/editing)
│   ├── MapEditor.tsx          (Interactive map editor)
│   └── SettingGenerationForm.tsx (AI setting generation)
├── plots/                     (Plot management)
│   ├── PlotList.tsx           (List of plots)
│   ├── PlotCard.tsx           (Individual plot display)
│   ├── PlotForm.tsx           (Plot creation/editing)
│   ├── PlotStructureVisualizer.tsx (Plot structure visualization)
│   ├── PlotPointEditor.tsx    (Plot point editing)
│   └── PlotGenerationForm.tsx (AI plot generation)
├── chapters/                  (Chapter management)
│   ├── ChapterList.tsx        (List of chapters)
│   ├── ChapterCard.tsx        (Individual chapter display)
│   ├── ChapterEditor.tsx      (Rich text editor for chapters)
│   ├── ChapterOutline.tsx     (Chapter outlining)
│   └── ChapterGenerationForm.tsx (AI chapter generation)
└── exports/                   (Export functionality)
    ├── ExportList.tsx         (List of exports)
    ├── ExportForm.tsx         (Export configuration)
    ├── ExportPreview.tsx      (Preview of export)
    └── ExportFormatSettings.tsx (Format-specific settings)
```

### 2. Layout Components
```
src/components/layout/
├── MainLayout.tsx      (Main application layout wrapper)
├── Header.tsx          (Application header with navigation)
├── Sidebar.tsx         (Side navigation menu)
├── Footer.tsx          (Application footer)
├── ProjectLayout.tsx   (Project-specific layout)
└── ContentLayout.tsx   (Content area layout with breadcrumbs)
```

### 3. Common Components
```
src/components/common/
├── Breadcrumb.tsx      (Breadcrumb navigation)
├── EmptyState.tsx      (Empty state placeholder)
├── ErrorBoundary.tsx   (Error handling wrapper)
├── LoadingIndicator.tsx (Loading spinner/skeleton)
├── ConfirmDialog.tsx   (Confirmation dialog)
├── SearchBar.tsx       (Reusable search bar)
├── StatusBadge.tsx     (Status indicator badge)
├── IconButton.tsx      (Button with icon)
├── FileUploader.tsx    (File upload component)
└── Tooltip.tsx         (Tooltip wrapper)
```

### 4. UI Components (shadcn/Radix)
```
src/components/ui/
├── Button.tsx          (Button component)
├── Card.tsx            (Card container)
├── Input.tsx           (Text input)
├── Select.tsx          (Select dropdown)
├── TextArea.tsx        (Multi-line text input)
├── Checkbox.tsx        (Checkbox input)
├── RadioGroup.tsx      (Radio button group)
├── Toggle.tsx          (Toggle switch)
├── Dialog.tsx          (Modal dialog)
├── Tabs.tsx            (Tabbed interface)
├── Alert.tsx           (Alert message)
├── Toast.tsx           (Toast notifications)
├── DropdownMenu.tsx    (Dropdown menu)
├── Avatar.tsx          (User avatar)
├── Badge.tsx           (Status badge)
├── ProgressBar.tsx     (Progress indicator)
├── Spinner.tsx         (Loading spinner)
└── Tooltip.tsx         (Tooltip for elements)
```

### 5. Page Components
```
src/pages/
├── auth/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ForgotPasswordPage.tsx
│   └── ProfilePage.tsx
├── dashboard/
│   └── DashboardPage.tsx
├── projects/
│   ├── ProjectsPage.tsx
│   ├── ProjectDetailPage.tsx
│   └── ProjectCreatePage.tsx
├── characters/
│   ├── CharactersPage.tsx
│   ├── CharacterDetailPage.tsx
│   └── CharacterCreatePage.tsx
├── settings/
│   ├── SettingsPage.tsx
│   ├── SettingDetailPage.tsx
│   └── SettingCreatePage.tsx
├── plots/
│   ├── PlotsPage.tsx
│   ├── PlotDetailPage.tsx
│   └── PlotCreatePage.tsx
├── chapters/
│   ├── ChaptersPage.tsx
│   ├── ChapterDetailPage.tsx
│   └── ChapterCreatePage.tsx
└── exports/
    ├── ExportsPage.tsx
    └── ExportCreatePage.tsx
```

### 6. Services (API Integration)
```
src/services/
├── api.ts              (Base API client)
├── auth.service.ts     (Authentication service)
├── project.service.ts  (Project management service)
├── character.service.ts (Character management service)
├── setting.service.ts  (Setting management service)
├── plot.service.ts     (Plot management service)
├── chapter.service.ts  (Chapter management service)
├── export.service.ts   (Export functionality service)
└── ai.service.ts       (AI integration service)
```

### 7. Custom Hooks
```
src/hooks/
├── useAuth.ts          (Authentication hooks)
├── useProjects.ts      (Project management hooks)
├── useCharacters.ts    (Character management hooks)
├── useSettings.ts      (Setting management hooks)
├── usePlots.ts         (Plot management hooks)
├── useChapters.ts      (Chapter management hooks)
├── useExports.ts       (Export functionality hooks)
├── useForm.ts          (Form handling hooks)
├── useToast.ts         (Toast notification hooks)
└── useAI.ts            (AI integration hooks)
```

## Core UI Components (shadcn/Radix)

We'll leverage shadcn/UI components based on Radix UI primitives, organized in the `src/components/ui/` directory:

1. **Layout Components**:
   - Card
   - Sheet
   - Tabs
   - Accordion
   - ScrollArea

2. **Form Components**:
   - Form and form elements
   - Input
   - Textarea
   - Select
   - RadioGroup
   - Checkbox
   - Switch
   - Slider

3. **Feedback Components**:
   - Alert
   - Toast
   - Progress
   - Skeleton

4. **Navigation Components**:
   - NavigationMenu
   - Breadcrumb
   - Pagination
   - Command

5. **Overlay Components**:
   - Dialog
   - Popover
   - HoverCard
   - DropdownMenu

6. **Data Display Components**:
   - Table
   - Avatar
   - Badge
   - Separator

## Feature Component Details

For detailed specifications of feature components, see the separate document: `projectDocs/12-FeatureComponentsDetail.md`

## UI/UX Design Considerations

### Responsive Design

The application must be fully responsive across all device sizes:

1. **Mobile (< 640px)**
   - Single column layout
   - Collapsed sidebar with hamburger menu
   - Simplified cards and forms
   - Touch-friendly inputs and buttons

2. **Tablet (640px - 1024px)**
   - Optional sidebar based on available space
   - Two-column layout where appropriate
   - Grid views for lists (2-3 cards per row)

3. **Desktop (> 1024px)**
   - Full sidebar always visible
   - Multi-column layouts
   - Grid views for lists (3-4 cards per row)
   - Advanced editing tools visible

### Navigation Structure

1. **Global Navigation** (Header)
   - Application logo/home link
   - User profile dropdown
   - Global search
   - Notifications
   - Theme toggle

2. **Project Navigation** (Sidebar)
   - Dashboard link
   - Projects list
   - Project-specific links when in a project context

3. **Content Navigation**
   - Breadcrumb trails
   - Tabs for different sections
   - Back/forward buttons where appropriate

### Accessibility Considerations

1. **Keyboard Navigation**
   - All interactive elements must be focusable
   - Logical tab order
   - Keyboard shortcuts for common actions

2. **Screen Readers**
   - Proper ARIA attributes
   - Alt text for images
   - Descriptive labels
   - Meaningful headings

3. **Visual Accessibility**
   - High contrast modes
   - Text scalability
   - Color blindness considerations
   - Focus indicators

### Loading States

1. **Initial Loading**
   - Full-page loading spinner
   - Progressive content loading where possible

2. **Content Loading**
   - Skeleton loaders for cards and lists
   - Progress indicators for long operations

3. **Form Submission**
   - Disable buttons during submission
   - Show progress indicators
   - Clear feedback on success or failure

## API Services Integration

### Base API Client

```typescript
// src/services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### Feature-Specific Services

Services will be created for each major feature area, aligning with our backend endpoints:

1. **Authentication Service** - `/api/auth/*` endpoints
2. **Project Service** - `/api/projects/*` endpoints
3. **Character Service** - `/api/projects/:projectId/characters/*` endpoints
4. **Setting Service** - `/api/projects/:projectId/settings/*` endpoints
5. **Plot Service** - `/api/projects/:projectId/plots/*` endpoints
6. **Chapter Service** - `/api/projects/:projectId/chapters/*` endpoints
7. **Export Service** - `/api/projects/:projectId/exports/*` endpoints
8. **AI Service** - `/api/ai/*` endpoints

## AI Integration Strategy

The application will support dual AI providers to optimize cost and functionality:

### 1. AI Provider Integration

```typescript
// src/services/ai.service.ts
import api from './api';

export enum AIProvider {
  OPENAI = 'openai',
  DEEPSEEK = 'deepseek'
}

export const aiService = {
  // Text generation with provider selection
  generateText: async (prompt, options = {}) => {
    const { provider = AIProvider.DEEPSEEK, ...otherOptions } = options;
    return await api.post('/ai/generate', {
      prompt,
      provider,
      ...otherOptions
    });
  },
  
  // Image generation (OpenAI only)
  generateImage: async (prompt, options = {}) => {
    return await api.post('/ai/generate-image', {
      prompt,
      provider: AIProvider.OPENAI, // Only OpenAI supports image generation
      ...options
    });
  },
  
  // Save a generation
  saveGeneration: async (generationId, metadata = {}) => {
    return await api.put(`/ai/generations/${generationId}/save`, metadata);
  },
  
  // Get cost estimate for a generation
  getCostEstimate: async (prompt, options = {}) => {
    const { provider = AIProvider.DEEPSEEK, ...otherOptions } = options;
    return await api.post('/ai/estimate-cost', {
      prompt,
      provider,
      ...otherOptions
    });
  }
};
```

### 2. AI Provider Selection Strategy

The application will intelligently choose the appropriate AI provider:

1. **Deepseek LLM**
   - Used for content generation that requires large context windows
   - Preferred for most text generation tasks due to lower cost
   - Default provider for character, setting, plot, and chapter generation
   - Better for handling longer context and detailed writing tasks

2. **OpenAI**
   - Used for image generation (Deepseek doesn't offer this)
   - Used when specific capabilities only available in OpenAI are needed
   - Better for certain specialized tasks (if determined through testing)

3. **User Choice**
   - Advanced users can manually select the provider
   - Cost estimates shown before generation
   - Quality comparison options available

### 3. AI Feature Components

Special components will be needed for the AI integration:

1. **AIProviderSelector**
   - Allows selection between available AI providers
   - Shows capabilities and cost comparison
   - Remembers user preferences

2. **AIGenerationForm**
   - Adapts based on selected provider
   - Shows estimated cost before submission
   - Handles provider-specific parameters

3. **AIResultComparison**
   - Allows comparing results from different providers
   - Shows cost and quality metrics
   - Helps users make informed decisions

## Context Providers

The application will use several context providers for state management:

1. **AuthContext** - User authentication state
2. **ProjectContext** - Current project data
3. **UIContext** - UI state (theme, sidebar, etc.)
4. **AIContext** - AI provider preferences and history

## Implementation Phases

### Phase 1: Core Infrastructure & Auth
- Layout components (Header, Sidebar, Footer)
- Authentication (Login, Register)
- Base API services
- Context providers

### Phase 2: Project Management
- Project listing and creation
- Project details and settings
- Collaborator management

### Phase 3: Content Creation
- Character management
- Setting management
- Plot management
- Chapter management

### Phase 4: AI Integration & Export
- AI generation features with dual providers
- Export functionality
- Final integration and optimization

## Testing Strategy

### 1. Component Testing
- Unit tests for individual components
- Storybook for component visualization and interaction testing
- Accessibility testing for all components

### 2. Integration Testing
- Test API service integration with mock backend
- Test context providers and component interaction
- Test routing and navigation

### 3. End-to-End Testing
- Full user flow testing
- Cross-browser and device testing
- Performance testing

### 4. AI Integration Testing
- Test both AI providers with various inputs
- Test fallback mechanisms
- Test cost optimization strategies

## Next Steps

1. **Complete Layout Implementation**
   - Finalize MainLayout, Header, Sidebar, Footer
   - Implement responsive behavior

2. **API Service Layer**
   - Create base API client
   - Implement authentication service
   - Implement project service

3. **Authentication UI**
   - Implement login and registration forms
   - Create authentication context
   - Add protected route handling

4. **Project Management UI**
   - Implement project listing and creation
   - Create project details view
   
5. **AI Integration**
   - Implement AI service with provider selection
   - Create AI generation components
   - Test cost optimization strategies 