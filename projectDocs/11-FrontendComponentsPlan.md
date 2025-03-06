# StoryForge - Frontend Components Plan (Updated)

This document outlines the UI components needed for the StoryForge application, their relationships, and how they'll connect to our backend APIs, aligned with the current project structure.

## Current Frontend Structure

The frontend is currently organized as follows:
```
src/
├── components/
│   ├── features/       (Feature-specific components)
│   │   ├── ai/         (AI generation components)
│   │   ├── auth/       (Authentication components)    
│   │   ├── characters/ (Character management components)
│   │   ├── projects/   (Project management components)
│   │   ├── settings/   (Setting management components)
│   │   ├── plots/      (Plot management components)
│   │   ├── chapters/   (Chapter management components)
│   │   └── exports/    (Export functionality components)
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
│   ├── useAuthService.ts
│   ├── useProjectService.ts
│   ├── useCharacterService.ts
│   ├── useSettingService.ts
│   ├── usePlotService.ts
│   ├── useChapterService.ts
│   ├── useExportService.ts
│   ├── useAIService.ts
│   ├── useUserService.ts
│   └── useToast.ts
├── services/           (API service modules)
│   ├── api.ts          (Base API client)
│   └── error-handler.ts
├── assets/             (Static resources)
├── App.tsx             (Main application component)
├── App.css             (Global styles)
├── index.css           (Global styles with Tailwind)
├── main.tsx            (Application entry point)
└── vite-env.d.ts       (Type declarations)
```

## Component Organization (Revised)

Building on the existing structure and aligning with our actual API endpoints, we will organize components as follows:

### 1. Feature Components Mapped to API Endpoints
```
src/components/features/
├── ai/                        (AI generation components)
│   ├── AIGenerationForm.tsx   (Form for generating AI content - uses ai.generateText)
│   ├── AIResultDisplay.tsx    (Display for AI generation results)
│   ├── TextGenerationForm.tsx (Form for text generation - uses ai.continueText)
│   ├── AISuggestionPanel.tsx  (Shows writing suggestions - uses ai.getSuggestions)
│   └── AITextAnalyzer.tsx     (Text analysis tool - uses ai.analyzeText)
├── auth/                      (Authentication components)
│   ├── LoginForm.tsx          (User login - uses auth.login)
│   ├── RegisterForm.tsx       (User registration - uses auth.register)
│   ├── ForgotPasswordForm.tsx (Password recovery)
│   └── VerifyTokenForm.tsx    (Verify JWT token - uses auth.verifyToken)
├── user/                      (User profile components)
│   ├── ProfileForm.tsx        (User profile editing - uses user.updateProfile)
│   ├── PasswordChangeForm.tsx (Password change - uses user.changePassword)
│   └── UserPreferencesForm.tsx (User preferences - uses user.updatePreferences)
├── characters/                (Character management)
│   ├── CharacterList.tsx      (List of characters - uses character.getAllByProject)
│   ├── CharacterCard.tsx      (Individual character display)
│   ├── CharacterForm.tsx      (Character creation/editing - uses character.create & character.update)
│   ├── CharacterDetail.tsx    (View character details - uses character.getById)
│   └── CharacterDelete.tsx    (Delete character - uses character.delete)
├── projects/                  (Project management)
│   ├── ProjectList.tsx        (List of projects - uses project.getAllByUser)
│   ├── ProjectCard.tsx        (Individual project display)
│   ├── ProjectForm.tsx        (Project creation/editing - uses project.create & project.update)
│   ├── ProjectDetail.tsx      (View project details - uses project.getById)
│   ├── ProjectDelete.tsx      (Delete project - uses project.delete)
│   └── ProjectStats.tsx       (Project statistics - uses project.getStats)
├── settings/                  (Setting management)
│   ├── SettingList.tsx        (List of settings - uses setting.getAllByProject)
│   ├── SettingCard.tsx        (Individual setting display)
│   ├── SettingForm.tsx        (Setting creation/editing - uses setting.create & setting.update)
│   ├── SettingDetail.tsx      (View setting details - uses setting.getById)
│   └── SettingDelete.tsx      (Delete setting - uses setting.delete)
├── plots/                     (Plot management)
│   ├── PlotList.tsx           (List of plots - uses plot.getAllByProject)
│   ├── PlotCard.tsx           (Individual plot display)
│   ├── PlotForm.tsx           (Plot creation/editing - uses plot.create & plot.update)
│   ├── PlotDetail.tsx         (View plot details - uses plot.getById)
│   └── PlotDelete.tsx         (Delete plot - uses plot.delete)
├── chapters/                  (Chapter management)
│   ├── ChapterList.tsx        (List of chapters - uses chapter.getAllByProject)
│   ├── ChapterCard.tsx        (Individual chapter display)
│   ├── ChapterEditor.tsx      (Rich text editor for chapters - uses chapter.updateContent)
│   ├── ChapterDetail.tsx      (View chapter details - uses chapter.getById)
│   ├── ChapterForm.tsx        (Chapter creation/editing - uses chapter.create & chapter.update)
│   ├── ChapterDelete.tsx      (Delete chapter - uses chapter.delete)
│   └── ChapterReorderTool.tsx (Reorder chapters - uses chapter.reorderChapters)
└── exports/                   (Export functionality)
    ├── ExportList.tsx         (List of exports - uses export.getAllByProject)
    ├── ExportForm.tsx         (Export configuration - uses export.createExport)
    ├── ExportDetail.tsx       (View export details - uses export.getExportById)
    ├── ExportDelete.tsx       (Delete export - uses export.deleteExport)
    └── ExportDownload.tsx     (Download export - uses export.downloadExport)
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
Our UI components are primarily based on shadcn/UI, which uses Radix UI primitives. These components are already implemented in `src/components/ui/` and include:

- Accordion, Alert, AlertDialog, AspectRatio, Avatar
- Badge, Breadcrumb, Button
- Calendar, Card, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu
- Dialog, Drawer, DropdownMenu
- Form
- HoverCard
- Input
- Label
- Menubar
- NavigationMenu
- Pagination, Popover, Progress
- RadioGroup, Resizable
- ScrollArea, Select, Separator, Sheet, Sidebar, Skeleton, Slider, Switch
- Table, Tabs, Textarea, Toggle, ToggleGroup, Tooltip

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

## API Service Hooks

Based on our implemented backend, we have the following custom hooks for API integration:

```
src/hooks/
├── useAuthService.ts     (Authentication endpoints - auth.*)
├── useUserService.ts     (User profile endpoints - user.*)
├── useProjectService.ts  (Project management endpoints - project.*)
├── useCharacterService.ts (Character management endpoints - character.*)
├── useSettingService.ts  (Setting management endpoints - setting.*)
├── usePlotService.ts     (Plot management endpoints - plot.*)
├── useChapterService.ts  (Chapter management endpoints - chapter.*)
├── useExportService.ts   (Export functionality endpoints - export.*)
├── useAIService.ts       (AI integration endpoints - ai.*)
├── useToast.ts           (Toast notifications)
├── use-mobile.ts         (Responsive design helper)
└── ui/                   (UI-specific hooks)
```

Each service hook connects to the corresponding tRPC endpoints in our backend API.

## API Service Integration

The frontend integrates with the backend tRPC API endpoints as defined in our `src/backend/src/routers/_app.ts`:

1. **Authentication Services** - `auth.*` endpoints
   - `auth.register` - User registration
   - `auth.login` - User login
   - `auth.verifyToken` - Token verification

2. **User Services** - `user.*` endpoints
   - `user.getProfile` - Get user profile
   - `user.updateProfile` - Update profile information
   - `user.changePassword` - Change password
   - `user.updatePreferences` - Update user preferences

3. **Project Services** - `project.*` endpoints
   - `project.create` - Create project
   - `project.getById` - Get project details
   - `project.update` - Update project
   - `project.delete` - Delete project
   - `project.getAllByUser` - Get all user projects
   - `project.getStats` - Project statistics

4. **Character Services** - `character.*` endpoints
   - `character.create` - Create character
   - `character.getById` - Get character details
   - `character.update` - Update character
   - `character.delete` - Delete character
   - `character.getAllByProject` - Get all characters in project

5. **Setting Services** - `setting.*` endpoints
   - `setting.create` - Create setting
   - `setting.getById` - Get setting details
   - `setting.update` - Update setting
   - `setting.delete` - Delete setting
   - `setting.getAllByProject` - Get all settings in project

6. **Plot Services** - `plot.*` endpoints
   - `plot.create` - Create plot
   - `plot.getById` - Get plot details
   - `plot.update` - Update plot
   - `plot.delete` - Delete plot
   - `plot.getAllByProject` - Get all plots in project

7. **Chapter Services** - `chapter.*` endpoints
   - `chapter.create` - Create chapter
   - `chapter.getById` - Get chapter details
   - `chapter.update` - Update chapter
   - `chapter.delete` - Delete chapter
   - `chapter.getAllByProject` - Get all chapters in project
   - `chapter.updateContent` - Update chapter content
   - `chapter.reorderChapters` - Change chapter order

8. **AI Services** - `ai.*` endpoints
   - `ai.generateText` - Generate text
   - `ai.continueText` - Continue text
   - `ai.getSuggestions` - Get writing suggestions
   - `ai.analyzeText` - Analyze text

9. **Export Services** - `export.*` endpoints
   - `export.createExport` - Create export
   - `export.getExportById` - Get export details
   - `export.getAllByProject` - Get all exports for project
   - `export.deleteExport` - Delete export
   - `export.downloadExport` - Download export file

## Implementation Phases (Revised)

### Phase 1: Core Infrastructure & Auth (Completed)
- Layout components (Header, Sidebar, Footer)
- Authentication (Login, Register)
- Base API services 
- User profile management

### Phase 2: Project Management (In Progress)
- Project listing and creation
- Project details and editing
- Project statistics and dashboard

### Phase 3: Content Creation
- Character management
- Setting management
- Plot management
- Chapter management and editor

### Phase 4: AI Integration & Export
- AI generation features
- Export functionality
- Final integration and optimization

## UI/UX Design Implementation

The UI/UX design as outlined in our `05-FrontendUIDesign.md` document has been implemented with the following key elements:

1. **Color Palette** - Using the defined primary (Indigo), secondary (Pink), and accent (Teal) colors
2. **Typography** - Implementing Inter as the primary font and Lexend for headings
3. **Component Design** - Using shadcn/UI with customizations for kid-friendly UI
4. **Responsive Design** - Following the breakpoints defined in the design document

All components adhere to the accessibility guidelines outlined in the design document, ensuring keyboard navigation, screen reader support, and visual accessibility features.

## Next Steps

1. **Complete Project Management Features**
   - Finish Project Statistics component
   - Implement Project Collaborators feature

2. **Implement Content Creation Components**
   - Build Character Workshop components
   - Build Setting components
   - Develop Plot Architect components
   - Create Chapter Forge editor

3. **Develop AI Integration**
   - Build AI generation forms
   - Implement AI suggestions
   - Create text analysis tools

4. **Create Export Functionality**
   - Implement export configuration form
   - Build export preview
   - Add download functionality 