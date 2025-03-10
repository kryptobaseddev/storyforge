import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Setting, InsertSetting } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const useSettingService = (projectId: number) => {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Fetch settings
  const { 
    data: settings = [], 
    isLoading, 
    isError 
  } = useQuery<Setting[]>({
    queryKey: ['/api/projects', projectId, 'settings'],
    enabled: projectId > 0,
  });

  // Create setting mutation
  const createMutation = useMutation({
    mutationFn: async (setting: InsertSetting) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/settings`, setting);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'settings'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error creating setting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update setting mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, setting }: { id: number; setting: Partial<Setting> }) => {
      const response = await apiRequest('PUT', `/api/projects/${projectId}/settings/${id}`, setting);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'settings'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error updating setting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete setting mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/projects/${projectId}/settings/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'settings'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error deleting setting",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const createSetting = async (setting: InsertSetting) => {
    return createMutation.mutateAsync(setting);
  };

  const updateSetting = async (id: number, setting: Partial<Setting>) => {
    return updateMutation.mutateAsync({ id, setting });
  };

  const deleteSetting = async (id: number) => {
    return deleteMutation.mutateAsync(id);
  };

  // Sample data for development until API is implemented
  useEffect(() => {
    if (projectId <= 0 || !isLoading || settings.length > 0) return;

    // Sample settings data for UI development
    const sampleSettings: Setting[] = [
      {
        id: 1,
        projectId,
        name: "Blackwood Tower",
        description: "The foreboding fortress of the dark sorcerer Thorne Blackwood",
        type: "Fortress",
        details: "A tall, obsidian tower that pierces the clouds, surrounded by a perpetual storm. The tower is constructed from black stone that seems to absorb light. Arcane symbols are etched into its exterior walls, glowing with a faint purple energy during the night. The interior is a maze of winding staircases, hidden chambers, and trap-laden corridors.",
        climate: "Perpetually stormy and cold, with occasional arcane thunderstorms that produce purple lightning.",
        culture: "Isolated and secretive. The tower serves as both a home and research facility for Thorne and his small cadre of apprentices and servants. A strict hierarchy exists, with knowledge and magical power determining one's status.",
        history: "Built three centuries ago by the sorcerer Malakai as a place to conduct dangerous magical experiments away from civilization. It was abandoned for decades after Malakai's mysterious disappearance, until Thorne discovered and claimed it twenty years ago.",
        iconInitial: "B",
        iconColor: "bg-gray-800",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        projectId,
        name: "The Whispering Woods",
        description: "Ancient forest where the veil between worlds is thin",
        type: "Forest",
        details: "A vast expanse of ancient trees with silvery bark and leaves that shimmer in an ethereal light. Mist perpetually weaves between the trunks, forming mysterious shapes and occasionally parting to reveal hidden clearings or strange monuments. At night, the forest seems to come alive with whispers and soft illumination from bioluminescent flora.",
        climate: "Temperate and misty, with frequent gentle rainfall. The canopy blocks most direct sunlight, creating a perpetual twilight beneath the trees.",
        culture: "Home to reclusive elven clans and nature spirits. Visitors are rarely welcomed, and those who enter without permission often find themselves walking in circles or experiencing disorienting visions.",
        history: "Said to be the first forest that grew in the world, the Whispering Woods contain trees older than any written history. Ancient elven texts speak of the forest as a living entity, with a consciousness that spans millennia.",
        iconInitial: "W",
        iconColor: "bg-green-700",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        projectId,
        name: "City of Mistral",
        description: "A bustling coastal trading hub known for its shipwrights",
        type: "City",
        details: "Built on a series of interconnected islands connected by stone bridges and wooden walkways. The architecture is a blend of elegant spires and practical maritime structures. The constant sea breeze carries the scent of salt, spices, and freshly caught fish through the winding streets.",
        climate: "Mild maritime climate with frequent fog banks rolling in from the sea. Winters are wet but rarely freezing, while summers are warm and breezy.",
        culture: "A melting pot of cultures and races, Mistral welcomes all who bring trade and respect its laws. The city is governed by a council of merchant lords, with positions often changing hands based on economic influence.",
        history: "Founded five centuries ago by seafaring traders seeking a sheltered harbor, Mistral grew from a simple port to one of the wealthiest cities in the realm. Its strategic location made it a natural crossroads for traders from all corners of the world.",
        iconInitial: "M",
        iconColor: "bg-blue-600",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Mock the queryClient data
    queryClient.setQueryData(['/api/projects', projectId, 'settings'], sampleSettings);
  }, [projectId, isLoading, settings]);

  return {
    settings,
    isLoading,
    isError,
    error,
    createSetting,
    updateSetting,
    deleteSetting,
  };
};
