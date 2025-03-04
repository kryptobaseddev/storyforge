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
- **State Management**: Redux for global state
- **Form Handling**: React Hook Form
- **Text Editor**: TipTap for rich text editing
- **Visualizations**: D3.js for relationship mapping
- **Animations**: Framer Motion for smooth transitions

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

All components will use shadcn/UI as a foundation with customizations for the StoryForge theme and kid-friendly design.

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

## Key Screens

### 1. Dashboard

The dashboard provides an overview of the user's projects and quick access to key functionality.

**Components:**
- Welcome message with personalized greeting
- Project cards grid with thumbnails and summary
- Quick create button
- Recent activity feed
- Help and tutorial cards
- Navigation to main sections

**Interactions:**
- Click on project cards to open project
- Drag and drop to reorder projects
- Hover effects for project cards

### 2. Story Setup

The initial configuration screen for creating a new story project.

**Components:**
- Multi-step form with progress indicator
- Genre selection cards with illustrations
- Narrative type selection radio buttons
- Tone and style sliders
- Target length input
- Template gallery with preview cards

**Interactions:**
- Step-by-step progression with next/back buttons
- Real-time preview updates
- Hover tooltips for additional information

### 3. Character Workshop

Interface for creating and managing characters.

**Components:**
- Character list sidebar
- Character profile card
- Tabbed sections for different character attributes
- Relationship map visualization
- AI suggestion panel
- Image/avatar selection

**Interactions:**
- Drag-and-drop relationship connections
- In-place editing of character attributes
- AI assistance button with dropdown options
- Tabs for different character aspects

### 4. Plot Architect

Interface for developing the story's plot structure.

**Components:**
- Plot structure visualization
- Plot point cards
- Timeline interface
- Story arc templates
- AI plot suggestion panel
- Plot connection indicators

**Interactions:**
- Drag plot points onto timeline
- Expand/collapse plot sections
- Connect plot points to characters and settings
- Story structure template application

### 5. Chapter Forge

The writing environment for developing individual chapters.

**Components:**
- TipTap-based rich text editor
- Formatting toolbar
- Context sidebar with character/plot references
- AI writing assistant panel
- Chapter navigation
- Word count and reading level indicators

**Interactions:**
- Rich text editing with formatting options
- Split view with reference materials
- AI suggestion insertion
- Chapter organization and navigation

### 6. Export Studio

Interface for exporting the story in various formats.

**Components:**
- Format selection cards
- Style and formatting options
- Preview panel
- Export settings
- Download button

**Interactions:**
- Format selection changes preview
- Style adjustments with real-time preview
- Export progress indicator

## UI Components

### Navigation Components

1. **Main Navigation**
   - Sidebar with icon + text links
   - Collapsible sections
   - Active state indicators
   - Quick access buttons

2. **Breadcrumbs**
   - Path indication
   - Navigation links
   - Current location indicator

3. **Tab Navigation**
   - Horizontal tabs for related content
   - Content-specific icons
   - Active state styling

### Content Components

1. **Cards**
   - Project cards
   - Character cards
   - Setting cards
   - Template cards
   - Various sizes with consistent styling

2. **Forms**
   - Input fields with clear labels
   - Dropdown selects
   - Radio and checkbox groups
   - Sliders for ranges
   - Text areas
   - Form validation

3. **Rich Text Editor**
   - Formatting toolbar
   - Paragraph styles
   - Text formatting
   - Embedded elements

4. **Visualizations**
   - Character relationship maps
   - Plot timelines
   - Story structure diagrams

### Interactive Components

1. **Buttons**
   - Primary action buttons
   - Secondary action buttons
   - Icon buttons
   - Button groups
   - Toggle buttons

2. **Modals and Dialogs**
   - Confirmation dialogs
   - Information modals
   - Form dialogs
   - Alert dialogs

3. **Tooltips and Popovers**
   - Contextual help tooltips
   - Information popovers
   - Feature explanation tooltips

4. **AI Assistant Interface**
   - Suggestion cards
   - "Magic wand" buttons
   - Context-aware help
   - Feedback mechanisms

## Kid-Friendly Elements

1. **Visual Cues**
   - Clear, large icons
   - Animated hints
   - Visual feedback for actions

2. **Simplified Controls**
   - Reduced options for younger users
   - Progressive disclosure of advanced features
   - Age-appropriate language

3. **Guidance System**
   - Interactive tutorials
   - Contextual help
   - Encouraging feedback
   - "Story Coach" character that provides tips

4. **Accessibility Features**
   - High contrast options
   - Adjustable text size
   - Screen reader compatibility
   - Keyboard navigation

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