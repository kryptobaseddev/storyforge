# StoryForge - Feature Components Detail

This document provides detailed specifications for the feature components used in the StoryForge application.

## Table of Contents
1. [Layout Components](#layout-components)
2. [Authentication Components](#authentication-components)
3. [Project Components](#project-components)
4. [Character Components](#character-components)
5. [Setting Components](#setting-components)
6. [Plot Components](#plot-components)
7. [Chapter Components](#chapter-components)
8. [Export Components](#export-components)
9. [AI Components](#ai-components)

## Layout Components

### MainLayout (`src/components/layout/MainLayout.tsx`)
- **Purpose**: Serves as the main container for the entire application
- **Features**:
  - Contains Header, Sidebar, and main content area
  - Manages sidebar visibility state
  - Handles responsive behavior
  - Utilizes `<Outlet>` from React Router for content rendering
- **State**:
  - `sidebarOpen`: Boolean to track sidebar visibility
- **Props**:
  - None (uses children or Outlet)
- **Dependencies**:
  - `Header`, `Sidebar`, `Footer` components
  - React Router

### Header (`src/components/layout/Header.tsx`)
- **Purpose**: Provides global navigation and user controls
- **Features**:
  - Displays app logo and brand
  - Contains main navigation links
  - Shows user profile menu/dropdown
  - Includes search functionality
  - Provides theme toggle
  - Shows notifications
- **Props**:
  - `toggleSidebar`: Function to toggle sidebar visibility
- **Dependencies**:
  - Authentication context
  - UI/theme context

### Sidebar (`src/components/layout/Sidebar.tsx`)
- **Purpose**: Provides contextual navigation
- **Features**:
  - Shows project navigation
  - Displays tool navigation
  - Collapses/expands as needed
  - Highlights active route
- **Props**:
  - `isOpen`: Boolean to control visibility
- **Dependencies**:
  - Authentication context
  - Project context
  - React Router

### Footer (`src/components/layout/Footer.tsx`)
- **Purpose**: Provides site-wide footer information
- **Features**:
  - Shows copyright information
  - Displays useful links
  - Shows version information
- **Props**:
  - None
- **Dependencies**:
  - None

## Authentication Components

### LoginForm (`src/components/features/auth/LoginForm.tsx`)
- **Purpose**: Allows users to log in to the application
- **Features**:
  - Email/username input
  - Password input with show/hide toggle
  - Remember me checkbox
  - Form validation
  - Error handling
  - Forgot password link
  - Register link
- **State**:
  - Form state (email, password, remember)
  - Loading state
  - Error state
- **Props**:
  - `onSuccess`: Callback function after successful login
- **API Integration**:
  - Uses `authService.login`

### RegisterForm (`src/components/features/auth/RegisterForm.tsx`)
- **Purpose**: Allows new users to create an account
- **Features**:
  - Username input
  - Email input
  - Password input with strength meter
  - Password confirmation
  - Terms acceptance checkbox
  - Form validation
  - Error handling
- **State**:
  - Form state (username, email, password, confirmPassword, acceptTerms)
  - Loading state
  - Error state
- **Props**:
  - `onSuccess`: Callback function after successful registration
- **API Integration**:
  - Uses `authService.register`

### ForgotPasswordForm (`src/components/features/auth/ForgotPasswordForm.tsx`)
- **Purpose**: Allows users to request password reset
- **Features**:
  - Email input
  - Form validation
  - Success messaging
  - Error handling
  - Back to login link
- **State**:
  - Form state (email)
  - Loading state
  - Success state
  - Error state
- **Props**:
  - `onSuccess`: Callback function after successful submission
- **API Integration**:
  - Uses `authService.forgotPassword`

### ProfileForm (`src/components/features/auth/ProfileForm.tsx`)
- **Purpose**: Allows users to edit their profile information
- **Features**:
  - Personal information fields (name, email, etc.)
  - Avatar upload/management
  - Form validation
  - Success messaging
  - Error handling
- **State**:
  - Form state (user data)
  - Loading state
  - Success state
  - Error state
- **Props**:
  - `userData`: Initial user data
  - `onSuccess`: Callback function after successful update
- **API Integration**:
  - Uses `authService.updateProfile`

### PasswordChangeForm (`src/components/features/auth/PasswordChangeForm.tsx`)
- **Purpose**: Allows users to change their password
- **Features**:
  - Current password input
  - New password input with strength meter
  - Password confirmation
  - Form validation
  - Success messaging
  - Error handling
- **State**:
  - Form state (currentPassword, newPassword, confirmPassword)
  - Loading state
  - Success state
  - Error state
- **Props**:
  - `onSuccess`: Callback function after successful password change
- **API Integration**:
  - Uses `authService.changePassword`

## Project Components

### ProjectList (`src/components/features/projects/ProjectList.tsx`)
- **Purpose**: Displays a list of user's projects
- **Features**:
  - Grid/list view toggle
  - Sorting options (name, date, status)
  - Filtering options (genre, status)
  - Search functionality
  - Pagination
  - Empty state
- **State**:
  - Projects data
  - Loading state
  - View type (grid/list)
  - Sort and filter options
  - Search query
- **Props**:
  - `onSelect`: Callback for project selection
  - `viewType`: Optional default view type
- **API Integration**:
  - Uses `projectService.getProjects`

### ProjectCard (`src/components/features/projects/ProjectCard.tsx`)
- **Purpose**: Displays individual project information
- **Features**:
  - Project title and description
  - Status indicator (badge)
  - Progress indicator
  - Last modified date
  - Quick action menu
  - Thumbnail/cover (if available)
- **Props**:
  - `project`: Project data object
  - `onSelect`: Callback for project selection
  - `onEdit`: Callback for edit action
  - `onDelete`: Callback for delete action
- **API Integration**:
  - None directly (displays passed data)

### ProjectForm (`src/components/features/projects/ProjectForm.tsx`)
- **Purpose**: Form for creating/editing projects
- **Features**:
  - Title and description inputs
  - Genre selection
  - Target audience selection
  - Template selection (for new projects)
  - Form validation
  - Success/error handling
- **State**:
  - Form state (project data)
  - Loading state
  - Error state
- **Props**:
  - `projectData`: Initial project data (for editing)
  - `isEdit`: Boolean to indicate edit mode
  - `onSuccess`: Callback after successful submission
- **API Integration**:
  - Uses `projectService.createProject` or `projectService.updateProject`

### ProjectCollaborators (`src/components/features/projects/ProjectCollaborators.tsx`)
- **Purpose**: Manages project collaborators
- **Features**:
  - List of current collaborators
  - Add collaborator form
  - Remove collaborator functionality
  - Role management
  - Permission explanation
- **State**:
  - Collaborators data
  - Form state (new collaborator)
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `onUpdate`: Callback after changes
- **API Integration**:
  - Uses `projectService.addCollaborator`
  - Uses `projectService.removeCollaborator`

### ProjectSettings (`src/components/features/projects/ProjectSettings.tsx`)
- **Purpose**: Manages project settings
- **Features**:
  - General settings (privacy, archive)
  - Export settings
  - Advanced settings
  - Danger zone (delete project)
- **State**:
  - Settings data
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `onUpdate`: Callback after changes
- **API Integration**:
  - Uses various project service methods

## Character Components

### CharacterList (`src/components/features/characters/CharacterList.tsx`)
- **Purpose**: Displays a list of characters in a project
- **Features**:
  - Grid/list view toggle
  - Sorting options (name, importance, etc.)
  - Filtering options (role, status, etc.)
  - Search functionality
  - Grouping options (by role, importance)
  - Empty state
- **State**:
  - Characters data
  - Loading state
  - View type (grid/list)
  - Sort, filter, and group options
  - Search query
- **Props**:
  - `projectId`: ID of the project
  - `onSelect`: Callback for character selection
- **API Integration**:
  - Uses `characterService.getCharacters`

### CharacterCard (`src/components/features/characters/CharacterCard.tsx`)
- **Purpose**: Displays individual character information
- **Features**:
  - Character name and image
  - Role and importance indicators
  - Short description
  - Quick action menu
  - Relationship count
- **Props**:
  - `character`: Character data object
  - `onSelect`: Callback for character selection
  - `onEdit`: Callback for edit action
  - `onDelete`: Callback for delete action
- **API Integration**:
  - None directly (displays passed data)

### CharacterForm (`src/components/features/characters/CharacterForm.tsx`)
- **Purpose**: Form for creating/editing characters
- **Features**:
  - Name and description inputs
  - Role and importance selection
  - Physical attributes section
  - Personality traits section
  - Background section
  - Tabbed interface for organization
  - Form validation
- **State**:
  - Form state (character data)
  - Active tab
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `characterData`: Initial character data (for editing)
  - `isEdit`: Boolean to indicate edit mode
  - `onSuccess`: Callback after successful submission
- **API Integration**:
  - Uses `characterService.createCharacter` or `characterService.updateCharacter`

### CharacterRelationships (`src/components/features/characters/CharacterRelationships.tsx`)
- **Purpose**: Manages character relationships
- **Features**:
  - Visual graph of relationships
  - Add relationship form
  - Edit relationship properties
  - Delete relationship functionality
  - Filtering options
- **State**:
  - Relationships data
  - Form state (new/edit relationship)
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `characterId`: ID of the character
  - `onUpdate`: Callback after changes
- **API Integration**:
  - Uses `characterService.getRelationships`
  - Uses `characterService.updateRelationships`

### CharacterAttributes (`src/components/features/characters/CharacterAttributes.tsx`)
- **Purpose**: Manages detailed character attributes
- **Features**:
  - Physical attributes section
  - Personality traits section
  - Skills and abilities section
  - Custom attributes section
  - Form validation
- **State**:
  - Attributes data
  - Loading state
  - Error state
- **Props**:
  - `characterData`: Character data object
  - `onChange`: Callback for attribute changes
- **API Integration**:
  - None directly (manipulates passed data)

### CharacterGenerationForm (`src/components/features/characters/CharacterGenerationForm.tsx`)
- **Purpose**: Generates character using AI
- **Features**:
  - Basic character parameters (name, role, etc.)
  - Genre and style selection
  - AI provider selection
  - Generation options
  - Cost estimate display
  - Generated result preview
  - Edit before saving option
- **State**:
  - Form state (generation parameters)
  - Generated character data
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `onSave`: Callback for saving generated character
- **API Integration**:
  - Uses `aiService.generateText`
  - Uses `characterService.createCharacter`

## Setting Components

### SettingList (`src/components/features/settings/SettingList.tsx`)
- **Purpose**: Displays a list of settings in a project
- **Features**:
  - Grid/list view toggle
  - Sorting options (name, type, etc.)
  - Filtering options (type, usage, etc.)
  - Search functionality
  - Grouping options (by type)
  - Empty state
- **State**:
  - Settings data
  - Loading state
  - View type (grid/list)
  - Sort, filter, and group options
  - Search query
- **Props**:
  - `projectId`: ID of the project
  - `onSelect`: Callback for setting selection
- **API Integration**:
  - Uses `settingService.getSettings`

### SettingCard (`src/components/features/settings/SettingCard.tsx`)
- **Purpose**: Displays individual setting information
- **Features**:
  - Setting name and image
  - Type indicator
  - Short description
  - Quick action menu
  - Related character count
- **Props**:
  - `setting`: Setting data object
  - `onSelect`: Callback for setting selection
  - `onEdit`: Callback for edit action
  - `onDelete`: Callback for delete action
- **API Integration**:
  - None directly (displays passed data)

### SettingForm (`src/components/features/settings/SettingForm.tsx`)
- **Purpose**: Form for creating/editing settings
- **Features**:
  - Name and description inputs
  - Type selection
  - Detail fields based on type
  - Image upload/management
  - Tabbed interface for organization
  - Form validation
- **State**:
  - Form state (setting data)
  - Active tab
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `settingData`: Initial setting data (for editing)
  - `isEdit`: Boolean to indicate edit mode
  - `onSuccess`: Callback after successful submission
- **API Integration**:
  - Uses `settingService.createSetting` or `settingService.updateSetting`

### MapEditor (`src/components/features/settings/MapEditor.tsx`)
- **Purpose**: Interactive map editor for settings
- **Features**:
  - Map upload/display
  - Point of interest creation
  - Annotation tools
  - Map legend
  - Zoom and pan controls
- **State**:
  - Map data
  - Selected point
  - Edit mode
  - Loading state
  - Error state
- **Props**:
  - `settingId`: ID of the setting
  - `mapData`: Initial map data
  - `onChange`: Callback for map changes
- **API Integration**:
  - Custom file upload handling

### SettingGenerationForm (`src/components/features/settings/SettingGenerationForm.tsx`)
- **Purpose**: Generates setting using AI
- **Features**:
  - Basic setting parameters (name, type, etc.)
  - Genre and style selection
  - AI provider selection
  - Generation options
  - Cost estimate display
  - Generated result preview
  - Edit before saving option
- **State**:
  - Form state (generation parameters)
  - Generated setting data
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `onSave`: Callback for saving generated setting
- **API Integration**:
  - Uses `aiService.generateText`
  - Uses `aiService.generateImage` (for setting images)
  - Uses `settingService.createSetting`

## Plot Components

### PlotList (`src/components/features/plots/PlotList.tsx`)
- **Purpose**: Displays a list of plots in a project
- **Features**:
  - List view with expandable sections
  - Sorting options (name, structure, etc.)
  - Filtering options (type, status, etc.)
  - Search functionality
  - Empty state
- **State**:
  - Plots data
  - Loading state
  - Sort and filter options
  - Search query
  - Expanded plot IDs
- **Props**:
  - `projectId`: ID of the project
  - `onSelect`: Callback for plot selection
- **API Integration**:
  - Uses `plotService.getPlots`

### PlotCard (`src/components/features/plots/PlotCard.tsx`)
- **Purpose**: Displays individual plot information
- **Features**:
  - Plot title and description
  - Structure type indicator
  - Plot point count
  - Progress indicator
  - Quick action menu
- **Props**:
  - `plot`: Plot data object
  - `onSelect`: Callback for plot selection
  - `onEdit`: Callback for edit action
  - `onDelete`: Callback for delete action
- **API Integration**:
  - None directly (displays passed data)

### PlotForm (`src/components/features/plots/PlotForm.tsx`)
- **Purpose**: Form for creating/editing plots
- **Features**:
  - Title and description inputs
  - Structure type selection
  - Structure template options
  - Form validation
- **State**:
  - Form state (plot data)
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `plotData`: Initial plot data (for editing)
  - `isEdit`: Boolean to indicate edit mode
  - `onSuccess`: Callback after successful submission
- **API Integration**:
  - Uses `plotService.createPlot` or `plotService.updatePlot`

### PlotStructureVisualizer (`src/components/features/plots/PlotStructureVisualizer.tsx`)
- **Purpose**: Visualizes plot structure
- **Features**:
  - Interactive timeline/arc visualization
  - Plot point display and navigation
  - Drag-and-drop reordering
  - Zoom and pan controls
  - Different visualization modes
- **State**:
  - Plot structure data
  - Selected plot point
  - Visualization mode
  - Zoom level
- **Props**:
  - `plotId`: ID of the plot
  - `onPlotPointSelect`: Callback for plot point selection
  - `onReorder`: Callback for reordering
- **API Integration**:
  - Uses `plotService.getPlotById`
  - Uses `plotService.updatePlot` (for reordering)

### PlotPointEditor (`src/components/features/plots/PlotPointEditor.tsx`)
- **Purpose**: Edits individual plot points
- **Features**:
  - Title and description inputs
  - Type selection
  - Character selection
  - Setting selection
  - Sequence position
  - Form validation
- **State**:
  - Form state (plot point data)
  - Loading state
  - Error state
- **Props**:
  - `plotId`: ID of the plot
  - `plotPointId`: ID of the plot point (for editing)
  - `plotPointData`: Initial plot point data
  - `isEdit`: Boolean to indicate edit mode
  - `onSuccess`: Callback after successful submission
- **API Integration**:
  - Uses `plotService.addPlotPoint` or `plotService.updatePlotPoint`

### PlotGenerationForm (`src/components/features/plots/PlotGenerationForm.tsx`)
- **Purpose**: Generates plot using AI
- **Features**:
  - Basic plot parameters
  - Structure type selection
  - Character inclusion
  - Setting inclusion
  - AI provider selection
  - Generation options
  - Cost estimate display
  - Generated result preview
  - Edit before saving option
- **State**:
  - Form state (generation parameters)
  - Generated plot data
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `onSave`: Callback for saving generated plot
- **API Integration**:
  - Uses `aiService.generateText`
  - Uses `plotService.createPlot`

## Chapter Components

### ChapterList (`src/components/features/chapters/ChapterList.tsx`)
- **Purpose**: Displays a list of chapters in a project
- **Features**:
  - Ordered list with drag-and-drop reordering
  - Status indicators
  - Word count display
  - Progress tracking
  - Quick action menu
  - Add chapter button
- **State**:
  - Chapters data
  - Loading state
  - Reordering state
- **Props**:
  - `projectId`: ID of the project
  - `onSelect`: Callback for chapter selection
  - `onReorder`: Callback for reordering
- **API Integration**:
  - Uses `chapterService.getChapters`
  - Uses `chapterService.reorderChapters`

### ChapterCard (`src/components/features/chapters/ChapterCard.tsx`)
- **Purpose**: Displays individual chapter information
- **Features**:
  - Chapter title and order number
  - Synopsis snippet
  - Status indicator
  - Word count
  - Last edited timestamp
  - Quick action menu
- **Props**:
  - `chapter`: Chapter data object
  - `onSelect`: Callback for chapter selection
  - `onEdit`: Callback for edit action
  - `onDelete`: Callback for delete action
- **API Integration**:
  - None directly (displays passed data)

### ChapterEditor (`src/components/features/chapters/ChapterEditor.tsx`)
- **Purpose**: Rich text editor for chapters
- **Features**:
  - Full-featured rich text editing
  - Character reference sidebar
  - Setting reference sidebar
  - Plot reference sidebar
  - Notes panel
  - Word count tracking
  - Auto-save functionality
  - Version history
- **State**:
  - Editor content
  - Selected references
  - Editor options
  - Auto-save status
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `chapterId`: ID of the chapter
  - `initialContent`: Initial chapter content
  - `onSave`: Callback after saving
- **API Integration**:
  - Uses `chapterService.updateChapter`

### ChapterOutline (`src/components/features/chapters/ChapterOutline.tsx`)
- **Purpose**: Outlines chapter structure
- **Features**:
  - Hierarchical outline view
  - Add/edit/delete outline items
  - Drag-and-drop reordering
  - Expand/collapse sections
- **State**:
  - Outline data
  - Selected item
  - Expanded items
  - Loading state
  - Error state
- **Props**:
  - `chapterId`: ID of the chapter
  - `initialOutline`: Initial outline data
  - `onChange`: Callback for outline changes
- **API Integration**:
  - Custom data handling

### ChapterGenerationForm (`src/components/features/chapters/ChapterGenerationForm.tsx`)
- **Purpose**: Generates chapter using AI
- **Features**:
  - Title and synopsis inputs
  - Character selection
  - Setting selection
  - Plot points selection
  - AI provider selection
  - Generation options
  - Cost estimate display
  - Generated result preview
  - Edit before saving option
- **State**:
  - Form state (generation parameters)
  - Generated chapter data
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `onSave`: Callback for saving generated chapter
- **API Integration**:
  - Uses `aiService.generateText`
  - Uses `chapterService.createChapter`

## Export Components

### ExportList (`src/components/features/exports/ExportList.tsx`)
- **Purpose**: Displays a list of exports in a project
- **Features**:
  - List of export history
  - Status indicators
  - Format icons
  - Download buttons
  - Delete options
  - Filter by format
- **State**:
  - Exports data
  - Loading state
  - Filter options
- **Props**:
  - `projectId`: ID of the project
  - `onDownload`: Callback for download action
  - `onDelete`: Callback for delete action
- **API Integration**:
  - Uses `exportService.getExports`

### ExportForm (`src/components/features/exports/ExportForm.tsx`)
- **Purpose**: Form for creating exports
- **Features**:
  - Export name and description inputs
  - Format selection
  - Chapter selection
  - Configuration options
  - Form validation
- **State**:
  - Form state (export data)
  - Loading state
  - Error state
- **Props**:
  - `projectId`: ID of the project
  - `onSuccess`: Callback after successful submission
- **API Integration**:
  - Uses `exportService.createExport`

### ExportPreview (`src/components/features/exports/ExportPreview.tsx`)
- **Purpose**: Previews exported document
- **Features**:
  - Document preview
  - Page navigation
  - Download button
  - Back to edit button
- **State**:
  - Preview data
  - Current page
  - Loading state
  - Error state
- **Props**:
  - `exportId`: ID of the export
  - `onDownload`: Callback for download action
  - `onBack`: Callback for back action
- **API Integration**:
  - Uses `exportService.getExportById`
  - Uses `exportService.downloadExport`

### ExportFormatSettings (`src/components/features/exports/ExportFormatSettings.tsx`)
- **Purpose**: Format-specific export settings
- **Features**:
  - Format-specific options
  - Typography settings
  - Layout settings
  - Cover page options
  - Include/exclude sections
- **State**:
  - Settings data
  - Preview mode
- **Props**:
  - `format`: Export format
  - `onChange`: Callback for settings changes
  - `settings`: Initial settings
- **API Integration**:
  - None directly (manipulates passed data)

## AI Components

### AIGenerationForm (`src/components/features/ai/AIGenerationForm.tsx`)
- **Purpose**: Generic form for AI content generation
- **Features**:
  - Generation type selection
  - Provider selection
  - Parameter inputs based on type
  - Cost estimate display
  - Generate button
- **State**:
  - Form state (generation parameters)
  - Selected provider
  - Cost estimate
  - Loading state
  - Error state
- **Props**:
  - `generationType`: Type of content to generate
  - `onGenerate`: Callback for generation
  - `initialParams`: Initial parameters
- **API Integration**:
  - Uses `aiService.getCostEstimate`

### AIResultDisplay (`src/components/features/ai/AIResultDisplay.tsx`)
- **Purpose**: Displays AI generation results
- **Features**:
  - Formatted result display
  - Edit capabilities
  - Save button
  - Regenerate option
  - Copy to clipboard
- **State**:
  - Result data
  - Edit mode
  - Loading state
  - Error state
- **Props**:
  - `result`: Generation result
  - `onSave`: Callback for saving
  - `onRegenerate`: Callback for regeneration
- **API Integration**:
  - Uses `aiService.saveGeneration`

### ImageGenerationForm (`src/components/features/ai/ImageGenerationForm.tsx`)
- **Purpose**: Form for AI image generation
- **Features**:
  - Prompt input
  - Style selection
  - Size selection
  - Number of variations
  - Cost estimate display
  - Generate button
- **State**:
  - Form state (generation parameters)
  - Cost estimate
  - Loading state
  - Error state
- **Props**:
  - `onGenerate`: Callback for generation
  - `initialParams`: Initial parameters
- **API Integration**:
  - Uses `aiService.generateImage`
  - Uses `aiService.getCostEstimate`

### TextGenerationForm (`src/components/features/ai/TextGenerationForm.tsx`)
- **Purpose**: Form for AI text generation
- **Features**:
  - Prompt input
  - Provider selection
  - Model selection
  - Parameter adjustments
  - Cost estimate display
  - Generate button
- **State**:
  - Form state (generation parameters)
  - Selected provider
  - Cost estimate
  - Loading state
  - Error state
- **Props**:
  - `onGenerate`: Callback for generation
  - `initialParams`: Initial parameters
- **API Integration**:
  - Uses `aiService.generateText`
  - Uses `aiService.getCostEstimate`

### AISelectionControl (`src/components/features/ai/AISelectionControl.tsx`)
- **Purpose**: Controls for selecting AI provider
- **Features**:
  - Provider selection
  - Model selection
  - Cost comparison
  - Capability comparison
- **State**:
  - Selected provider
  - Selected model
- **Props**:
  - `availableProviders`: List of available providers
  - `onChange`: Callback for selection change
  - `defaultProvider`: Default selected provider
- **API Integration**:
  - None directly (selection UI)

### AIPromptBuilder (`src/components/features/ai/AIPromptBuilder.tsx`)
- **Purpose**: Helper for building effective prompts
- **Features**:
  - Template selection
  - Parameter inputs
  - Preview generation
  - Copy button
  - Save template option
- **State**:
  - Template data
  - Parameter values
  - Generated prompt
- **Props**:
  - `templates`: List of available templates
  - `onGenerate`: Callback for prompt generation
  - `onSave`: Callback for saving template
- **API Integration**:
  - Custom prompt handling 