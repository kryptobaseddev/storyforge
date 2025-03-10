import React, { useState, useEffect } from "react";
import { useProject } from "@/context/ProjectContext";
import { useUI } from "@/context/UIContext";
import CharacterList from "@/components/features/characters/CharacterList";
import CharacterDetail from "@/components/features/characters/CharacterDetail";
import { Character } from "@shared/schema";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import CharacterForm from "@/components/features/characters/CharacterForm";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { User, UserPlus } from "lucide-react";

const CharacterWorkshop: React.FC = () => {
  const { currentProject } = useProject();
  const { setCurrentTool } = useUI();
  const { toast } = useToast();
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Sample character data - would come from API but using a static for example
  const thorneCharacter: Character = {
    id: 1,
    projectId: currentProject?.id || 1,
    name: "Thorne Blackwood",
    role: "Antagonist",
    archetype: "Dark Sorcerer",
    appearance: "Tall and imposing with sharp features and piercing ice-blue eyes. Long black hair with streaks of silver. Always dressed in dark flowing robes adorned with arcane symbols. A deep scar runs from his left temple to his jaw. His hands are adorned with magical rings and his skin is unnaturally pale.",
    personality: "Calculating, ambitious, and ruthless. Thorne is driven by a thirst for power and believes that the end justifies the means. Despite his cruelty, he possesses a brilliant mind and can be charismatic when needed. He harbors deep-seated insecurities about his humble origins, which fuels his obsession with attaining power and respect.",
    background: "Born to poor farmers, Thorne discovered his magical abilities at a young age. He was shunned by his village and eventually taken in by a reclusive mage who trained him. After his mentor's death, Thorne began researching forbidden magic and gradually became corrupted by the promise of power.",
    speech: "Speaks in a measured, deliberate tone with an educated vocabulary. Often uses archaic terms and formal language. Has a habit of pausing dramatically before making important statements. When agitated, his voice becomes low and threatening rather than loud. Occasionally slips into a regional accent when extremely emotional, revealing his humble origins.",
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
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Use the sample character as a fallback when no project is available
  useEffect(() => {
    if (!selectedCharacter && currentProject?.id) {
      setSelectedCharacter(thorneCharacter);
    }
  }, [currentProject, selectedCharacter]);

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
    toast({
      title: "Character Created",
      description: "Your new character has been added to the story."
    });
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    toast({
      title: "Character Updated",
      description: "Character details have been updated successfully."
    });
  };

  const isLoading = !currentProject;

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Set current tool on component mount
  useEffect(() => {
    setCurrentTool('character');
  }, [setCurrentTool]);

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="mb-4 p-4 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-spectral font-bold text-white flex items-center">
            <User className="mr-3 h-6 w-6 text-blue-400" />
            Character Workshop
          </h2>
          <p className="text-gray-400 text-sm">Create and develop compelling characters for your story</p>
        </div>
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          Create Character
        </Button>
      </div>
      
      <div className="flex-1 overflow-auto flex flex-col md:flex-row">
        <CharacterList
          projectId={currentProject.id}
          onSelectCharacter={handleSelectCharacter}
          selectedCharacterId={selectedCharacter?.id}
          onCreateCharacter={() => setIsCreateDialogOpen(true)}
        />

        {selectedCharacter ? (
          <CharacterDetail character={selectedCharacter} />
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-800">
            <div className="text-center">
              <h2 className="text-xl font-spectral font-semibold text-white mb-2">
                No Character Selected
              </h2>
              <p className="text-gray-400 mb-4">
                Select a character from the list or create a new one.
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Create Character
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Create Character Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-3xl">
          <h2 className="text-xl font-spectral font-semibold mb-4">Create New Character</h2>
          <CharacterForm 
            projectId={currentProject.id}
            onSuccess={handleCreateSuccess}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Character Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-gray-800 text-white border-gray-700 max-w-3xl">
          <h2 className="text-xl font-spectral font-semibold mb-4">Edit Character</h2>
          {selectedCharacter && (
            <CharacterForm 
              projectId={currentProject.id}
              character={selectedCharacter}
              onSuccess={handleEditSuccess}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CharacterWorkshop;
