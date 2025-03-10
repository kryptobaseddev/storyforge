import { trpc } from '../utils/trpc';

export const useObjectService = () => {
  const utils = trpc.useContext();

  // Get all objects for a project with caching
  const getAllObjects = (projectId: string) => {
    return trpc.object.getAll.useQuery({ projectId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when projectId is available
      enabled: !!projectId,
    });
  };

  // Get a single object by ID with caching
  const getObject = (projectId: string, objectId: string) => {
    return trpc.object.getById.useQuery({ projectId, objectId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when both IDs are available
      enabled: !!projectId && !!objectId,
    });
  };

  // Create a new object
  const createObject = () => {
    return trpc.object.create.useMutation({
      onSuccess: (data) => {
        // Invalidate the objects query to refetch the data
        utils.object.getAll.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Update an existing object
  const updateObject = () => {
    return trpc.object.update.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.object.getAll.invalidate({ projectId: data.projectId });
        utils.object.getById.invalidate({ projectId: data.projectId, objectId: data.id });
      },
    });
  };

  // Delete an object
  const deleteObject = () => {
    return trpc.object.delete.useMutation({
      onSuccess: (_, variables) => {
        // Invalidate the objects query to refetch the data
        utils.object.getAll.invalidate({ projectId: variables.projectId });
      },
    });
  };

  // Get objects by owner (character)
  const getObjectsByOwner = (projectId: string, ownerId: string) => {
    return trpc.object.getByOwner.useQuery({ projectId, ownerId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when both IDs are available
      enabled: !!projectId && !!ownerId,
    });
  };

  // Get objects by location (setting)
  const getObjectsByLocation = (projectId: string, locationId: string) => {
    return trpc.object.getByLocation.useQuery({ projectId, locationId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when both IDs are available
      enabled: !!projectId && !!locationId,
    });
  };

  // Search objects
  const searchObjects = (projectId: string, query: string) => {
    return trpc.object.search.useQuery({ projectId, query }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when both parameters are available
      enabled: !!projectId && !!query && query.length > 0,
    });
  };

  return {
    getAllObjects,
    getObject,
    createObject,
    updateObject,
    deleteObject,
    getObjectsByOwner,
    getObjectsByLocation,
    searchObjects,
  };
}; 