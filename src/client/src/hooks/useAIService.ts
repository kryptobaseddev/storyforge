
import { useState } from "react";
import { useToast } from "./use-toast";
import { apiRequest } from "@/lib/queryClient";
import { generateAIContent, generateStructuredAIContent, getAISuggestions } from "@/lib/api";

// Content types for AI generation
export type ContentType = 
  | 'character'
  | 'setting'
  | 'object'
  | 'plot'
  | 'scene'
  | 'dialogue'
  | 'chapter'
  | 'general';

type AIResponse = {
  content: string;
  success: boolean;
};

export const useAIService = () => {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Generate content based on prompt and type
  const generateContent = async (
    prompt: string, 
    contentType: ContentType = 'general',
    options?: {
      temperature?: number;
      maxTokens?: number;
    }
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await apiRequest('POST', '/api/ai/generate', {
        prompt,
        contentType,
        temperature: options?.temperature || 0.7,
        maxTokens: options?.maxTokens || 1000
      });

      const data = await response.json();
      return data.content;
    } catch (error: any) {
      setError(error);
      toast({
        title: "AI Generation Failed",
        description: error.message || "Something went wrong with the AI generation",
        variant: "destructive",
      });
      return "";
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate structured content with JSON response
  const generateStructuredContent = async (
    prompt: string,
    contentType: ContentType = 'general',
    options?: {
      temperature?: number;
    }
  ): Promise<{ content: string; suggestions: string[] }> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await apiRequest('POST', '/api/ai/structured-generate', {
        prompt,
        contentType,
        temperature: options?.temperature || 0.7
      });

      const data = await response.json();
      return {
        content: data.content,
        suggestions: data.suggestions || []
      };
    } catch (error: any) {
      setError(error);
      toast({
        title: "AI Generation Failed",
        description: error.message || "Something went wrong with the AI generation",
        variant: "destructive",
      });
      return {
        content: "",
        suggestions: []
      };
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate contextual suggestions based on current tool
  const generateContextualSuggestions = async (
    projectId: number,
    currentTool: string,
    additionalContext: string = ""
  ): Promise<string[]> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await apiRequest('POST', '/api/ai/suggestions', {
        projectId,
        currentTool,
        additionalContext
      });

      const data = await response.json();
      return data.suggestions || [];
    } catch (error: any) {
      setError(error);
      console.error("Suggestion error:", error);
      return [
        "Consider developing your characters' motivations further",
        "Think about how this element connects to your main plot",
        "Try exploring different perspectives",
        "Consider the pacing of your narrative",
        "Look for opportunities to create more conflict"
      ];
    } finally {
      setIsGenerating(false);
    }
  };

  // Process chat message with context
  const processChatMessage = async (
    projectId: number,
    currentTool: string,
    message: string,
    chatHistory: {role: string, content: string}[] = []
  ): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await apiRequest('POST', '/api/ai/chat', {
        projectId,
        currentTool,
        message,
        chatHistory
      });

      const data = await response.json();
      return data.response || "";
    } catch (error: any) {
      setError(error);
      console.error("Chat error:", error);
      return "I'm sorry, I'm having trouble processing your request right now.";
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate a character
  const generateCharacter = async (
    prompt: string,
    options?: {
      role?: string;
      archetype?: string;
      temperature?: number;
    }
  ): Promise<AIResponse> => {
    const enhancedPrompt = `Create a character profile for a story.
      Role in story: ${options?.role || ''}
      Character archetype: ${options?.archetype || ''}
      ${prompt}
      
      Include name, physical appearance, personality traits, background, motivations, strengths, weaknesses, and speech patterns.`;

    const content = await generateContent(enhancedPrompt, 'character', { 
      temperature: options?.temperature || 0.7 
    });
    
    return { content, success: !!content };
  };

  // Generate a setting
  const generateSetting = async (
    prompt: string,
    options?: {
      settingType?: string;
      mood?: string;
      temperature?: number;
    }
  ): Promise<AIResponse> => {
    const enhancedPrompt = `Create a detailed setting description for a story.
      Setting type: ${options?.settingType || ''}
      Mood/atmosphere: ${options?.mood || ''}
      ${prompt}
      
      Include physical description, history, cultural elements, climate, and sensory details.`;

    const content = await generateContent(enhancedPrompt, 'setting', { 
      temperature: options?.temperature || 0.7 
    });
    
    return { content, success: !!content };
  };

  // Generate a plot
  const generatePlot = async (
    prompt: string,
    options?: {
      genre?: string;
      structure?: string;
      temperature?: number;
    }
  ): Promise<AIResponse> => {
    const enhancedPrompt = `Create a plot outline for a story.
      Genre: ${options?.genre || ''}
      Structure: ${options?.structure || ''}
      ${prompt}
      
      Include premise, major plot points, conflicts, stakes, and a potential resolution.`;

    const content = await generateContent(enhancedPrompt, 'plot', { 
      temperature: options?.temperature || 0.7 
    });
    
    return { content, success: !!content };
  };

  // Generate a scene
  const generateScene = async (
    prompt: string,
    options?: {
      character?: string;
      setting?: string;
      mood?: string;
      temperature?: number;
    }
  ): Promise<AIResponse> => {
    const enhancedPrompt = `Write a detailed scene for a story.
      Main character: ${options?.character || ''}
      Setting: ${options?.setting || ''}
      Mood: ${options?.mood || ''}
      ${prompt}
      
      Include vivid sensory details, meaningful character actions, and atmospheric elements.`;

    const content = await generateContent(enhancedPrompt, 'scene', { 
      temperature: options?.temperature || 0.8,
      maxTokens: 1500
    });
    
    return { content, success: !!content };
  };

  // Generate dialogue
  const generateDialogue = async (
    prompt: string,
    options?: {
      character1?: string;
      character2?: string;
      topic?: string;
      relationship?: string;
      temperature?: number;
    }
  ): Promise<AIResponse> => {
    const enhancedPrompt = `Write a dialogue between two characters.
      Character 1: ${options?.character1 || ''}
      Character 2: ${options?.character2 || ''}
      Relationship: ${options?.relationship || ''}
      Topic/Situation: ${options?.topic || ''}
      ${prompt}
      
      Make the dialogue reveal character traits, move the story forward, and create natural-sounding speech patterns for each character.`;

    const content = await generateContent(enhancedPrompt, 'dialogue', { 
      temperature: options?.temperature || 0.8 
    });
    
    return { content, success: !!content };
  };

  return {
    generateContent,
    generateStructuredContent,
    generateContextualSuggestions,
    processChatMessage,
    generateCharacter,
    generateSetting,
    generatePlot,
    generateScene,
    generateDialogue,
    isGenerating,
    error
  };
};
