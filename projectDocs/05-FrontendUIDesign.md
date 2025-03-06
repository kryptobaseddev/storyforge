# StoryForge - Frontend UI Design

## UI Design Philosophy

StoryForge's UI is designed with the following principles:

1. **Kid-Friendly**: Large, clear elements with intuitive interactions
2. **Progressive Complexity**: Simple starting point with advanced features accessible as needed
3. **Visually Engaging**: Colorful, thematic elements that inspire creativity
4. **Consistent Layout**: Common patterns across different sections
5. **Contextual Assistance**: Help and guidance available where needed

## Technology Stack

- **Framework**: React with functional components and hooks
- **Styling**: Tailwind CSS for utility-first styling
- **Component Library**: shadcn/UI (based on Radix UI primitives)
- **Icons**: Lucide icons for consistent visual language
- **State Management**: React Context for global state
- **Form Handling**: React Hook Form with Zod validation
- **Text Editor**: TipTap for rich text editing
- **Visualizations**: D3.js for relationship mapping
- **Animations**: Tailwind CSS transitions and animations
- **API Integration**: tRPC client for type-safe API calls

## Design System

### Color Palette

```css
--primary: #6366f1;    /* Indigo */
--primary-light: #a5b4fc;
--primary-dark: #4338ca;
--secondary: #ec4899;  /* Pink */
--secondary-light: #f9a8d4;
--secondary-dark: #be185d;
--accent: #14b8a6;     /* Teal */
--accent-light: #5eead4;
--accent-dark: #0f766e;
--background: #f9fafb;
--foreground: #111827;
--muted: #f3f4f6;
--muted-foreground: #6b7280;
--card: #ffffff;
--card-foreground: #111827;
--border: #e5e7eb;
--input: #e5e7eb;
--success: #10b981;    /* Emerald */
--warning: #f59e0b;    /* Amber */
--error: #ef4444;      /* Red */
```

### Typography

```css
--font-primary: 'Inter', sans-serif;
--font-heading: 'Lexend', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

--font-size-xs: 0.75rem;   /* 12px */
--font-size-sm: 0.875rem;  /* 14px */
--font-size-base: 1rem;    /* 16px */
--font-size-lg: 1.125rem;  /* 18px */
--font-size-xl: 1.25rem;   /* 20px */
--font-size-2xl: 1.5rem;   /* 24px */
--font-size-3xl: 1.875rem; /* 30px */
--font-size-4xl: 2.25rem;  /* 36px */
```

### Spacing

Following Tailwind CSS's spacing scale with a base unit of 4px.

### Component Design

All components use shadcn/UI as a foundation with customizations for the StoryForge theme and kid-friendly design. Our UI component library includes:

- Layout components (Card, Sheet, Tabs, etc.)
- Form components (Input, Select, Checkbox, etc.)
- Feedback components (Alert, Toast, Progress, etc.)
- Navigation components (NavigationMenu, Breadcrumb, etc.)
- Overlay components (Dialog, Popover, etc.)
- Data display components (Table, Avatar, Badge, etc.)

## Page Layouts

### Global Layout

```
┌─────────────────────────────────────────────────────────────┐
│                        Header                               │
├─────────────┬───────────────────────────────┬───────────────┤
│             │                               │               │
│             │                               │               │
│   Sidebar   │         Main Content          │  Context      │
│   Navigation│                               │  Panel        │
│             │                               │               │
│             │                               │               │
│             │                               │               │
├─────────────┴───────────────────────────────┴───────────────┤
│                        Footer                               │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Behavior

- **Desktop**: Full three-column layout
- **Tablet**: Collapsible sidebar and context panel
- **Mobile**: Full-width content with modal sidebar and context panel

## Responsive Design

### Breakpoints
- **sm**: 640px (Mobile)
- **md**: 768px (Tablet)
- **lg**: 1024px (Desktop)
- **xl**: 1280px (Large Desktop)
- **2xl**: 1536px (Extra Large Desktop)

### Responsive Strategies
- Mobile-first approach
- Collapsible sidebar and panels on smaller screens
- Simplified layouts for mobile
- Touch-friendly targets on mobile
- Responsive typography
- Stack columns on smaller screens

## Component Architecture

Our component architecture is organized by feature and follows a clear hierarchy:

### Feature-based Organization

Components are organized by feature domains:
- Authentication (Login, Register, etc.)
- User Profile (Profile management, Preferences)
- Projects (List, Details, Creation/Editing)
- Characters (Management, Details, Relationships)
- Settings (World-building elements)
- Plots (Structure, Plot points)
- Chapters (Content editing, Organization)
- Exports (Format configuration, Downloads)
- AI Assistance (Text generation, Suggestions)

### Component Hierarchy

1. **Page Components**
   - Top-level routes that assemble feature components
   - Handle page-level state and data fetching
   - Provide layout context

2. **Feature Components**
   - Domain-specific functionality
   - Connected to API services
   - Handle feature-specific business logic

3. **Layout Components**
   - Structure the application
   - Provide consistent navigation
   - Handle responsive behavior

4. **Common Components**
   - Reusable across features
   - Handle common patterns
   - Provide consistent UI elements

5. **UI Components**
   - Lowest-level building blocks
   - Based on shadcn/UI library
   - Primitive UI elements

## Key Screens

### 1. Dashboard

The dashboard provides an overview of the user's projects and quick access to key functionality.

**Components:**
- `DashboardHeader`: Welcome message with personalized greeting
- `ProjectGrid`: Project cards grid with thumbnails and summary
- `QuickCreateButton`: New project creation
- `RecentActivityFeed`: Recent user activity
- `HelpPanel`: Help and tutorial cards
- `NavigationMenu`: Navigation to main sections

**Implementation:**
- Responsive grid layout using CSS Grid
- Card components for projects with hover effects
- Quick action buttons for common tasks

**Interactions:**
- Click on project cards to open project
- Drag and drop to reorder projects
- Hover effects for project cards
- Quick access to recently edited projects

### 2. Story Setup

The initial configuration screen for creating a new story project.

**Components:**
- `SetupWizard`: Multi-step form with progress indicator
- `GenreSelector`: Genre selection cards with illustrations
- `NarrativeTypeSelector`: Narrative type selection radio buttons
- `ToneStyleControls`: Tone and style sliders
- `LengthEstimator`: Target length input
- `TemplateGallery`: Template gallery with preview cards

**Implementation:**
- Step-based wizard interface with clear progression
- Visual selection cards for genres and templates
- Interactive controls for story parameters

**Interactions:**
- Step-by-step progression with next/back buttons
- Real-time preview updates as options are selected
- Hover tooltips for additional information
- Template selection with quick preview

### 3. Project Detail

The main project management interface showing all aspects of a story project.

**Components:**
- `ProjectHeader`: Title, status, and quick actions
- `ProjectNavigation`: Tabs for different project sections
- `ProjectStats`: Statistics and progress indicators
- `ProjectContent`: Main content area for current section
- `ProjectSidebar`: Context-aware sidebar with related information

**Implementation:**
- Tab-based navigation for different project aspects
- Progress visualization with charts and indicators
- Context-sensitive help and suggestions

### 4. Character Workshop

Interface for creating and managing characters.

**Components:**
- `CharacterList`: Sidebar listing characters
- `CharacterForm`: Creation/editing form
- `CharacterDetail`: Character information display
- `CharacterRelationships`: Relationship visualization
- `CharacterAIAssistant`: AI-powered suggestions
- `CharacterProfileCard`: Character profile card with details
- `CharacterAttributesTabs`: Tabbed sections for different character attributes
- `CharacterImageSelector`: Image/avatar selection

**Implementation:**
- Split-pane interface with list and detail views
- Form-based character creation with guided steps
- Interactive relationship visualization with D3.js
- AI-assisted character development

**Interactions:**
- Drag-and-drop relationship connections between characters
- In-place editing of character attributes
- AI assistance button with dropdown options
- Tabs for different character aspects (background, personality, etc.)
- Visual representation of character connections

### 5. Plot Architect

Interface for developing the story's plot structure.

**Components:**
- `PlotStructureVisualizer`: Plot structure visualization
- `PlotPointCards`: Draggable plot point cards
- `PlotTimeline`: Timeline interface for story progression
- `StoryArcTemplates`: Story arc templates for quick setup
- `PlotAIAssistant`: AI plot suggestion panel
- `PlotConnectionIndicators`: Visual connections between plot elements

**Implementation:**
- Interactive timeline representation of story structure
- Card-based plot points that can be arranged and connected
- Template-based starting points for common story structures

**Interactions:**
- Drag plot points onto timeline to arrange story
- Expand/collapse plot sections for different levels of detail
- Connect plot points to characters and settings
- Apply story structure templates as starting points
- Visualize character arcs across the plot

### 6. Chapter Editor

The writing environment for developing individual chapters.

**Components:**
- `ChapterEditor`: Rich text editor for content
- `ChapterToolbar`: Formatting and editing tools
- `ChapterNavigation`: Chapter structure navigation
- `ChapterAIAssistant`: AI writing assistance
- `ChapterContextPanel`: References and notes
- `WordCountDisplay`: Word count and reading level indicators

**Implementation:**
- TipTap-based rich text editor
- Split view for writing and reference materials
- AI integration for suggestions and continuations
- Context panel with character and plot references

**Rich Text Editor Features:**
- Formatting toolbar with text styling options
- Paragraph styles (headings, quotes, lists, etc.)
- Text formatting (bold, italic, underline, etc.)
- Embedded elements (images, notes, references)
- Markdown shortcuts for power users

**Interactions:**
- Rich text editing with formatting options
- Split view with reference materials
- AI suggestion insertion with one-click apply
- Chapter organization and navigation
- Contextual character and setting references

### 7. Export Interface

Interface for exporting the story in various formats.

**Components:**
- `ExportFormatSelector`: Format selection options
- `ExportConfigForm`: Format-specific settings
- `ExportPreview`: Preview of formatted output
- `ExportDownload`: Download management

**Implementation:**
- Step-based configuration wizard
- Live preview of export results
- Format-specific options and settings

## Special UI Components

### Visualization Components
- `RelationshipMap`: Interactive visualization of character relationships
- `PlotTimeline`: Visual representation of plot progression
- `StoryStructureDiagram`: Visualization of story structure and arcs
- `WorldMap`: Interactive map for settings and locations
- `CharacterNetworkGraph`: Network visualization of all character interactions
- `TimelineSlider`: Interactive timeline navigation for story events

### Rich Text Editor
- `FormattingToolbar`: Rich text formatting options
- `ParagraphStyleSelector`: Text block style selection
- `TextFormattingTools`: Inline text formatting
- `EmbeddedElementInserter`: Insert special elements like images or references
- `WritingAssistantPanel`: AI writing assistance integrated with editor
- `ReferencesSidebar`: Character and plot references panel

### Guidance System
- `InteractiveTutorials`: Step-by-step tutorials for new users
- `ContextualHelpCards`: Context-sensitive help cards
- `FeedbackMessages`: Encouraging feedback messages
- `StoryCoachCharacter`: Animated coach character that provides tips
- `GuidedSetupWizard`: Step-by-step process for new projects
- `ProgressCelebration`: Animations and messages for achievements

### AI Assistant Interface
- `SuggestionCards`: Cards showing AI-generated suggestions
- `MagicWandButton`: One-click AI generation buttons
- `ContextAwareHelpPanel`: Help based on current context
- `FeedbackMechanism`: Ways to improve AI responses
- `AIProviderSelector`: Options to select different AI providers
- `GenerationSettingsPanel`: Fine-tune AI generation parameters

### Tooltips and Popovers
- `ContextualHelpTooltips`: Help information on hover
- `InformationPopovers`: Detailed information in popover panels
- `FeatureExplanationTooltips`: New feature explanation tooltips
- `ReferencePreviewCards`: Preview content on hover
- `ShortcutHints`: Keyboard shortcut tooltips
- `DefinitionTooltips`: Explain writing-specific terminology

## UI Components

Our UI components library is based on shadcn/UI and includes:

### Input Components
- `Button`: Action buttons with variants
- `Input`: Text input fields
- `Select`: Dropdown selection
- `Checkbox`: Toggle selection
- `RadioGroup`: Option selection
- `Switch`: Toggle switches
- `Slider`: Range selection
- `Textarea`: Multi-line text input

### Display Components
- `Card`: Content containers
- `Avatar`: User and character avatars
- `Badge`: Status indicators
- `Alert`: User notifications
- `Progress`: Progress indicators
- `Skeleton`: Loading placeholders
- `Table`: Data tables

### Navigation Components
- `Tabs`: Content section navigation
- `NavigationMenu`: Dropdown navigation
- `Pagination`: Page navigation
- `Breadcrumb`: Path navigation
- `Sidebar`: Application navigation

### Layout Components
- `Sheet`: Slide-in panels
- `Dialog`: Modal dialogs
- `Drawer`: Side panels
- `Popover`: Contextual popups
- `HoverCard`: Preview cards

## Accessibility Features

All components are designed with accessibility in mind:

1. **Keyboard Navigation**
   - All interactive elements are keyboard navigable
   - Logical tab order throughout the application
   - Focus management for modals and dialogs
   - Keyboard shortcuts for common actions

2. **Screen Reader Support**
   - ARIA attributes on all components
   - Semantic HTML structure
   - Descriptive labels and announcements
   - Screen reader compatible components

3. **Visual Accessibility**
   - High contrast mode option
   - Scalable text and UI elements
   - Color schemes tested for color blindness
   - Adjustable text size settings
   - Color contrast meeting WCAG guidelines

4. **Motor Accessibility**
   - Large touch targets on mobile
   - Reduced motion option
   - Adjustable timing for interactions
   - Alternative input methods support

## Responsive Implementation

Our responsive implementation follows these principles:

1. **Mobile-First Approach**
   - Base styles for mobile
   - Progressive enhancement for larger screens
   - Tailwind breakpoints for consistent behavior

2. **Adaptive Layouts**
   - Single column on mobile
   - Two columns on tablet
   - Three columns on desktop

3. **Responsive Components**
   - Components adapt to available space
   - Touch-optimized on mobile
   - More detailed on larger screens

4. **Context-Aware UI**
   - Simplified UI on smaller screens
   - Progressive disclosure of advanced features
   - Context-specific controls based on screen size

## State Management

State management is implemented using:

1. **React Context**
   - `AuthContext`: User authentication state
   - `ProjectContext`: Current project data
   - `UIContext`: UI state (theme, sidebar, etc.)

2. **Local Component State**
   - Form state with React Hook Form
   - UI interaction state
   - Component-specific state

3. **API Integration**
   - Custom hooks for API data fetching
   - Mutation functions for data updates
   - Loading and error states

## Kid-Friendly UI Elements

1. **Visual Design**
   - Larger text and buttons
   - Clear iconography
   - Friendly color scheme
   - Visual cues and animations

2. **Interaction Design**
   - Simple, guided workflows
   - Forgiving interaction patterns
   - Clear feedback for actions
   - Confirmation for destructive actions

3. **Guidance System**
   - Interactive tutorials for new users
   - Contextual help throughout the application
   - Encouraging feedback for progress
   - "Story Coach" character that provides tips
   - Age-appropriate language
   - Encouraging messaging

## Implementation Status

The current implementation includes:

1. **Completed Components**
   - Core UI component library
   - Layout and navigation structure
   - Authentication forms
   - Project listing and creation

2. **In Progress**
   - Character management
   - Project detail views
   - Dashboard statistics
   - Story structure tools

3. **Upcoming**
   - Rich text editor for chapters
   - AI integration components
   - Export functionality
   - Advanced visualization tools 