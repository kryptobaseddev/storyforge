import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Object as StoryObject, InsertObject } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const useObjectService = (projectId: number) => {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Fetch objects
  const { 
    data: objects = [], 
    isLoading, 
    isError 
  } = useQuery<StoryObject[]>({
    queryKey: ['/api/projects', projectId, 'objects'],
    enabled: projectId > 0,
  });

  // Create object mutation
  const createMutation = useMutation({
    mutationFn: async (object: InsertObject) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/objects`, object);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'objects'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error creating object",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update object mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, object }: { id: number; object: Partial<StoryObject> }) => {
      const response = await apiRequest('PUT', `/api/projects/${projectId}/objects/${id}`, object);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'objects'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error updating object",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete object mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/projects/${projectId}/objects/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'objects'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error deleting object",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const createObject = async (object: InsertObject) => {
    return createMutation.mutateAsync(object);
  };

  const updateObject = async (id: number, object: Partial<StoryObject>) => {
    return updateMutation.mutateAsync({ id, object });
  };

  const deleteObject = async (id: number) => {
    return deleteMutation.mutateAsync(id);
  };

  // Sample data for development until API is implemented
  useEffect(() => {
    if (projectId <= 0 || !isLoading || objects.length > 0) return;

    // Sample objects data for UI development
    const sampleObjects: StoryObject[] = [
      {
        id: 1,
        projectId,
        name: "Staff of Dark Whispers",
        description: "An ancient staff of immense power, used by Thorne Blackwood to channel forbidden magic",
        type: "Weapon",
        properties: "This obsidian staff is topped with a swirling orb of dark energy that constantly whispers secrets to its wielder. The whispers provide arcane knowledge but slowly corrupt the mind of the user. The staff can channel destructive spells with twice the normal power, but each use drains a portion of the wielder's life force. The orb can also trap souls, which power the staff's abilities.",
        history: "Created by the long-dead sorcerer Malakai from the heartwood of a tree struck by thirteen lightning bolts during a blood moon. It was lost for centuries until Thorne discovered it buried in ancient ruins. The staff chose him as its new master, sensing his ambition and darkness.",
        ownerId: 1, // Thorne Blackwood
        locationId: 1, // Blackwood Tower
        iconInitial: "S",
        iconColor: "bg-amber-600",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        projectId,
        name: "Crystal of Eternity",
        description: "A mysterious crystalline artifact that contains immense arcane power",
        type: "Magical Artifact",
        properties: "A multifaceted crystal the size of a fist that emits a pulsing glow that changes color based on the wielder's intentions. It can amplify magical abilities, open portals between realms, and allegedly grant immortality through a complex ritual. The crystal responds to emotions and seems to have a form of consciousness, sometimes directing its wielder through subtle impulses.",
        history: "Its origins are unknown, though legend suggests it is a fragment of a shattered star that fell to earth millennia ago. Throughout history, it has appeared in the hands of various powerful figures before disappearing again, often coinciding with their mysterious deaths or disappearances.",
        ownerId: null, // Currently being sought by multiple characters
        locationId: null, // Location unknown at start of story
        iconInitial: "C",
        iconColor: "bg-blue-400",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        projectId,
        name: "Moonsilver Bow",
        description: "An elegant elven bow that never misses its target under moonlight",
        type: "Weapon",
        properties: "Crafted from a single piece of enchanted silverwood and strung with strands of moonlight. Arrows fired from this bow are guided by magic, ensuring they find their target when fired under the moon's glow. The bow is weightless to its true owner but impossibly heavy to anyone else. It can also create arrows of pure light in times of dire need.",
        history: "A traditional weapon passed down through generations of the Silverleaf clan's leaders. It was gifted to Arwen by her father before his death, symbolizing her position as the clan's protector and future leader.",
        ownerId: 1, // Arwen Silverleaf
        locationId: null, // Carried by Arwen
        iconInitial: "M",
        iconColor: "bg-indigo-300",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Mock the queryClient data
    queryClient.setQueryData(['/api/projects', projectId, 'objects'], sampleObjects);
  }, [projectId, isLoading, objects]);

  return {
    objects,
    isLoading,
    isError,
    error,
    createObject,
    updateObject,
    deleteObject,
  };
};
