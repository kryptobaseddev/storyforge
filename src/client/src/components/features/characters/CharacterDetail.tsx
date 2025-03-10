import React, { useState } from "react";
import { Character } from "@shared/schema";
import { Edit, Share, Edit2, Plus, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { useCharacterService } from "@/hooks/useCharacterService";
import { CharacterWithConnections, StoryConnection } from "@/types";
import { HoverGlow } from "@/components/ui/hover-glow";

type CharacterDetailProps = {
  character: Character;
};

// Sample connections for demo purposes - will be replaced by API data
const mockConnections: StoryConnection[] = [
  {
    id: 1,
    type: 'plot',
    name: 'The Dark Tower Confrontation',
    subtext: 'Plot Element • Chapter 24',
    color: 'red',
    icon: 'map'
  },
  {
    id: 2,
    type: 'setting',
    name: 'Blackwood Tower',
    subtext: 'Setting • Primary Location',
    color: 'green',
    icon: 'mountain'
  },
  {
    id: 3,
    type: 'object',
    name: 'Staff of Dark Whispers',
    subtext: 'Artifact • Weapon',
    color: 'amber',
    icon: 'gem'
  }
];

const CharacterDetail: React.FC<CharacterDetailProps> = ({ character }) => {
  const { toast } = useToast();
  const { updateCharacter } = useCharacterService(character.projectId);
  const [activeTab, setActiveTab] = useState("profile");
  
  // For demo purposes, add the connections to the character
  const characterWithConnections: CharacterWithConnections = {
    ...character,
    connections: mockConnections
  };

  const handleEditField = (field: string) => {
    toast({
      title: "Coming Soon",
      description: `Editing ${field} will be available soon!`,
    });
  };

  const strengthsList = Array.isArray(character.strengths) 
    ? character.strengths 
    : ["Powerful magic", "Strategic mind", "Charismatic", "Vast knowledge"];

  const weaknessesList = Array.isArray(character.weaknesses)
    ? character.weaknesses
    : ["Arrogance", "Fear of rejection", "Obsessive", "Cannot forgive"];

  const motivations = Array.isArray(character.motivations)
    ? character.motivations
    : [
        { text: "Acquire the Crystal of Eternity", type: "Primary Goal" },
        { text: "Exact revenge on the Silverleaf clan", type: "Personal" },
        { text: "Achieve immortality through forbidden magic", type: "Long-term" }
      ];

  // Role-specific styling
  const getRoleBadgeClass = (role?: string) => {
    const roleClassMap: Record<string, string> = {
      'Protagonist': 'bg-blue-900 text-blue-200',
      'Antagonist': 'bg-red-900 text-red-200',
      'Ally': 'bg-green-900 text-green-200',
      'Mentor': 'bg-purple-900 text-purple-200',
      'Supporting': 'bg-amber-900 text-amber-200'
    };
    
    return roleClassMap[role || ''] || 'bg-gray-700 text-gray-300';
  };

  const getConnectionGradient = (type: string) => {
    const gradientMap: Record<string, string> = {
      'plot': 'from-gray-700 to-red-900/30',
      'setting': 'from-gray-700 to-green-900/30',
      'object': 'from-gray-700 to-amber-900/30',
      'chapter': 'from-gray-700 to-purple-900/30'
    };
    
    return gradientMap[type] || 'from-gray-700 to-blue-900/30';
  };

  const getConnectionIconBg = (type: string) => {
    const bgMap: Record<string, string> = {
      'plot': 'bg-red-600',
      'setting': 'bg-green-600',
      'object': 'bg-amber-600',
      'chapter': 'bg-purple-600'
    };
    
    return bgMap[type] || 'bg-blue-600';
  };

  const getConnectionIcon = (type: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'map': <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>,
      'mountain': <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"/></svg>,
      'gem': <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 18 3 22 9 12 22 2 9"/></svg>
    };
    
    return iconMap[type] || 
      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/></svg>;
  };

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-start mb-8">
          {/* Character Avatar */}
          <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
            <div className={`w-32 h-32 rounded-full bg-gray-700 border-4 ${
              character.role === 'Antagonist' ? 'border-red-600' : 
              character.role === 'Protagonist' ? 'border-blue-600' : 
              character.role === 'Ally' ? 'border-green-600' : 
              character.role === 'Mentor' ? 'border-purple-600' : 'border-gray-600'
            } mb-4 overflow-hidden flex items-center justify-center`}>
              <span className="text-4xl font-spectral">
                {character.avatarInitial || character.name?.charAt(0) || "C"}
              </span>
            </div>
            <button className="text-xs text-gray-400 hover:text-white">Change Image</button>
          </div>
          
          {/* Character Basic Info */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-spectral font-bold text-white">{character.name}</h2>
                <div className="flex items-center mt-1">
                  {character.role && (
                    <span className={`text-sm px-3 py-1 rounded-full ${getRoleBadgeClass(character.role)} mr-2`}>
                      {character.role}
                    </span>
                  )}
                  {character.archetype && (
                    <span className="text-sm px-3 py-1 rounded-full bg-gray-700 text-gray-300">
                      {character.archetype}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white flex items-center">
                  <Edit className="h-4 w-4 mr-2" />
                  <span>Edit</span>
                </Button>
                <Button variant="secondary" className="bg-gray-700 hover:bg-gray-600 text-white">
                  <Share className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {/* Character Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400">Age</p>
                <p className="font-medium">{character.age || "Unknown"}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400">Gender</p>
                <p className="font-medium">{character.gender || "Unknown"}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400">Race</p>
                <p className="font-medium">{character.race || "Unknown"}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                <p className="text-xs text-gray-400">Occupation</p>
                <p className="font-medium">{character.occupation || "Unknown"}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabbed Navigation */}
        <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="border-b border-gray-700 mb-6 w-full bg-transparent">
            <TabsTrigger 
              value="profile" 
              className={`py-3 px-4 border-b-2 ${activeTab === 'profile' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
            >
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="relationships" 
              className={`py-3 px-4 border-b-2 ${activeTab === 'relationships' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
            >
              Relationships
            </TabsTrigger>
            <TabsTrigger 
              value="possessions" 
              className={`py-3 px-4 border-b-2 ${activeTab === 'possessions' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
            >
              Possessions
            </TabsTrigger>
            <TabsTrigger 
              value="history" 
              className={`py-3 px-4 border-b-2 ${activeTab === 'history' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
            >
              History
            </TabsTrigger>
            <TabsTrigger 
              value="notes" 
              className={`py-3 px-4 border-b-2 ${activeTab === 'notes' ? 'border-red-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
            >
              Notes
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div>
                <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                  <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                    Appearance
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {character.appearance || 
                      "Tall and imposing with sharp features and piercing ice-blue eyes. Long black hair with streaks of silver. Always dressed in dark flowing robes adorned with arcane symbols. A deep scar runs from his left temple to his jaw. His hands are adorned with magical rings and his skin is unnaturally pale."}
                  </p>
                  <button 
                    onClick={() => handleEditField('appearance')}
                    className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </button>
                </div>
                
                <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                  <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v.01"/><path d="M12 8v4"/></svg>
                    Personality
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {character.personality || 
                      "Calculating, ambitious, and ruthless. Thorne is driven by a thirst for power and believes that the end justifies the means. Despite his cruelty, he possesses a brilliant mind and can be charismatic when needed. He harbors deep-seated insecurities about his humble origins, which fuels his obsession with attaining power and respect."}
                  </p>
                  <button 
                    onClick={() => handleEditField('personality')}
                    className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </button>
                </div>
                
                <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                  <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                    Motivations & Goals
                  </h3>
                  <div className="space-y-3">
                    {motivations.map((motivation, idx) => (
                      <div key={idx} className="bg-gray-700 rounded p-3">
                        <p className="text-sm font-medium text-white">{motivation.text}</p>
                        <p className="text-xs text-gray-400">{motivation.type}</p>
                      </div>
                    ))}
                  </div>
                  <button 
                    onClick={() => handleEditField('motivations')}
                    className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add Motivation
                  </button>
                </div>
              </div>
              
              {/* Right Column */}
              <div>
                <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                  <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    Strengths & Weaknesses
                  </h3>
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-white mb-2">Strengths</h4>
                    <div className="flex flex-wrap gap-2">
                      {strengthsList.map((strength, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-green-900 text-green-200 text-xs">
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2">Weaknesses</h4>
                    <div className="flex flex-wrap gap-2">
                      {weaknessesList.map((weakness, idx) => (
                        <span key={idx} className="px-2 py-1 rounded bg-red-900 text-red-200 text-xs">
                          {weakness}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => handleEditField('strengths_weaknesses')}
                    className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </button>
                </div>
                
                <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                  <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    Speech & Mannerisms
                  </h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {character.speech || 
                      "Speaks in a measured, deliberate tone with an educated vocabulary. Often uses archaic terms and formal language. Has a habit of pausing dramatically before making important statements. When agitated, his voice becomes low and threatening rather than loud. Occasionally slips into a regional accent when extremely emotional, revealing his humble origins."}
                  </p>
                  <button 
                    onClick={() => handleEditField('speech')}
                    className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                  >
                    <Edit2 className="h-3 w-3 mr-1" /> Edit
                  </button>
                </div>
                
                <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                  <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>
                    Story Connections
                  </h3>
                  <div className="space-y-3">
                    {characterWithConnections.connections?.map((connection, idx) => (
                      <div 
                        key={idx} 
                        className={`bg-gradient-to-r ${getConnectionGradient(connection.type)} rounded p-3 flex items-center`}
                      >
                        <div className={`w-8 h-8 rounded-full ${getConnectionIconBg(connection.type)} flex items-center justify-center mr-3 flex-shrink-0`}>
                          {getConnectionIcon(connection.icon)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{connection.name}</p>
                          <p className="text-xs text-gray-400">{connection.subtext}</p>
                        </div>
                        <button className="ml-auto text-gray-400 hover:text-white">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="relationships" className="mt-0">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-spectral font-semibold text-white mb-4">Character Relationships</h3>
              <p className="text-gray-400">This feature is coming soon. You'll be able to define and manage relationships between characters.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="possessions" className="mt-0">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-spectral font-semibold text-white mb-4">Character Possessions</h3>
              <p className="text-gray-400">This feature is coming soon. You'll be able to manage items and artifacts owned by this character.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-spectral font-semibold text-white mb-4">Character History</h3>
              <p className="text-gray-400">This feature is coming soon. You'll be able to document this character's background and history.</p>
            </div>
          </TabsContent>
          
          <TabsContent value="notes" className="mt-0">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-spectral font-semibold text-white mb-4">Character Notes</h3>
              <p className="text-gray-400">This feature is coming soon. You'll be able to add miscellaneous notes about this character.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CharacterDetail;
