import { trpc } from '../utils/trpc';

export const useCharacterService = () => {
  const utils = trpc.useContext();

  // Get all characters for a project with caching
  const getAllCharacters = (projectId: string) => {
    return trpc.character.getAll.useQuery({ projectId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when projectId is available
      enabled: !!projectId,
    });
  };

  // Get a single character by ID with caching
  const getCharacter = (projectId: string, characterId: string) => {
    return trpc.character.getById.useQuery({ projectId, characterId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when both IDs are available
      enabled: !!projectId && !!characterId,
    });
  };

  // Create a new character
  const createCharacter = () => {
    return trpc.character.create.useMutation({
      onSuccess: (data) => {
        // Invalidate the characters query to refetch the data
        utils.character.getAll.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Update an existing character
  const updateCharacter = () => {
    return trpc.character.update.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.character.getAll.invalidate({ projectId: data.projectId });
        utils.character.getById.invalidate({ projectId: data.projectId, characterId: data.id });
      },
    });
  };

  // Delete a character
  const deleteCharacter = () => {
    return trpc.character.delete.useMutation({
      onSuccess: (_, variables) => {
        // Invalidate the characters query to refetch the data
        utils.character.getAll.invalidate({ projectId: variables.projectId });
      },
    });
  };

  // Add an object to a character's possessions
  const addPossession = () => {
    return trpc.character.addPossession.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.character.getAll.invalidate({ projectId: data.projectId });
        utils.character.getById.invalidate({ projectId: data.projectId, characterId: data.id });
        // Also invalidate object queries since the owner has changed
        utils.object.getAll.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Remove an object from a character's possessions
  const removePossession = () => {
    return trpc.character.removePossession.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.character.getAll.invalidate({ projectId: data.projectId });
        utils.character.getById.invalidate({ projectId: data.projectId, characterId: data.id });
        // Also invalidate object queries since the owner has changed
        utils.object.getAll.invalidate({ projectId: data.projectId });
      },
    });
  };

  return {
    getAllCharacters,
    getCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
    addPossession,
    removePossession,
  };
}; 