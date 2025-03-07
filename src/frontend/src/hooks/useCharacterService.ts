import { trpc } from '../utils/trpc';

export const useCharacterService = () => {
  const utils = trpc.useContext();

  // Get all characters for a project
  const getAllCharacters = (projectId: string) => {
    return trpc.character.getAll.useQuery({ projectId });
  };

  // Get a single character by ID
  const getCharacter = (projectId: string, characterId: string) => {
    return trpc.character.getById.useQuery({ projectId, characterId });
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

  return {
    getAllCharacters,
    getCharacter,
    createCharacter,
    updateCharacter,
    deleteCharacter,
  };
}; 