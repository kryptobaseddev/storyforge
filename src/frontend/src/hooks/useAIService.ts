import { trpc } from '../utils/trpc';

export const useAIService = () => {
  // Generate content based on a prompt
  const generateContent = () => {
    return trpc.ai.generateContent.useMutation();
  };

  // Generate an image based on a prompt
  const generateImage = () => {
    return trpc.ai.generateImage.useMutation();
  };

  // Save a generated content
  const saveGeneration = () => {
    return trpc.ai.saveGeneration.useMutation();
  };

  // Get all AI generations for a project
  const getGenerationsForProject = (projectId: string) => {
    return trpc.ai.getGenerationsForProject.useQuery({ projectId });
  };

  // Get a specific AI generation by ID
  const getGeneration = (generationId: string) => {
    return trpc.ai.getGeneration.useQuery({ generationId });
  };

  return {
    generateContent,
    generateImage,
    saveGeneration,
    getGenerationsForProject,
    getGeneration,
  };
}; 