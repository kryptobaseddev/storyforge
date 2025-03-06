import { trpc } from '../utils/trpc';

export const useChapterService = () => {
  const utils = trpc.useContext();

  // Get all chapters for a project
  const getAllChapters = (projectId: string) => {
    return trpc.chapter.getAllByProject.useQuery({ projectId });
  };

  // Get a single chapter by ID
  const getChapter = (chapterId: string) => {
    return trpc.chapter.getById.useQuery({ chapterId });
  };

  // Create a new chapter
  const createChapter = () => {
    return trpc.chapter.create.useMutation({
      onSuccess: (data) => {
        // Invalidate the chapters query to refetch the data
        utils.chapter.getAllByProject.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Update an existing chapter
  const updateChapter = () => {
    return trpc.chapter.update.useMutation({
      onSuccess: (data) => {
        // Invalidate specific queries to refetch data
        utils.chapter.getAllByProject.invalidate({ projectId: data.projectId });
        utils.chapter.getById.invalidate({ chapterId: data.id });
      },
    });
  };

  // Delete a chapter
  const deleteChapter = () => {
    return trpc.chapter.delete.useMutation({
      onSuccess: (data) => {
        // Invalidate the chapters query to refetch the data
        utils.chapter.getAllByProject.invalidate({ projectId: data.projectId });
      },
    });
  };

  // Update chapter content
  const updateChapterContent = () => {
    return trpc.chapter.updateContent.useMutation({
      onSuccess: (data) => {
        // Invalidate the specific chapter to refetch data
        utils.chapter.getById.invalidate({ chapterId: data.id });
      },
    });
  };

  // Reorder chapters
  const reorderChapters = () => {
    return trpc.chapter.reorderChapters.useMutation({
      onSuccess: (data) => {
        // Invalidate the chapters query to refetch the data
        utils.chapter.getAllByProject.invalidate({ projectId: data.projectId });
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
  };
}; 