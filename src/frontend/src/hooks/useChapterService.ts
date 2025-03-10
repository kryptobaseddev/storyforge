import { trpc } from '../utils/trpc';

export const useChapterService = () => {
  const utils = trpc.useContext();

  // Get all chapters for a project with caching
  const getAllChapters = (projectId: string) => {
    return trpc.chapter.getAll.useQuery({ projectId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when projectId is available
      enabled: !!projectId,
    });
  };

  // Get a single chapter by ID with caching
  const getChapter = (projectId: string, chapterId: string) => {
    return trpc.chapter.getById.useQuery({ projectId, chapterId }, {
      // Keep data fresh for 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache data for 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Enable this to only fetch when both IDs are available
      enabled: !!projectId && !!chapterId,
    });
  };

  // Create a new chapter
  const createChapter = () => {
    return trpc.chapter.create.useMutation({
      onSuccess: (data) => {
        // Invalidate the chapters query to refetch the data
        utils.chapter.getAll.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Update an existing chapter
  const updateChapter = () => {
    return trpc.chapter.update.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.chapter.getAll.invalidate({ projectId: data.projectId });
        utils.chapter.getById.invalidate({ projectId: data.projectId, chapterId: data.id });
      },
    });
  };

  // Delete a chapter
  const deleteChapter = () => {
    return trpc.chapter.delete.useMutation({
      onSuccess: (data, variables) => {
        // Invalidate the chapters query to refetch the data
        utils.chapter.getAll.invalidate({ projectId: variables.projectId });
      },
    });
  };

  // Update chapter content
  const updateChapterContent = () => {
    return trpc.chapter.updateContent.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.chapter.getAll.invalidate({ projectId: data.projectId });
        utils.chapter.getById.invalidate({ projectId: data.projectId, chapterId: data.id });
      },
    });
  };

  // Reorder chapters
  const reorderChapters = () => {
    return trpc.chapter.reorder.useMutation({
      onSuccess: (_, variables) => {
        // Invalidate the chapters query to refetch the data
        utils.chapter.getAll.invalidate({ projectId: variables.projectId });
      },
    });
  };

  // Add an edit record to a chapter
  const addChapterEdit = () => {
    return trpc.chapter.addEdit.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.chapter.getAll.invalidate({ projectId: data.projectId });
        utils.chapter.getById.invalidate({ projectId: data.projectId, chapterId: data.id });
      },
    });
  };

  return {
    getAllChapters,
    getChapter,
    createChapter,
    updateChapter,
    deleteChapter,
    updateChapterContent,
    reorderChapters,
    addChapterEdit,
  };
}; 