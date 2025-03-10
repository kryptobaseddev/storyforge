import React, { useState } from "react";
import { useCharacterService } from "@/hooks/useCharacterService";
import { Character } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, Search, MoreVertical } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { HoverGlow } from "@/components/ui/hover-glow";

type CharacterListProps = {
  projectId: number;
  onSelectCharacter: (character: Character) => void;
  selectedCharacterId?: number;
  onCreateCharacter?: () => void;
};

const CharacterList: React.FC<CharacterListProps> = ({
  projectId,
  onSelectCharacter,
  selectedCharacterId,
  onCreateCharacter,
}) => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const { characters, isLoading, error } = useCharacterService(projectId);

  // Filter characters based on search query
  const filteredCharacters = characters.filter(
    (character) =>
      character.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (character.role && character.role.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (character.archetype && character.archetype.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateCharacter = () => {
    // Using the parent component's create functionality
    if (typeof onCreateCharacter === 'function') {
      onCreateCharacter();
    } else {
      toast({
        title: "Coming Soon",
        description: "Character creation will be available soon!",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-400">Loading characters...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-red-400">
        <p>Error loading characters</p>
        <p className="text-sm">{error.message}</p>
      </div>
    );
  }

  const getAvatarColor = (character: Character) => {
    const roleColorMap: Record<string, string> = {
      'Protagonist': 'bg-blue-600',
      'Antagonist': 'bg-red-600',
      'Ally': 'bg-green-600',
      'Mentor': 'bg-purple-600',
      'Supporting': 'bg-amber-600'
    };
    
    return character.avatarColor || roleColorMap[character.role as any] || 'bg-blue-600';
  };

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-700 overflow-hidden flex flex-col bg-gray-800">
      <div className="border-b border-gray-700 p-4">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <HoverGlow color="primary">
              <Button 
                onClick={handleCreateCharacter}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>New Character</span>
              </Button>
            </HoverGlow>
            <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white">
              <Filter className="h-4 w-4 mr-2" />
              <span>Filter</span>
            </Button>
          </div>
          <div className="relative w-full sm:w-64 mt-2 sm:mt-0">
            <Input
              type="text"
              placeholder="Search characters..."
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="overflow-y-auto flex-grow">
        {filteredCharacters.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p>No characters found</p>
            <p className="text-sm mt-1">Try adjusting your search or create a new character</p>
          </div>
        ) : (
          filteredCharacters.map((character) => (
            <div
              key={character.id}
              className={`group py-3 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center ${
                selectedCharacterId === character.id ? "bg-gray-700" : ""
              }`}
              onClick={() => onSelectCharacter(character)}
            >
              <div className={`w-10 h-10 rounded-full ${getAvatarColor(character)} flex items-center justify-center mr-3`}>
                <span className="font-spectral text-white">
                  {character.avatarInitial || character.name?.charAt(0) || "C"}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-spectral font-medium text-white">{character.name}</h3>
                <p className="text-xs text-gray-400">
                  {character.archetype || "Character"} • {character.role || "Unknown"}
                </p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CharacterList;
