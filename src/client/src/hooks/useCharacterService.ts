import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Character, InsertCharacter } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export const useCharacterService = (projectId: number) => {
  const { toast } = useToast();
  const [error, setError] = useState<Error | null>(null);

  // Fetch characters
  const { 
    data: characters = [], 
    isLoading, 
    isError 
  } = useQuery<Character[]>({
    queryKey: ['/api/projects', projectId, 'characters'],
    enabled: projectId > 0,
  });

  // Create character mutation
  const createMutation = useMutation({
    mutationFn: async (character: InsertCharacter) => {
      const response = await apiRequest('POST', `/api/projects/${projectId}/characters`, character);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error creating character",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Update character mutation
  const updateMutation = useMutation({
    mutationFn: async ({ id, character }: { id: number; character: Partial<Character> }) => {
      const response = await apiRequest('PUT', `/api/projects/${projectId}/characters/${id}`, character);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error updating character",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete character mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('DELETE', `/api/projects/${projectId}/characters/${id}`, undefined);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
    },
    onError: (error: Error) => {
      setError(error);
      toast({
        title: "Error deleting character",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper functions
  const createCharacter = async (character: InsertCharacter) => {
    return createMutation.mutateAsync(character);
  };

  const updateCharacter = async (id: number, character: Partial<Character>) => {
    return updateMutation.mutateAsync({ id, character });
  };

  const deleteCharacter = async (id: number) => {
    return deleteMutation.mutateAsync(id);
  };

  // Sample data for development until API is implemented
  useEffect(() => {
    if (projectId <= 0 || !isLoading || characters.length > 0) return;

    // Add sample character data for UI development
    // This will be removed once the API is implemented
    const sampleCharacters: Character[] = [
      {
        id: 1,
        projectId,
        name: "Arwen Silverleaf",
        role: "Protagonist",
        archetype: "Elven Ranger",
        appearance: "Tall and agile with silver hair and piercing green eyes.",
        personality: "Determined, wise, protective of nature.",
        speech: "Formal and eloquent, with occasional elven phrases.",
        age: "142",
        gender: "Female",
        race: "Elf",
        occupation: "Ranger",
        avatarInitial: "A",
        avatarColor: "bg-blue-600",
        strengths: ["Exceptional archery", "Nature magic", "Tracking", "Diplomacy"],
        weaknesses: ["Distrusts humans", "Prideful", "Haunted by past", "Overprotective"],
        motivations: [
          { text: "Protect the ancient forests", type: "Primary Goal" },
          { text: "Avenge her father's death", type: "Personal" },
          { text: "Unite the divided elven clans", type: "Long-term" }
        ],
        background: "Born to the noble Silverleaf clan, Arwen trained as a guardian of the ancient forests. When her father was killed by Thorne's forces, she vowed to stop the dark sorcerer's plans.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        projectId,
        name: "Thorne Blackwood",
        role: "Antagonist",
        archetype: "Dark Sorcerer",
        appearance: "Tall and imposing with sharp features and piercing ice-blue eyes. Long black hair with streaks of silver.",
        personality: "Calculating, ambitious, and ruthless. Driven by thirst for power.",
        speech: "Speaks in a measured, deliberate tone with an educated vocabulary.",
        age: "42",
        gender: "Male",
        race: "Human",
        occupation: "Sorcerer",
        avatarInitial: "T",
        avatarColor: "bg-red-600",
        strengths: ["Powerful magic", "Strategic mind", "Charismatic", "Vast knowledge"],
        weaknesses: ["Arrogance", "Fear of rejection", "Obsessive", "Cannot forgive"],
        motivations: [
          { text: "Acquire the Crystal of Eternity", type: "Primary Goal" },
          { text: "Exact revenge on the Silverleaf clan", type: "Personal" },
          { text: "Achieve immortality through forbidden magic", type: "Long-term" }
        ],
        background: "Born to poor farmers, Thorne discovered his magical abilities at a young age. After being shunned and later trained by a reclusive mage, he began researching forbidden magic.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        projectId,
        name: "Kiran Emberforge",
        role: "Ally",
        archetype: "Dwarven Smith",
        appearance: "Stout and powerful with a thick red beard adorned with gold rings. Burns scars on forearms.",
        personality: "Stubborn, loyal, and boisterous with a hearty laugh.",
        speech: "Direct and blunt, often using metal and forge metaphors.",
        age: "89",
        gender: "Male",
        race: "Dwarf",
        occupation: "Master Smith",
        avatarInitial: "K",
        avatarColor: "bg-green-600",
        strengths: ["Master craftsman", "Physical strength", "Fire resistance", "Unwavering loyalty"],
        weaknesses: ["Stubborn", "Distrusts magic", "Bad temper", "Holds grudges"],
        motivations: [
          { text: "Craft legendary weapons and armor", type: "Craft" },
          { text: "Repay a life debt to Arwen", type: "Honor" },
          { text: "Reclaim ancestral forges from mountain trolls", type: "Legacy" }
        ],
        background: "A renowned dwarven smith whose life was saved by Arwen during a troll attack. Now bound by honor to aid her quest.",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        projectId,
        name: "Luna Moonshadow",
        role: "Mentor",
        archetype: "Mystic",
        appearance: "Ethereal with flowing white hair and eyes that shift colors with her mood.",
        personality: "Enigmatic, wise, and occasionally cryptic.",
        speech: "Speaks in riddles and metaphors, often prophetic.",
        age: "Unknown",
        gender: "Female",
        race: "Unknown",
        occupation: "Mystic",
        avatarInitial: "L",
        avatarColor: "bg-purple-600",
        strengths: ["Prophecy", "Ancient knowledge", "Magical insight", "Healing arts"],
        weaknesses: ["Physically frail", "Bound by cosmic rules", "Cannot interfere directly", "Fading power"],
        motivations: [
          { text: "Guide Arwen to fulfill her destiny", type: "Primary" },
          { text: "Maintain cosmic balance", type: "Duty" },
          { text: "Find a worthy successor", type: "Legacy" }
        ],
        background: "A mysterious being who appears to Arwen in times of need, providing guidance and wisdom.",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Mock the queryClient data
    queryClient.setQueryData(['/api/projects', projectId, 'characters'], sampleCharacters);
  }, [projectId, isLoading, characters]);

  return {
    characters,
    isLoading,
    isError,
    error,
    createCharacter,
    updateCharacter,
    deleteCharacter,
  };
};
