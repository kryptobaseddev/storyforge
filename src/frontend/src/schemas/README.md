# StoryForge Type System

This directory contains the centralized type system for the StoryForge application. It provides TypeScript interfaces that mirror the Zod schemas defined in the backend.

## Purpose

The purpose of this centralized type system is to:

1. **Ensure Type Consistency**: By having a single source of truth for types, we ensure consistency across the frontend.
2. **Align with Backend**: These types are designed to match the Zod schemas in the backend, ensuring type safety across the stack.
3. **Reduce Duplication**: Instead of defining types in multiple places, we define them once and import them where needed.
4. **Improve Maintainability**: When the backend schema changes, we only need to update types in one place.

## Usage

Import types from the central schema file:

```typescript
import { Project, Character, CreateProjectInput } from '../schemas';

// Use the types in your components
const ProjectCard: React.FC<{ project: Project }> = ({ project }) => {
  // ...
};

// Use the types in your hooks
const createProject = (input: CreateProjectInput) => {
  // ...
};
```

## Type Categories

The schema file includes types for:

- **Project Management**: Projects, collaborators, etc.
- **Character Management**: Characters, relationships, etc.
- **Setting Management**: Settings, locations, etc.
- **Artifact Management**: Objects, properties, etc.
- **Plot Management**: Plots, plot elements, etc.
- **Chapter Management**: Chapters, content, etc.
- **Export Functionality**: Exports, configurations, etc.
- **AI Integration**: Generation prompts, responses, etc.
- **User Management**: User profiles, preferences, etc.
- **Authentication**: Login, registration, etc.

## Updating Types

When the backend Zod schemas change, update the corresponding types in `index.ts`. Ensure that:

1. The property names match exactly
2. The types are as specific as possible (avoid using `any`)
3. Union types are used for enums
4. Optional properties are marked with `?`

## Type vs. Interface

We generally use:

- `interface` for object types that might be extended
- `type` for unions, intersections, and simple aliases

For consistency, we use `interface` for most object types and `type` for derived types (like `Partial<T>`). 