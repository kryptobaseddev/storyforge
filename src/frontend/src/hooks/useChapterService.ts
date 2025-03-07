import { trpc } from '../utils/trpc';

export const useChapterService = () => {
  const utils = trpc.useContext();

  // Get all chapters for a project
  const getAllChapters = (projectId: string) => {
    return trpc.chapter.getAll.useQuery({ projectId });
  };

  // Get a single chapter by ID
  const getChapter = (projectId: string, chapterId: string) => {
    return trpc.chapter.getById.useQuery({ projectId, chapterId });
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