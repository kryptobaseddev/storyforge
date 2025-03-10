import { ContentType } from "@/hooks/useAIService";
import { apiRequest } from "./queryClient";

/**
 * API helper functions for making requests to the server
 */

/**
 * Generate AI content based on the prompt and type
 * @param prompt The user prompt
 * @param contentType The type of content to generate
 * @param temperature The temperature to use (0.0 to 1.0)
 * @returns The generated content
 */
export async function generateAIContent(
  prompt: string,
  contentType: ContentType = 'general',
  temperature: number = 0.7
): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/ai/generate', {
      prompt,
      contentType,
      temperature,
    });

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error generating AI content:", error);
    return "Could not generate content at this time. Please try again later.";
  }
}

/**
 * Generate structured AI content based on the prompt and type
 * @param prompt The user prompt
 * @param contentType The type of content to generate
 * @param temperature The temperature to use (0.0 to 1.0)
 * @returns The generated content in structured format
 */
export async function generateStructuredAIContent(
  prompt: string,
  contentType: ContentType,
  temperature: number = 0.7
): Promise<{
  content: string;
  suggestions: string[];
}> {
  try {
    const response = await apiRequest('POST', '/api/ai/structured-generate', {
      prompt,
      contentType,
      temperature,
    });

    const data = await response.json();
    return {
      content: data.content,
      suggestions: data.suggestions || [],
    };
  } catch (error) {
    console.error("Error generating structured AI content:", error);
    return {
      content: "Could not generate content at this time. Please try again later.",
      suggestions: []
    };
  }
}

/**
 * Get AI suggestions based on the current context
 * @param projectId The project ID for context
 * @param currentTool The tool the user is currently using
 * @param additionalContext Additional context to help generate better suggestions
 * @returns The AI suggestions
 */
export async function getAISuggestions(
  projectId: number,
  currentTool: string,
  additionalContext: string = ""
): Promise<string[]> {
  try {
    const response = await apiRequest('POST', '/api/ai/suggestions', {
      projectId,
      currentTool,
      additionalContext,
    });

    const data = await response.json();
    return data.suggestions || [];
  } catch (error) {
    console.error("Error getting AI suggestions:", error);
    return [
      "Consider developing your character's motivations further",
      "How might this connect to your main plot?",
      "Think about the setting's influence on this element",
      "Consider adding more sensory details",
      "How would other characters react to this?"
    ];
  }
}

/**
 * Process a chat message with project context awareness
 * @param projectId The project ID for context
 * @param currentTool The current tool the user is in
 * @param message The user's message
 * @param chatHistory Previous chat history
 * @returns The AI response
 */
export async function processChatMessage(
  projectId: number,
  currentTool: string,
  message: string,
  chatHistory: {role: string, content: string}[] = []
): Promise<string> {
  try {
    const response = await apiRequest('POST', '/api/ai/chat', {
      projectId,
      currentTool,
      message,
      chatHistory
    });

    const data = await response.json();
    return data.response || "";
  } catch (error) {
    console.error("Error processing chat message:", error);
    return "I'm sorry, I'm having trouble processing your message right now. Please try again later.";
  }
}