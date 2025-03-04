# StoryForge - Database Schema

## Overview

StoryForge uses MongoDB as its database, with Mongoose as the ODM (Object Document Mapper). The database is structured around the following core collections:

## Collections

### Users
```javascript
{
  _id: ObjectId,
  username: String,  // Unique username
  email: String,     // Unique email address
  passwordHash: String,  // Hashed password
  firstName: String,
  lastName: String,
  age: Number,       // Optional for age-appropriate content
  avatar: String,    // URL to avatar image
  preferences: {
    theme: String,   // UI theme preference
    fontSize: Number, // Font size preference
    readingLevel: String, // Target reading level
    notificationSettings: Object // User notification preferences
  },
  projects: [ObjectId], // References to user's projects
  createdAt: Date,
  updatedAt: Date
}
```

### Projects
```javascript
{
  _id: ObjectId,
  userId: ObjectId,  // Reference to project owner
  title: String,     // Project title
  description: String, // Project description
  genre: String,     // Story genre
  targetAudience: String, // Target audience age group
  narrativeType: String, // E.g., "Short Story", "Novel", "Screenplay"
  status: String,    // E.g., "Draft", "In Progress", "Completed"
  tone: String,      // E.g., "Serious", "Humorous", "Educational"
  style: String,     // Writing style
  targetLength: {    // Target length for the story
    type: String,    // E.g., "Words", "Pages", "Chapters"
    value: Number
  },
  collaborators: [{  // Users with access to this project
    userId: ObjectId,
    role: String     // E.g., "Editor", "Viewer"
  }],
  metadata: {        // Additional project metadata
    createdWithTemplate: Boolean,
    templateId: ObjectId,
    tags: [String]
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Characters
```javascript
{
  _id: ObjectId,
  projectId: ObjectId, // Reference to parent project
  name: String,        // Character name
  shortDescription: String, // Brief character description
  detailedBackground: String, // Extended character history
  role: String,        // E.g., "Protagonist", "Antagonist", "Supporting"
  attributes: {
    physical: {
      age: Number,
      height: String,
      build: String,
      hairColor: String,
      eyeColor: String,
      distinguishingFeatures: [String]
    },
    personality: {
      traits: [String],
      strengths: [String],
      weaknesses: [String],
      fears: [String],
      desires: [String]
    },
    background: {
      birthplace: String,
      family: String,
      education: String,
      occupation: String,
      significantEvents: [String]
    },
    motivation: String, // Character's driving force
    arc: String        // Character's development path
  },
  relationships: [{    // Relationships with other characters
    characterId: ObjectId,
    relationshipType: String, // E.g., "Friend", "Enemy", "Family"
    notes: String
  }],
  plotInvolvement: [ObjectId], // References to plotlines this character is involved in
  imageUrl: String,    // URL to character image/avatar
  notes: String,       // Additional notes about the character
  createdAt: Date,
  updatedAt: Date
}
```

### Settings
```javascript
{
  _id: ObjectId,
  projectId: ObjectId, // Reference to parent project
  name: String,        // Setting name
  description: String, // Setting description
  type: String,        // E.g., "Location", "World", "Environment"
  details: {
    geography: String,
    climate: String,
    architecture: String,
    culture: String,
    history: String,
    government: String,
    economy: String,
    technology: String
  },
  map: {              // Optional map data
    imageUrl: String,
    coordinates: Object
  },
  relatedSettings: [ObjectId], // References to related settings
  characters: [ObjectId], // Characters associated with this setting
  objects: [ObjectId],    // Objects found in this setting
  imageUrl: String,       // URL to setting image
  notes: String,          // Additional notes
  createdAt: Date,
  updatedAt: Date
}
```

### Objects
```javascript
{
  _id: ObjectId,
  projectId: ObjectId, // Reference to parent project
  name: String,        // Object name
  description: String, // Object description
  type: String,        // E.g., "Item", "Artifact", "Vehicle"
  significance: String, // Object's significance to the story
  properties: {
    physical: {
      size: String,
      material: String,
      appearance: String
    },
    magical: {        // For fantasy stories
      powers: [String],
      limitations: [String],
      origin: String
    }
  },
  history: String,     // Object's history
  location: ObjectId,  // Reference to setting where object is located
  owner: ObjectId,     // Reference to character who owns the object
  imageUrl: String,    // URL to object image
  notes: String,       // Additional notes
  createdAt: Date,
  updatedAt: Date
}
```

### Plotlines
```javascript
{
  _id: ObjectId,
  projectId: ObjectId, // Reference to parent project
  title: String,       // Plotline title
  description: String, // Plotline description
  type: String,        // E.g., "Main Plot", "Subplot", "Character Arc"
  structure: String,   // E.g., "Three-Act", "Hero's Journey"
  importance: Number,  // 1-5 scale of importance to the story
  status: String,      // E.g., "Planned", "In Progress", "Completed"
  elements: [{
    type: String,      // E.g., "Setup", "Conflict", "Resolution"
    description: String,
    characters: [ObjectId], // Characters involved
    settings: [ObjectId],   // Settings involved
    objects: [ObjectId],    // Objects involved
    order: Number           // Order in the plotline
  }],
  relatedPlotlines: [ObjectId], // References to related plotlines
  notes: String,       // Additional notes
  createdAt: Date,
  updatedAt: Date
}
```

### Chapters
```javascript
{
  _id: ObjectId,
  projectId: ObjectId, // Reference to parent project
  title: String,       // Chapter title
  position: Number,    // Chapter order in the story
  synopsis: String,    // Brief chapter summary
  content: String,     // Chapter content (may be stored as rich text)
  status: String,      // E.g., "Draft", "Revised", "Final"
  wordCount: Number,   // Word count for the chapter
  characters: [ObjectId], // Characters appearing in the chapter
  settings: [ObjectId],   // Settings appearing in the chapter
  plotlines: [ObjectId],  // Plotlines advanced in the chapter
  objects: [ObjectId],    // Objects featured in the chapter
  notes: String,          // Additional notes
  aiGenerated: {         // Metadata for AI-generated content
    isGenerated: Boolean,
    generatedTimestamp: Date,
    prompt: String,
    model: String
  },
  edits: [{              // Edit history
    timestamp: Date,
    userId: ObjectId,
    changes: String
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### Metadata
```javascript
{
  _id: ObjectId,
  type: String,         // E.g., "Genre", "Theme", "Style"
  name: String,         // Name of the metadata item
  description: String,  // Description
  examples: [String],   // Examples of usage
  suggestedPlotElements: [String], // Suggested elements for this type
  suggestedCharacterTypes: [String], // Suggested character types
  createdAt: Date,
  updatedAt: Date
}
```

## Relationships

The database schema establishes relationships between collections through reference fields:

- **Users** → **Projects**: One-to-many (a user can have multiple projects)
- **Projects** → **Characters**, **Settings**, **Objects**, **Plotlines**, **Chapters**: One-to-many (a project contains multiple elements)
- **Characters** ↔ **Characters**: Many-to-many (characters have relationships with other characters)
- **Characters** → **Plotlines**: Many-to-many (characters are involved in multiple plotlines)
- **Settings** → **Characters**, **Objects**: Many-to-many (settings contain characters and objects)
- **Chapters** → **Characters**, **Settings**, **Objects**, **Plotlines**: Many-to-many (chapters reference multiple story elements)

## Indexes

To optimize query performance, the following indexes will be implemented:

- `users.username` (unique)
- `users.email` (unique)
- `projects.userId`
- `characters.projectId`
- `settings.projectId`
- `objects.projectId`
- `plotlines.projectId`
- `chapters.projectId`
- `chapters.position`

## Data Validation

Mongoose schemas will include validation rules to ensure data integrity:

- Required fields (e.g., name, title, description)
- String length constraints
- Enumerated values for fields with fixed options
- Reference validation to ensure relationships are valid
- Custom validators for complex rules 