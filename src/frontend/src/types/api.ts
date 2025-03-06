// User types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  projectId?: string;
  genre?: string;
  status?: string;
  progress?: number;
}

// Character types
export interface Character {
  id: string;
  name: string;
  biography: string;
  traits: string[];
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// Setting types
export interface Setting {
  id: string;
  name: string;
  description: string;
  location: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// Plot types
export interface Plot {
  id: string;
  title: string;
  summary: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// Chapter types
export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// Export types
export interface Export {
  id: string;
  fileName: string;
  fileUrl: string;
  format: string;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}

// AI Response types
export interface AITextResponse {
  generatedText: string;
  prompt: string;
  model: string;
}

export interface AIAnalysisResponse {
  analysis: {
    summary: string;
    keyPoints: string[];
    suggestions: string[];
  };
  text: string;
}

// Stats types
export interface ProjectStats {
  projectId: string;
  wordCount: number;
  characterCount: number;
  settingCount: number;
  plotCount: number;
  chapterCount: number;
} 