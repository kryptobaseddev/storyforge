# StoryForge Design System Guide

This guide outlines the design system for the StoryForge application, including color usage, typography, and component styling guidelines.

## Table of Contents

1. [Color Palette](#color-palette)
2. [Typography](#typography)
3. [Component Styling](#component-styling)
4. [Dark Mode](#dark-mode)
5. [Accessibility](#accessibility)
6. [Usage Examples](#usage-examples)

## Color Palette

Our color palette is designed to provide a consistent visual language across the application. Colors are defined as CSS variables and exposed through Tailwind CSS classes.

### Primary Colors (Indigo)

| Color | Hex | HSL | Tailwind Class |
|-------|-----|-----|---------------|
| Primary | `#6366f1` | `240 84% 67%` | `text-primary` `bg-primary` |
| Primary Light | `#a5b4fc` | `239 84% 82%` | `text-primary-light` `bg-primary-light` |
| Primary Dark | `#4338ca` | `243 75% 50%` | `text-primary-dark` `bg-primary-dark` |

**Usage Guidelines:**
- Use Primary for main actions, buttons, and interactive elements
- Use Primary Light for hover states and secondary elements
- Use Primary Dark for active states and emphasis

### Secondary Colors (Pink)

| Color | Hex | HSL | Tailwind Class |
|-------|-----|-----|---------------|
| Secondary | `#ec4899` | `330 84% 60%` | `text-secondary` `bg-secondary` |
| Secondary Light | `#f9a8d4` | `330 84% 80%` | `text-secondary-light` `bg-secondary-light` |
| Secondary Dark | `#be185d` | `330 84% 42%` | `text-secondary-dark` `bg-secondary-dark` |

**Usage Guidelines:**
- Use Secondary for complementary actions and highlights
- Use Secondary Light for decorative elements and backgrounds
- Use Secondary Dark for emphasis and contrast

### Accent Colors (Teal)

| Color | Hex | HSL | Tailwind Class |
|-------|-----|-----|---------------|
| Accent | `#14b8a6` | `173 79% 40%` | `text-accent` `bg-accent` |
| Accent Light | `#5eead4` | `173 79% 63%` | `text-accent-light` `bg-accent-light` |
| Accent Dark | `#0f766e` | `173 79% 26%` | `text-accent-dark` `bg-accent-dark` |

**Usage Guidelines:**
- Use Accent for tertiary actions and visual interest
- Use Accent Light for subtle highlights and backgrounds
- Use Accent Dark for emphasis within accent elements

### UI Colors

| Color | Hex | Light Mode HSL | Dark Mode HSL | Tailwind Class |
|-------|-----|---------------|--------------|---------------|
| Background | `#f9fafb` / `#111827` | `210 20% 98%` | `222 47% 11%` | `bg-background` |
| Foreground | `#111827` / `#f9fafb` | `222 47% 11%` | `210 20% 98%` | `text-foreground` |
| Muted | `#f3f4f6` / `#1f2937` | `220 14% 96%` | `215 28% 17%` | `bg-muted` |
| Muted Foreground | `#6b7280` / `#9ca3af` | `220 9% 46%` | `215 20% 65%` | `text-muted-foreground` |
| Card | `#ffffff` / `#111827` | `0 0% 100%` | `222 47% 11%` | `bg-card` |
| Card Foreground | `#111827` / `#f9fafb` | `222 47% 11%` | `210 20% 98%` | `text-card-foreground` |
| Border | `#e5e7eb` / `#1f2937` | `220 13% 91%` | `215 28% 17%` | `border` |
| Input | `#e5e7eb` / `#1f2937` | `220 13% 91%` | `215 28% 17%` | `bg-input` |

### Semantic Colors

| Color | Hex | HSL | Tailwind Class |
|-------|-----|-----|---------------|
| Success | `#10b981` | `160 84% 39%` | `text-success` `bg-success` |
| Warning | `#f59e0b` | `38 92% 50%` | `text-warning` `bg-warning` |
| Error | `#ef4444` | `0 84% 60%` | `text-error` `bg-error` |

## Typography

Our typography system is designed to provide a clear hierarchy and consistent reading experience.

### Font Families

| Font | CSS Variable | Tailwind Class | Usage |
|------|-------------|---------------|-------|
| Inter | `--font-primary` | `font-sans` | Body text, UI elements |
| Lexend | `--font-heading` | `font-heading` | Headings, titles |
| JetBrains Mono | `--font-mono` | `font-mono` | Code blocks, technical content |

### Font Sizes

| Size | Rem | Pixels | CSS Variable | Tailwind Class |
|------|-----|--------|-------------|---------------|
| XS | 0.75rem | 12px | `--font-size-xs` | `text-xs` |
| SM | 0.875rem | 14px | `--font-size-sm` | `text-sm` |
| Base | 1rem | 16px | `--font-size-base` | `text-base` |
| LG | 1.125rem | 18px | `--font-size-lg` | `text-lg` |
| XL | 1.25rem | 20px | `--font-size-xl` | `text-xl` |
| 2XL | 1.5rem | 24px | `--font-size-2xl` | `text-2xl` |
| 3XL | 1.875rem | 30px | `--font-size-3xl` | `text-3xl` |
| 4XL | 2.25rem | 36px | `--font-size-4xl` | `text-4xl` |

### Typography Guidelines

- Use `font-heading` for all headings (h1-h6)
- Use `font-sans` for body text and UI elements
- Use `font-mono` for code snippets and technical information
- Maintain a clear hierarchy with font sizes
- Use appropriate line heights for readability:
  - Headings: `leading-tight` (1.25)
  - Body text: `leading-normal` (1.5)
  - Lists and dense content: `leading-relaxed` (1.625)

## Component Styling

### Buttons

Primary buttons:
```jsx
<button className="bg-primary text-primary-foreground hover:bg-primary-dark px-4 py-2 rounded-md">
  Primary Button
</button>
```

Secondary buttons:
```jsx
<button className="bg-secondary text-secondary-foreground hover:bg-secondary-dark px-4 py-2 rounded-md">
  Secondary Button
</button>
```

Outline buttons:
```jsx
<button className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-2 rounded-md">
  Outline Button
</button>
```

### Cards

Basic card:
```jsx
<div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
  <h3 className="font-heading text-xl mb-2">Card Title</h3>
  <p>Card content goes here.</p>
</div>
```

### Form Elements

Input field:
```jsx
<input 
  type="text" 
  className="bg-input text-foreground border rounded-md px-3 py-2 focus:ring-2 focus:ring-primary focus:border-primary"
  placeholder="Enter text"
/>
```

## Dark Mode

Our application supports both light and dark modes. The dark mode is toggled by adding the `dark` class to the `html` element.

### Implementation

The dark mode is implemented using CSS variables with different values for light and dark modes. The variables are defined in the `:root` and `.dark` selectors in `index.css`.

### Testing Dark Mode

Always test your components in both light and dark modes to ensure proper contrast and readability.

## Accessibility

### Color Contrast

- All text should have a minimum contrast ratio of 4.5:1 against its background
- Large text (18pt or 14pt bold) should have a minimum contrast ratio of 3:1
- UI components and graphical objects should have a minimum contrast ratio of 3:1

### Focus States

All interactive elements should have a visible focus state:

```jsx
<button className="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
  Accessible Button
</button>
```

## Usage Examples

### Page Layout

```jsx
<div className="bg-background text-foreground min-h-screen">
  <header className="bg-card border-b p-4">
    <h1 className="font-heading text-2xl">StoryForge</h1>
  </header>
  
  <main className="container mx-auto py-8 px-4">
    <h2 className="font-heading text-3xl mb-6">Dashboard</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
        <h3 className="font-heading text-xl mb-2">Recent Stories</h3>
        <p className="text-muted-foreground">View your recent stories.</p>
        <button className="mt-4 bg-primary text-primary-foreground hover:bg-primary-dark px-4 py-2 rounded-md">
          View All
        </button>
      </div>
      
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
        <h3 className="font-heading text-xl mb-2">Characters</h3>
        <p className="text-muted-foreground">Manage your characters.</p>
        <button className="mt-4 bg-secondary text-secondary-foreground hover:bg-secondary-dark px-4 py-2 rounded-md">
          View All
        </button>
      </div>
      
      <div className="bg-card text-card-foreground p-6 rounded-lg shadow-sm border">
        <h3 className="font-heading text-xl mb-2">Settings</h3>
        <p className="text-muted-foreground">Configure your preferences.</p>
        <button className="mt-4 bg-accent text-accent-foreground hover:bg-accent-dark px-4 py-2 rounded-md">
          Open Settings
        </button>
      </div>
    </div>
  </main>
  
  <footer className="bg-muted text-muted-foreground p-4 border-t">
    <p>&copy; 2025 StoryForge. All rights reserved.</p>
  </footer>
</div>
```

### Alert Messages

```jsx
<div className="bg-success/20 border-l-4 border-success text-foreground p-4 rounded-md mb-4">
  <p>Success! Your changes have been saved.</p>
</div>

<div className="bg-warning/20 border-l-4 border-warning text-foreground p-4 rounded-md mb-4">
  <p>Warning: This action cannot be undone.</p>
</div>

<div className="bg-error/20 border-l-4 border-error text-foreground p-4 rounded-md mb-4">
  <p>Error: Failed to save changes. Please try again.</p>
</div>
```

---

This design system guide is a living document and will be updated as the application evolves. Always refer to the latest version for the most up-to-date guidelines. 