import { trpc } from '../utils/trpc';

export const useAIService = () => {
  // Generate text based on a prompt
  const generateText = () => {
    return trpc.ai.generateText.useMutation();
  };

  // Continue existing text
  const continueText = () => {
    return trpc.ai.continueText.useMutation();
  };

  // Get writing suggestions
  const getSuggestions = () => {
    return trpc.ai.getSuggestions.useMutation();
  };

  // Analyze text for insights
  const analyzeText = () => {
    return trpc.ai.analyzeText.useMutation();
  };

  return {
    generateText,
    continueText,
    getSuggestions,
    analyzeText,
  };
}; 