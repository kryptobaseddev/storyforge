/**
 * Schema Types
 * 
 * This file re-exports types from our backend Zod schemas to be used in the frontend.
 * It provides a centralized place for all our type definitions.
 */

// Re-export types from backend schemas
// These types are inferred from the Zod schemas in the backend

// Project Types
export interface Project {
  id: string;
  title: string;
  description: string;
  genre?: string;
  targetAudience?: string;
  narrativeType?: string;
  tone?: string;
  style?: string;
  status?: 'Draft' | 'In Progress' | 'Completed' | 'Archived';
  userId: string;
  collaborators: Collaborator[];
  isPublic: boolean;
  completionDate?: string | null;
  targetLength?: {
    type: 'Words' | 'Pages' | 'Chapters';
    value: number;
  };
  metadata?: {
    createdWithTemplate: boolean;
    templateId?: string;
    tags: string[];
  };
  createdAt: string;
  updatedAt: string;
  progress?: number;
}

export interface Collaborator {
  userId: string;
  role: 'Editor' | 'Viewer' | 'Contributor';
}

export interface CreateProjectInput {
  title: string;
  description?: string;
  genre?: string;
  targetAudience?: string;
  narrativeType?: string;
  tone?: string;
  style?: string;
  targetLength?: {
    type: 'Words' | 'Pages' | 'Chapters';
    value: number;
  };
  metadata?: {
    createdWithTemplate: boolean;
    templateId?: string;
    tags: string[];
  };
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {
  status?: 'Draft' | 'In Progress' | 'Completed' | 'Archived';
  completionDate?: string | null;
  isPublic?: boolean;
}

// Character Types
export interface Character {
  id: string;
  projectId: string;
  name: string;
  shortDescription?: string;
  detailedBackground?: string;
  role?: string;
  attributes?: Record<string, string | number | boolean>;
  relationships: CharacterRelationship[];
  plotInvolvement: string[];
  possessions: string[];
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CharacterRelationship {
  characterId: string;
  relationshipType: string;
  notes?: string;
}

export interface CreateCharacterInput {
  name: string;
  shortDescription?: string;
  detailedBackground?: string;
  role?: string;
  attributes?: Record<string, string | number | boolean>;
  possessions?: string[];
  imageUrl?: string;
  notes?: string;
}

export type UpdateCharacterInput = Partial<CreateCharacterInput>;

// Setting Types
export interface Setting {
  id: string;
  projectId: string;
  name: string;
  description?: string;
  type: 'City' | 'Country' | 'Planet' | 'Building' | 'Landscape' | 'Region' | 'World' | 'Room' | 'Other';
  details?: Record<string, string | number | boolean>;
  map?: {
    imageUrl: string;
    coordinates: Record<string, number>;
  };
  relatedSettings: string[];
  characters: string[];
  objects: string[];
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSettingInput {
  name: string;
  description?: string;
  type: 'City' | 'Country' | 'Planet' | 'Building' | 'Landscape' | 'Region' | 'World' | 'Room' | 'Other';
  details?: Record<string, string | number | boolean>;
  imageUrl?: string;
  notes?: string;
}

export type UpdateSettingInput = Partial<CreateSettingInput>;

// Plot Types
export interface Plot {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: 'Main Plot' | 'Subplot' | 'Character Arc';
  structure: 'Three-Act' | 'Hero\'s Journey' | 'Save the Cat' | 'Seven-Point' | 'Freytag\'s Pyramid' | 'Fichtean Curve' | 'Custom';
  importance: number;
  status: 'Planned' | 'In Progress' | 'Completed' | 'Abandoned';
  elements: PlotElement[];
  relatedPlots: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PlotElement {
  id: string;
  type: 'Setup' | 'Inciting Incident' | 'Rising Action' | 'Midpoint' | 'Complications' | 'Crisis' | 'Climax' | 'Resolution' | 'Custom';
  description: string;
  characters: string[];
  settings: string[];
  objects: string[];
  order: number;
}

export interface CreatePlotInput {
  title: string;
  description: string;
  type: 'Main Plot' | 'Subplot' | 'Character Arc';
  structure: 'Three-Act' | 'Hero\'s Journey' | 'Save the Cat' | 'Seven-Point' | 'Freytag\'s Pyramid' | 'Fichtean Curve' | 'Custom';
  importance?: number;
  status?: 'Planned' | 'In Progress' | 'Completed' | 'Abandoned';
  notes?: string;
}

export type UpdatePlotInput = Partial<CreatePlotInput>;

// Chapter Types
export interface Chapter {
  id: string;
  projectId: string;
  title: string;
  position: number;
  synopsis?: string;
  content: string;
  status: 'Draft' | 'In Progress' | 'Completed' | 'Revision' | 'Final';
  wordCount: number;
  characters: string[];
  settings: string[];
  plots: string[];
  objects: string[];
  notes?: string;
  aiGenerated: boolean;
  edits: ChapterEdit[];
  createdAt: string;
  updatedAt: string;
}

export interface ChapterEdit {
  timestamp: string;
  userId: string;
  changes: string;
}

export interface CreateChapterInput {
  title: string;
  position?: number;
  synopsis?: string;
  content?: string;
  status?: 'Draft' | 'In Progress' | 'Completed' | 'Revision' | 'Final';
  characters?: string[];
  settings?: string[];
  plots?: string[];
  objects?: string[];
  notes?: string;
  aiGenerated?: boolean;
}

export type UpdateChapterInput = Partial<CreateChapterInput>;

export interface UpdateChapterContentInput {
  content: string;
  wordCount?: number;
}

// Export Types
export interface Export {
  id: string;
  projectId: string;
  userId: string;
  format: string;
  name: string;
  description?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Failed';
  configuration: ExportConfiguration;
  fileUrl?: string;
  errorMessage?: string;
  completedAt?: string;
  fileSize?: number;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ExportConfiguration {
  includeChapters: string[];
  includeTitlePage: boolean;
  includeTableOfContents: boolean;
  includeCharacterList: boolean;
  includeSettingDescriptions: boolean;
  customCss?: string;
  templateId?: string;
  pageSize: string;
  fontFamily: string;
  fontSize: number;
}

export interface CreateExportInput {
  format: string;
  name: string;
  description?: string;
  configuration?: Partial<ExportConfiguration>;
}

// AI Types
export interface GenerationPrompt {
  project_id: string;
  user_id: string;
  task: string;
  prompt: string;
  max_tokens?: number;
  temperature?: number;
  model?: string;
  options?: Record<string, string | number | boolean>;
}

export interface AIGeneration {
  id: string;
  project_id: string;
  user_id: string;
  task: string;
  request_params: Record<string, unknown>;
  response_content: string;
  metadata: {
    model: string;
    timestamp: string;
    token_usage: {
      prompt: number;
      completion: number;
      total: number;
    }
  };
  is_saved: boolean;
  parent_id?: string;
  created_at: string;
}

// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  age?: number;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: number;
  readingLevel: 'elementary' | 'middle grade' | 'young adult' | 'adult';
  notificationSettings: Record<string, boolean>;
}

export interface UpdateProfileInput {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  age?: number;
  avatar?: string;
}

export interface UpdatePreferencesInput {
  theme?: 'light' | 'dark' | 'system';
  fontSize?: number;
  readingLevel?: 'elementary' | 'middle grade' | 'young adult' | 'adult';
  notificationSettings?: Record<string, boolean>;
}

export interface ChangePasswordInput {
  currentPassword: string;
  newPassword: string;
}

// Auth Types
export interface RegisterInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Stats Types
export interface ProjectStats {
  projectId: string;
  wordCount: number;
  characterCount: number;
  settingCount: number;
  plotCount: number;
  chapterCount: number;
}

// Object Types
export interface Object {
  id: string;
  projectId: string;
  name: string;
  description: string;
  type: 'Item' | 'Artifact' | 'Vehicle' | 'Weapon' | 'Tool' | 'Clothing' | 'Other';
  significance: string;
  properties: {
    physical: {
      size: string;
      material: string;
      appearance: string;
    };
    magical?: {
      powers: string[];
      limitations: string[];
      origin: string;
    };
  };
  history: string;
  location?: string;
  owner?: string;
  imageUrl?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateObjectInput {
  name: string;
  description: string;
  type: 'Item' | 'Artifact' | 'Vehicle' | 'Weapon' | 'Tool' | 'Clothing' | 'Other';
  significance?: string;
  properties?: {
    physical?: {
      size?: string;
      material?: string;
      appearance?: string;
    };
    magical?: {
      powers?: string[];
      limitations?: string[];
      origin?: string;
    };
  };
  history?: string;
  location?: string;
  owner?: string;
  imageUrl?: string;
  notes?: string;
}

export type UpdateObjectInput = Partial<CreateObjectInput>; 