# StoryForge - Frontend Setup Guide

This document provides a step-by-step guide for properly setting up the frontend of the StoryForge application using React, Tailwind CSS, PostCSS, and shadcn/UI.

## Current Status

After reviewing the current frontend setup, we've identified the following issues:

1. Tailwind CSS is partially configured but missing the proper configuration for shadcn/UI
2. PostCSS configuration is minimal but correctly set up
3. Components directory structure is not fully established
4. shadcn/UI components are not installed
5. Proper theme configuration is missing

## Setup Steps

### 1. Update Tailwind Configuration

The current `tailwind.config.js` is minimal and needs to be updated to support shadcn/UI components and our custom theme:

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 2. Update CSS Variables

Create or update the global CSS file (`src/index.css`) with proper CSS variables for shadcn/UI:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
 
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
 
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
 
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
 
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
 
    --secondary: 346.8 77.2% 49.8%;
    --secondary-foreground: 355.7 100% 97.3%;
 
    --accent: 173.4 71.4% 40.4%;
    --accent-foreground: 210 40% 98%;
 
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
 
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
 
    --radius: 0.5rem;
  }
 
  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
 
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
 
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
 
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 47.4% 11.2%;
 
    --secondary: 346.8 77.2% 49.8%;
    --secondary-foreground: 210 40% 98%;
 
    --accent: 173.4 71.4% 40.4%;
    --accent-foreground: 210 40% 98%;
 
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
 
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
 
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 48%;
  }
}
 
@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

### 3. Install Required Dependencies

Add the necessary dependencies for shadcn/UI and animations:

```bash
# Install shadcn/UI CLI
npm install -D @shadcn/ui

# Install component dependencies
npm install class-variance-authority clsx tailwind-merge lucide-react

# Install tailwindcss-animate for animations
npm install -D tailwindcss-animate

# Install Radix UI primitives (used by shadcn/UI)
npm install @radix-ui/react-dialog @radix-ui/react-slot @radix-ui/react-tabs @radix-ui/react-dropdown-menu @radix-ui/react-navigation-menu @radix-ui/react-accordion
```

### 4. Initialize shadcn/UI

Initialize shadcn/UI with the CLI:

```bash
npx shadcn-ui@latest init
```

When prompted, choose the following options:
- TypeScript: Yes
- Style: Default
- Base color: Slate
- Global CSS path: src/index.css
- CSS variables: Yes
- Tailwind.config.js location: tailwind.config.js
- Components directory: src/components
- Utils directory: src/lib/utils
- Include React Server Components: No (for now)

### 5. Create Component Directory Structure

Set up the recommended directory structure for components:

```
src/
├── components/
│   ├── ui/           # shadcn/UI components
│   ├── layout/       # Layout components (Header, Footer, Sidebar)
│   ├── features/     # Feature-specific components
│   │   ├── auth/     # Authentication-related components
│   │   ├── projects/ # Project-related components
│   │   ├── characters/ # Character-related components
│   │   └── ai/       # AI-related components
│   └── common/       # Common/shared components
├── lib/
│   └── utils.ts      # Utility functions
├── styles/
│   └── globals.css   # Global styles (if needed beyond index.css)
├── pages/            # Page components
│   ├── auth/
│   ├── dashboard/
│   ├── projects/
│   └── editor/
└── context/          # React context providers
```

### 6. Add Basic shadcn/UI Components

Install basic shadcn/UI components for the application:

```bash
# Basic UI components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add input
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add navigation-menu
```

### 7. Create Utils File

Create a utility file at `src/lib/utils.ts`:

```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 8. Update App.tsx

Update the main App.tsx file to use the new components and structure:

```tsx
import { ThemeProvider } from './context/theme-provider';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import Dashboard from './pages/dashboard';
import './index.css';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="storyforge-theme">
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            {/* Add more routes here */}
          </Routes>
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
```

### 9. Create Theme Provider

Create a theme context provider at `src/context/theme-provider.tsx`:

```tsx
import * as React from "react";

type Theme = "dark" | "light" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  );

  React.useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
```

## Implementation Steps

1. **Immediate Task**: Properly configure Tailwind CSS with shadcn/UI
2. **Secondary Task**: Implement the directory structure for components
3. **Tertiary Task**: Create basic layout components (Header, Footer, Sidebar)
4. **Final Task**: Set up routing with React Router

## Testing the Setup

After completing the setup, run the following tests:

1. Verify the theme is working correctly by toggling between light and dark mode
2. Check that shadcn/UI components render correctly and are properly styled
3. Test responsiveness on different viewport sizes
4. Ensure Tailwind utilities are working in custom components

## Common Issues and Solutions

- **Styling Issues**: If components don't appear properly styled, check that the CSS variables are correctly defined in index.css
- **Component Import Errors**: Ensure all dependencies are installed and components are properly imported
- **Animation Issues**: Make sure tailwindcss-animate is in the plugins array in tailwind.config.js
- **TypeScript Errors**: Run `tsc --noEmit` to check for type errors and resolve them 