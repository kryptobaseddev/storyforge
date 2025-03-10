import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Chapter, InsertChapter, Scene, InsertScene } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const useChapterService = (projectId: number) => {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Fetch chapters
  const { 
    data: chapters = [], 
    isLoading, 
    isError 
  } = useQuery<Chapter[]>({
    queryKey: ['/api/projects', projectId, 'chapters'],
    enabled: projectId > 0,
  });

  // Fetch scenes for a specific chapter
  const getScenes = (chapterId: number) => {
    return useQuery<Scene[]>({
      queryKey: ['/api/projects', projectId, 'chapters', chapterId, 'scenes'],
      enabled: chapterId > 0,
    });
  };

  // Create chapter mutation
  const createChapterMutation = useMutation({
    mutationFn: async (chapter: InsertChapter) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/chapters`, chapter);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'chapters'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error creating chapter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update chapter mutation
  const updateChapterMutation = useMutation({
    mutationFn: async ({ id, chapter }: { id: number; chapter: Partial<Chapter> }) => {
      const response = await apiRequest('PUT', `/api/projects/${projectId}/chapters/${id}`, chapter);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'chapters'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error updating chapter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete chapter mutation
  const deleteChapterMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/projects/${projectId}/chapters/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'chapters'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error deleting chapter",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Create scene mutation
  const createSceneMutation = useMutation({
    mutationFn: async ({ chapterId, scene }: { chapterId: number; scene: InsertScene }) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/chapters/${chapterId}/scenes`, scene);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'chapters', variables.chapterId, 'scenes'] 
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error creating scene",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update scene mutation
  const updateSceneMutation = useMutation({
    mutationFn: async ({ 
      chapterId, 
      sceneId, 
      scene 
    }: { 
      chapterId: number; 
      sceneId: number; 
      scene: Partial<Scene> 
    }) => {
      const response = await apiRequest(
        'PUT', 
        `/api/projects/${projectId}/chapters/${chapterId}/scenes/${sceneId}`, 
        scene
      );
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'chapters', variables.chapterId, 'scenes'] 
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error updating scene",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete scene mutation
  const deleteSceneMutation = useMutation({
    mutationFn: async ({ chapterId, sceneId }: { chapterId: number; sceneId: number }) => {
      const response = await apiRequest(
        'DELETE', 
        `/api/projects/${projectId}/chapters/${chapterId}/scenes/${sceneId}`, 
        undefined
      );
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'chapters', variables.chapterId, 'scenes'] 
      });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error deleting scene",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const createChapter = async (chapter: InsertChapter) => {
    return createChapterMutation.mutateAsync(chapter);
  };

  const updateChapter = async (id: number, chapter: Partial<Chapter>) => {
    return updateChapterMutation.mutateAsync({ id, chapter });
  };

  const deleteChapter = async (id: number) => {
    return deleteChapterMutation.mutateAsync(id);
  };

  const createScene = async (chapterId: number, scene: InsertScene) => {
    return createSceneMutation.mutateAsync({ chapterId, scene });
  };

  const updateScene = async (chapterId: number, sceneId: number, scene: Partial<Scene>) => {
    return updateSceneMutation.mutateAsync({ chapterId, sceneId, scene });
  };

  const deleteScene = async (chapterId: number, sceneId: number) => {
    return deleteSceneMutation.mutateAsync({ chapterId, sceneId });
  };

  // Add character to scene
  const addCharacterToScene = async (chapterId: number, sceneId: number, characterId: number) => {
    try {
      const response = await apiRequest(
        'POST', 
        `/api/projects/${projectId}/chapters/${chapterId}/scenes/${sceneId}/characters`, 
        { characterId }
      );
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'chapters', chapterId, 'scenes'] 
      });
      
      return response.json();
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error adding character to scene",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add setting to scene
  const addSettingToScene = async (chapterId: number, sceneId: number, settingId: number) => {
    try {
      const response = await apiRequest(
        'POST', 
        `/api/projects/${projectId}/chapters/${chapterId}/scenes/${sceneId}/settings`, 
        { settingId }
      );
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'chapters', chapterId, 'scenes'] 
      });
      
      return response.json();
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error adding setting to scene",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add object to scene
  const addObjectToScene = async (chapterId: number, sceneId: number, objectId: number) => {
    try {
      const response = await apiRequest(
        'POST', 
        `/api/projects/${projectId}/chapters/${chapterId}/scenes/${sceneId}/objects`, 
        { objectId }
      );
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'chapters', chapterId, 'scenes'] 
      });
      
      return response.json();
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error adding object to scene",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Add plot element to scene
  const addPlotElementToScene = async (chapterId: number, sceneId: number, plotElementId: number) => {
    try {
      const response = await apiRequest(
        'POST', 
        `/api/projects/${projectId}/chapters/${chapterId}/scenes/${sceneId}/plot-elements`, 
        { plotElementId }
      );
      
      queryClient.invalidateQueries({ 
        queryKey: ['/api/projects', projectId, 'chapters', chapterId, 'scenes'] 
      });
      
      return response.json();
    } catch (error: any) {
      setError(error);
      toast({
        title: "Error adding plot element to scene",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  // Sample data for development until API is implemented
  useEffect(() => {
    if (projectId <= 0 || !isLoading || chapters.length > 0) return;

    // Sample chapters data for UI development
    const sampleChapters: Chapter[] = [
      {
        id: 1,
        projectId,
        name: "The Gathering Storm",
        content: "The air crackled with unnatural energy as Thorne Blackwood stood at the summit of his obsidian tower. Lightning flashed across the sky, illuminating the sinister curves of his face as he gazed out over the shadowy landscape. The Crystal of Eternity pulsed in his grasp, its radiance casting an otherworldly glow upon the chamber.\n\n\"Soon,\" he whispered to the artifact, his voice barely audible above the howling wind. \"Soon your power will be mine entirely.\"\n\nMiles away, Arwen Silverleaf jolted awake, her heart pounding. The nightmare that had plagued her for weeks had returned with greater intensity. She wiped cold sweat from her brow and rose from her bed, moving to the window of Luna's cottage. In the distance, storm clouds gathered above Blackwood Tower, swirling in an unnatural pattern.\n\n\"It's beginning,\" she murmured, reaching for her bow. \"I need to warn the others.\"",
        sequence: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        projectId,
        name: "Shadows in the Forest",
        content: "The Whispering Woods had never felt so ominous. Arwen moved silently between ancient trees, their silver bark gleaming in the dappled moonlight that penetrated the canopy. Behind her, Kiran struggled to match her silent pace, his dwarven boots occasionally snapping a twig despite his best efforts.\n\n\"I still say we should have waited for daylight,\" he grumbled, adjusting the magical hammer at his belt. \"These woods have never been friendly, even to the elves.\"\n\nArwen held up her hand for silence, her keen ears detecting movement ahead. The moonsilver bow in her grip hummed with a gentle resonance, responding to her tension. Something was watching them from the shadows, something that didn't belong in these sacred woods.",
        sequence: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        projectId,
        name: "The Unexpected Ally",
        content: "The city of Mistral bustled with activity despite the late hour. Traders from distant lands haggled in the night markets, sailors sang bawdy songs in crowded taverns, and cloaked figures conducted business in shadowy alleyways. It was in one such alley that Arwen and Kiran waited, hoods drawn against the persistent coastal drizzle.\n\n\"Are you certain your contact will appear?\" Kiran asked, eyeing the passersby with suspicion. \"We've been waiting for—\"\n\nHis words died as a slender figure materialized from the shadows. Not approached—materialized, as if stepping through an invisible doorway. The stranger wore robes of midnight blue, their face concealed by an ornate mask carved from pale wood.\n\n\"You seek the Crystal,\" the figure stated in a voice that seemed neither male nor female. \"So does he. That makes us potential allies.\"",
        sequence: 3,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        projectId,
        name: "Secrets Revealed",
        content: "Luna's cottage seemed smaller than Arwen remembered, its walls lined with scrolls, dried herbs, and curious artifacts collected over centuries. The mystic moved gracefully despite her apparent age, preparing a tea that filled the room with a calming aroma of lavender and something more exotic.\n\n\"I hoped you would never need to know the full truth,\" Luna said, her eyes shifting color from silver to deep violet as she spoke. \"Some knowledge is a burden too heavy for even the strongest shoulders.\"\n\nShe placed an ancient scroll on the table between them. The parchment was unlike any Arwen had seen before—it seemed to shimmer with its own inner light, the symbols upon it moving subtly as if alive.\n\n\"The prophecy I told you was only half the story,\" Luna continued. \"The Crystal of Eternity is not merely a source of power. It is a key—a key to something the ancients sealed away for the protection of all realms.\"",
        sequence: 4,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 5,
        projectId,
        name: "The Dark Tower",
        content: "The air crackled with unnatural energy as Arwen Silverleaf stood before the obsidian doors of Blackwood Tower. Rain fell in diagonal sheets, driven by winds that howled like tortured spirits through the jagged rock formations surrounding the fortress. Lightning split the sky in shades of purple and blue, casting momentary illumination across her determined face.\n\n\"We shouldn't be here,\" whispered Kiran, the dwarf's usual bravado diminished in the shadow of the sorcerer's stronghold. His fingers tightened around the handle of his enchanted hammer, the runes etched along its surface pulsing with a gentle blue light. \"The very stones feel wrong.\"\n\nArwen turned to her companion, rainwater streaming down her face and plastering her silver hair to her cheeks. \"Luna's vision was clear. If we don't stop Thorne tonight, the Crystal will bond with him completely.\" She reached up to touch the ancient amulet at her throat, a parting gift from her mentor. It hummed against her skin, resonating with the magical energies saturating the air. \"There won't be another chance.\"",
        sequence: 5,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Sample scenes for the first chapter
    const sampleScenes: Scene[] = [
      {
        id: 1,
        chapterId: 1,
        name: "Thorne's Ritual Begins",
        content: "The air crackled with unnatural energy as Thorne Blackwood stood at the summit of his obsidian tower. Lightning flashed across the sky, illuminating the sinister curves of his face as he gazed out over the shadowy landscape. The Crystal of Eternity pulsed in his grasp, its radiance casting an otherworldly glow upon the chamber.\n\n\"Soon,\" he whispered to the artifact, his voice barely audible above the howling wind. \"Soon your power will be mine entirely.\"",
        sequence: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        chapterId: 1,
        name: "Arwen's Vision",
        content: "Miles away, Arwen Silverleaf jolted awake, her heart pounding. The nightmare that had plagued her for weeks had returned with greater intensity. She wiped cold sweat from her brow and rose from her bed, moving to the window of Luna's cottage. In the distance, storm clouds gathered above Blackwood Tower, swirling in an unnatural pattern.\n\n\"It's beginning,\" she murmured, reaching for her bow. \"I need to warn the others.\"",
        sequence: 2,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Mock the queryClient data for chapters
    queryClient.setQueryData(['/api/projects', projectId, 'chapters'], sampleChapters);
    
    // Mock the queryClient data for scenes
    queryClient.setQueryData(['/api/projects', projectId, 'chapters', 1, 'scenes'], sampleScenes);
  }, [projectId, isLoading, chapters]);

  return {
    chapters,
    isLoading,
    isError,
    error,
    getScenes,
    createChapter,
    updateChapter,
    deleteChapter,
    createScene,
    updateScene,
    deleteScene,
    addCharacterToScene,
    addSettingToScene,
    addObjectToScene,
    addPlotElementToScene
  };
};
