/**
 * AI Context Manager
 * 
 * This helper manages the context for AI requests, selecting relevant
 * story elements based on the current task and optimizing the context
 * to stay within token limits.
 */

import { AITaskType } from '../../types/ai.types';

// Project context type definition
export interface ProjectContext {
  id: string;
  title: string;
  genre: string;
  target_audience: string;
  tone: string;
  style: string;
}

// Story element base interface
export interface StoryElement {
  id: string;
  name: string;
  type: 'character' | 'setting' | 'plot_point' | 'chapter';
  description: string;
  importance: number;
  created_at: Date;
  updated_at: Date;
  last_referenced_at?: Date;
}

// Character element interface
export interface CharacterElement extends StoryElement {
  type: 'character';
  role: string;
  traits: string[];
  background?: string;
  goals?: string[];
  relationships?: Array<{
    with: string;
    type: string;
  }>;
}

// Setting element interface
export interface SettingElement extends StoryElement {
  type: 'setting';
  location_type: string;
  time_period?: string;
  key_features?: string[];
}

// Plot point element interface
export interface PlotPointElement extends StoryElement {
  type: 'plot_point';
  sequence: number;
  characters_involved?: string[];
  settings_involved?: string[];
  resolved: boolean;
}

// Chapter element interface
export interface ChapterElement extends StoryElement {
  type: 'chapter';
  sequence: number;
  content: string;
  characters_present?: string[];
  settings_present?: string[];
  plot_points_resolved?: string[];
}

// Context selection parameters
export interface ContextSelectionParams {
  project_id: string;
  task: AITaskType;
  character_ids?: string[];
  setting_ids?: string[];
  plot_point_ids?: string[];
  chapter_ids?: string[];
  max_elements?: number;
  include_recent?: boolean;
  recent_window_days?: number;
}

/**
 * Context Manager class for handling context selection and formatting
 */
export class ContextManager {
  /**
   * Get relevant context elements for an AI request
   * 
   * @param params - Context selection parameters
   * @returns Formatted context object with relevant elements
   */
  async getContext(params: ContextSelectionParams): Promise<any> {
    // Mock function for now - this would typically query a database
    // In a real implementation, this would fetch data from the database
    
    const projectContext = await this.getProjectContext(params.project_id);
    
    // Get relevant elements based on task
    const characters = await this.getRelevantCharacters(params);
    const settings = await this.getRelevantSettings(params);
    const plotPoints = await this.getRelevantPlotPoints(params);
    const chapters = await this.getRelevantChapters(params);
    
    // Format the context
    return {
      project: this.formatProjectContext(projectContext),
      characters: this.formatCharacters(characters),
      settings: this.formatSettings(settings),
      plot_points: this.formatPlotPoints(plotPoints),
      recent_content: this.formatChapters(chapters),
    };
  }
  
  /**
   * Get project context
   * 
   * @param projectId - The project ID
   * @returns Project context object
   */
  private async getProjectContext(projectId: string): Promise<ProjectContext> {
    // Mock function - would typically query the database
    return {
      id: projectId,
      title: "Sample Project",
      genre: "fantasy",
      target_audience: "young adult",
      tone: "adventurous",
      style: "descriptive",
    };
  }
  
  /**
   * Get relevant characters
   * 
   * @param params - Context selection parameters
   * @returns Array of relevant character elements
   */
  private async getRelevantCharacters(params: ContextSelectionParams): Promise<CharacterElement[]> {
    // Mock function - would typically query the database
    // This would filter and sort characters by relevance
    return [];
  }
  
  /**
   * Get relevant settings
   * 
   * @param params - Context selection parameters
   * @returns Array of relevant setting elements
   */
  private async getRelevantSettings(params: ContextSelectionParams): Promise<SettingElement[]> {
    // Mock function - would typically query the database
    return [];
  }
  
  /**
   * Get relevant plot points
   * 
   * @param params - Context selection parameters
   * @returns Array of relevant plot point elements
   */
  private async getRelevantPlotPoints(params: ContextSelectionParams): Promise<PlotPointElement[]> {
    // Mock function - would typically query the database
    return [];
  }
  
  /**
   * Get relevant chapters
   * 
   * @param params - Context selection parameters
   * @returns Array of relevant chapter elements
   */
  private async getRelevantChapters(params: ContextSelectionParams): Promise<ChapterElement[]> {
    // Mock function - would typically query the database
    return [];
  }
  
  /**
   * Calculate relevance score for a story element
   * 
   * @param element - The story element
   * @param params - Context selection parameters
   * @returns Relevance score (higher is more relevant)
   */
  private calculateRelevance(element: StoryElement, params: ContextSelectionParams): number {
    let score = 0;
    
    // Base importance score
    score += element.importance || 0;
    
    // Direct mention in parameters
    if (
      (element.type === 'character' && params.character_ids?.includes(element.id)) ||
      (element.type === 'setting' && params.setting_ids?.includes(element.id)) ||
      (element.type === 'plot_point' && params.plot_point_ids?.includes(element.id)) ||
      (element.type === 'chapter' && params.chapter_ids?.includes(element.id))
    ) {
      score += 10;
    }
    
    // Recency score
    if (params.include_recent && element.updated_at) {
      const daysSinceUpdate = (Date.now() - element.updated_at.getTime()) / (1000 * 60 * 60 * 24);
      const recentWindow = params.recent_window_days || 7;
      
      if (daysSinceUpdate <= recentWindow) {
        score += Math.max(0, 5 - (daysSinceUpdate / recentWindow) * 5);
      }
    }
    
    // Recently referenced bonus
    if (element.last_referenced_at) {
      const daysSinceReferenced = (Date.now() - element.last_referenced_at.getTime()) / (1000 * 60 * 60 * 24);
      if (daysSinceReferenced <= 1) { // Referenced in the last day
        score += 3;
      }
    }
    
    return score;
  }
  
  /**
   * Format project context to reduce token usage
   * 
   * @param project - The project context
   * @returns Formatted project context
   */
  private formatProjectContext(project: ProjectContext): any {
    return {
      title: project.title,
      genre: project.genre,
      audience: project.target_audience,
      tone: project.tone,
      style: project.style,
    };
  }
  
  /**
   * Format characters to reduce token usage
   * 
   * @param characters - Array of character elements
   * @returns Formatted character array
   */
  private formatCharacters(characters: CharacterElement[]): any[] {
    return characters.map(char => ({
      name: char.name,
      role: char.role,
      description: char.description,
      key_traits: char.traits?.slice(0, 3) || [],
      goals: char.goals?.slice(0, 2) || [],
    }));
  }
  
  /**
   * Format settings to reduce token usage
   * 
   * @param settings - Array of setting elements
   * @returns Formatted setting array
   */
  private formatSettings(settings: SettingElement[]): any[] {
    return settings.map(setting => ({
      name: setting.name,
      description: setting.description,
      type: setting.location_type,
      key_features: setting.key_features?.slice(0, 3) || [],
    }));
  }
  
  /**
   * Format plot points to reduce token usage
   * 
   * @param plotPoints - Array of plot point elements
   * @returns Formatted plot point array
   */
  private formatPlotPoints(plotPoints: PlotPointElement[]): any[] {
    return plotPoints.map(point => ({
      description: point.description,
      sequence: point.sequence,
      resolved: point.resolved,
    }));
  }
  
  /**
   * Format chapters to reduce token usage
   * 
   * @param chapters - Array of chapter elements
   * @returns Formatted chapter array
   */
  private formatChapters(chapters: ChapterElement[]): any[] {
    return chapters.map(chapter => ({
      title: chapter.name,
      summary: chapter.description,
      sequence: chapter.sequence,
    }));
  }
} 