# StoryForge - Frontend Components Plan

This document outlines all the UI components needed for the StoryForge application, their relationships, and how they'll connect to our backend APIs.

## Component Architecture

We'll structure our components using the following patterns:

1. **Atomic Design Methodology**:
   - Atoms: Basic UI elements (buttons, inputs, etc.)
   - Molecules: Simple component combinations
   - Organisms: Complex UI sections
   - Templates: Page layouts
   - Pages: Complete screens

2. **Component Organization**:
   ```
   src/
   ├── components/
   │   ├── ui/ (shadcn/Radix UI components)
   │   ├── layout/ (layout components)
   │   ├── auth/ (authentication components)
   │   ├── projects/ (project management components)
   │   ├── characters/ (character management components)
   │   ├── settings/ (setting management components)
   │   ├── plots/ (plot management components)
   │   ├── chapters/ (chapter management components)
   │   ├── exports/ (export functionality components)
   │   └── common/ (shared components)
   ├── hooks/ (custom React hooks)
   ├── lib/ (utility functions)
   ├── services/ (API service functions)
   ├── context/ (React context providers)
   └── pages/ (page components)
   ```

## Core UI Components (shadcn/Radix)

We'll leverage these shadcn/UI components based on Radix primitives:

1. **Layout Components**:
   - `Card`, `CardHeader`, `CardContent`, `CardFooter`
   - `Sheet` (for slideover panels)
   - `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent`
   - `Accordion`, `AccordionItem`, `AccordionTrigger`, `AccordionContent`
   - `ScrollArea` (for scrollable content with consistent styling)

2. **Form Components**:
   - `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormDescription`, `FormMessage`
   - `Input` (for text input)
   - `Textarea` (for multiline text)
   - `Select`, `SelectTrigger`, `SelectValue`, `SelectContent`, `SelectItem`
   - `RadioGroup`, `RadioGroupItem`
   - `Checkbox`
   - `Switch` (toggle)
   - `Slider` (for numeric ranges)

3. **Feedback Components**:
   - `Alert`, `AlertTitle`, `AlertDescription`
   - `Toast` (for notifications)
   - `Progress` (for loading indicators)
   - `Skeleton` (for loading states)

4. **Navigation Components**:
   - `NavigationMenu`
   - `Breadcrumb`
   - `Pagination`
   - `Command` (command palette for keyboard navigation)

5. **Overlay Components**:
   - `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`, `DialogFooter`, `DialogDescription`
   - `Popover`, `PopoverTrigger`, `PopoverContent`
   - `HoverCard`, `HoverCardTrigger`, `HoverCardContent`
   - `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem`

6. **Data Display Components**:
   - `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableCell`
   - `Avatar`, `AvatarImage`, `AvatarFallback`
   - `Badge`
   - `Separator`

## Custom Components by Feature

### Layout Components

1. **`MainLayout`**:
   - Contains site header, sidebar, and main content area
   - Handles responsive behavior

2. **`AppHeader`**:
   - Logo
   - Main navigation
   - User profile dropdown
   - Search
   - Notifications

3. **`Sidebar`**:
   - Project navigation
   - Tool navigation
   - Collapse/expand functionality

4. **`Footer`**:
   - Links
   - Copyright
   - Version info

### Authentication Components

1. **`LoginForm`**:
   - Email/username input
   - Password input
   - Remember me checkbox
   - Submit button
   - Forgot password link
   - Register link
   - OAuth options

2. **`RegisterForm`**:
   - Username input
   - Email input
   - Password input
   - Confirm password input
   - Terms acceptance checkbox
   - Submit button
   - Login link

3. **`ForgotPasswordForm`**:
   - Email input
   - Submit button
   - Back to login link

4. **`ResetPasswordForm`**:
   - New password input
   - Confirm password input
   - Submit button

5. **`ProfileSettings`**:
   - Personal information form
   - Password change form
   - Avatar upload
   - Account settings

### Project Management Components

1. **`ProjectList`**:
   - Project cards grid/list
   - Filtering options
   - Sorting options
   - Search functionality
   - Pagination

2. **`ProjectCard`**:
   - Title
   - Description snippet
   - Thumbnail/cover
   - Status indicator
   - Progress indicator
   - Quick actions dropdown

3. **`ProjectCreateForm`**:
   - Title input
   - Description textarea
   - Genre select
   - Target audience select
   - Template selection
   - Create button

4. **`ProjectDetailHeader`**:
   - Title (editable)
   - Description (editable)
   - Status dropdown
   - Actions dropdown (export, delete, etc.)
   - Collaborators list/management

5. **`ProjectDashboard`**:
   - Project statistics
   - Recent activity
   - Quick access to main project elements
   - Progress tracking
   - Upcoming tasks/goals

6. **`ProjectSettings`**:
   - General settings form
   - Collaboration settings
   - Advanced settings
   - Danger zone (delete project)

### Character Management Components

1. **`CharacterList`**:
   - Character cards grid/list
   - Filtering by type, role, importance
   - Sorting options
   - Search functionality
   - Quick view

2. **`CharacterCard`**:
   - Name
   - Image/avatar
   - Role tag
   - Short description
   - Quick actions
   
3. **`CharacterDetailView`**:
   - Editable fields for all character attributes
   - Character image/portrait
   - Tabbed sections (background, personality, relationships, etc.)
   - Relationship diagram
   - Notes editor

4. **`CharacterCreateForm`**:
   - Name input
   - Role select
   - Importance select
   - Basic attributes
   - AI generation option
   - Template selection

5. **`CharacterRelationshipManager`**:
   - Relationship graph visualization
   - Add/edit relationship form
   - Relationship type selector
   - Notes for each relationship

6. **`AICharacterGenerationForm`**:
   - Parameters for generation (personality traits, background elements, etc.)
   - Generation options
   - Results preview
   - Edit/save options

### Setting Management Components

1. **`SettingList`**:
   - Setting cards grid/list
   - Filtering by type
   - Sorting options
   - Search functionality
   - Quick view

2. **`SettingCard`**:
   - Name
   - Type tag
   - Image/thumbnail
   - Short description
   - Quick actions

3. **`SettingDetailView`**:
   - Editable fields for all setting attributes
   - Setting images
   - Tabbed sections (description, history, map, etc.)
   - Characters present in this setting
   - Timeline integration
   - Notes editor

4. **`SettingCreateForm`**:
   - Name input
   - Type select
   - Basic attributes
   - AI generation option
   - Template selection

5. **`MapEditor`**:
   - Interactive map with markers
   - Point of interest creation
   - Map annotation tools
   - Import/export functionality

### Plot Management Components

1. **`PlotList`**:
   - Plot cards grid/list
   - Filtering by type, status
   - Sorting options
   - Search functionality
   - Quick view

2. **`PlotCard`**:
   - Title
   - Structure type tag
   - Progress indicator
   - Short description
   - Quick actions

3. **`PlotDetailView`**:
   - Editable fields for plot attributes
   - Plot structure visualization
   - Plot points list/editor
   - Character involvement
   - Setting involvement
   - Notes editor

4. **`PlotStructureVisualizer`**:
   - Interactive visualization of plot structure
   - Drag-and-drop plot points
   - Highlight current focus
   - Different visualization modes (timeline, arc, etc.)

5. **`PlotPointEditor`**:
   - Type selector
   - Description editor
   - Character selector
   - Setting selector
   - Sequence position
   - Notes

6. **`AIPlotGenerationForm`**:
   - Parameters for generation
   - Structure type selection
   - Character inclusion
   - Results preview
   - Edit/save options

### Chapter Management Components

1. **`ChapterList`**:
   - Chapter cards list
   - Status indicators
   - Word count
   - Reorder functionality
   - Quick actions

2. **`ChapterCard`**:
   - Title
   - Order number
   - Status tag
   - Word count
   - Last edited date
   - Quick actions

3. **`ChapterEditor`**:
   - Rich text editor
   - Character reference sidebar
   - Setting reference sidebar
   - Plot reference sidebar
   - Notes panel
   - Word count tracker
   - Auto-save functionality

4. **`ChapterDetailHeader`**:
   - Title (editable)
   - Synopsis (editable)
   - Status dropdown
   - Word count display
   - Actions dropdown

5. **`AIChapterGenerationForm`**:
   - Synopsis input
   - Character selection
   - Setting selection
   - Plot points references
   - Generation parameters
   - Results preview
   - Edit/save options

### Export Components

1. **`ExportList`**:
   - Export history list
   - Status indicators
   - Download buttons
   - Filter by format
   - Delete options

2. **`ExportCreateForm`**:
   - Export name input
   - Format selection
   - Chapter selection
   - Configuration options
   - Cover page options
   - Style configuration

3. **`ExportPreview`**:
   - Preview of exported document
   - Page navigation
   - Download button
   - Back to edit button

4. **`ExportConfigurationPanel`**:
   - Format-specific options
   - Typography settings
   - Layout settings
   - Include/exclude sections
   - Style customization

## API Services Integration

Each component section will connect to the backend through dedicated service modules:

### Authentication Service
```typescript
// src/services/authService.ts
export const authService = {
  login: async (credentials) => {
    // Call POST /api/auth/login
  },
  register: async (userData) => {
    // Call POST /api/auth/register
  },
  logout: async () => {
    // Call POST /api/auth/logout
  },
  getProfile: async () => {
    // Call GET /api/auth/me
  },
  refreshToken: async () => {
    // Call POST /api/auth/refresh
  }
};
```

### Project Service
```typescript
// src/services/projectService.ts
export const projectService = {
  getProjects: async (filters) => {
    // Call GET /api/projects
  },
  createProject: async (projectData) => {
    // Call POST /api/projects
  },
  getProjectById: async (id) => {
    // Call GET /api/projects/:id
  },
  updateProject: async (id, projectData) => {
    // Call PUT /api/projects/:id
  },
  deleteProject: async (id) => {
    // Call DELETE /api/projects/:id
  },
  addCollaborator: async (id, userData) => {
    // Call POST /api/projects/:id/collaborators
  },
  removeCollaborator: async (id, userId) => {
    // Call DELETE /api/projects/:id/collaborators/:userId
  }
};
```

### Character Service
```typescript
// src/services/characterService.ts
export const characterService = {
  getCharacters: async (projectId) => {
    // Call GET /api/projects/:projectId/characters
  },
  createCharacter: async (projectId, characterData) => {
    // Call POST /api/projects/:projectId/characters
  },
  getCharacterById: async (projectId, id) => {
    // Call GET /api/projects/:projectId/characters/:id
  },
  updateCharacter: async (projectId, id, characterData) => {
    // Call PUT /api/projects/:projectId/characters/:id
  },
  deleteCharacter: async (projectId, id) => {
    // Call DELETE /api/projects/:projectId/characters/:id
  },
  getRelationships: async (projectId, id) => {
    // Call GET /api/projects/:projectId/characters/:id/relationships
  },
  updateRelationships: async (projectId, id, relationshipsData) => {
    // Call PUT /api/projects/:projectId/characters/:id/relationships
  }
};
```

Similar service modules will be created for:
- Settings (settingService.ts)
- Plots (plotService.ts)
- Chapters (chapterService.ts)
- Exports (exportService.ts)
- AI Generation (aiService.ts)

## Global State Management

We'll use React Context API for global state management:

1. **`AuthContext`**:
   - User authentication state
   - Login/logout functions
   - Token management
   - User profile data

2. **`ProjectContext`**:
   - Current project
   - Project list
   - Project operations

3. **`UIContext`**:
   - Theme control
   - Sidebar collapse state
   - Notification queue
   - Modal management

4. **`EditorContext`**:
   - Current editing content
   - Autosave functionality
   - Editing history
   - Reference panel state

## Responsive Design Strategy

1. **Breakpoints**:
   - Mobile: < 640px
   - Tablet: 640px - 1024px
   - Desktop: > 1024px

2. **Mobile-First Approach**:
   - Design for mobile first
   - Add complexity for larger screens
   - Use Tailwind's responsive modifiers consistently

3. **Component Adaptations**:
   - Sidebar becomes top navigation on mobile
   - List views switch to cards on smaller screens
   - Dialog becomes full-screen on mobile
   - Multi-column layouts collapse to single column

## Accessibility Considerations

1. **ARIA Attributes**:
   - Use proper roles, states, and properties
   - Manage focus appropriately
   - Provide sufficient contrast

2. **Keyboard Navigation**:
   - All interactions must be keyboard accessible
   - Logical tab order
   - Keyboard shortcuts for power users

3. **Screen Reader Support**:
   - Alternative text for images
   - Descriptive labels
   - Announcement of dynamic content

## Performance Optimization

1. **Code Splitting**:
   - Split code by routes
   - Lazy-load heavy components

2. **Memoization**:
   - Use React.memo for expensive renders
   - Use useMemo and useCallback appropriately

3. **Asset Optimization**:
   - Optimize images
   - Use appropriate formats (WebP where supported)
   - Lazy-load off-screen images

## Implementation Plan

### Phase 1: Core Infrastructure
1. Set up shadcn/UI components library
2. Implement layout components
3. Set up service modules
4. Implement authentication components

### Phase 2: Project Management
1. Implement project listing
2. Implement project creation
3. Implement project details view
4. Implement project settings

### Phase 3: Content Creation Tools
1. Implement character management
2. Implement setting management
3. Implement plot management
4. Implement chapter management

### Phase 4: AI Integration & Export
1. Implement AI generation forms
2. Implement export functionality
3. Implement sharing and collaboration features

## Next Steps

1. **Component Library Setup**:
   - Install and configure remaining shadcn/UI components
   - Create base theme configuration
   - Set up component documentation

2. **Layout Implementation**:
   - Build MainLayout component
   - Build AppHeader component
   - Build Sidebar component
   - Implement responsive behavior

3. **Authentication Integration**:
   - Implement auth service
   - Build login and registration forms
   - Set up auth context provider
   - Implement protected routes 