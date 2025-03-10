import React, { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { useSettingService } from "@/hooks/useSettingService";
import { Setting } from "@shared/schema";
import { HoverGlow } from "@/components/ui/hover-glow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mountain, Plus, Filter, Search, MoreVertical, Edit, Share, Edit2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const RealmCrafter: React.FC = () => {
  const { currentProject } = useProject();
  const { toast } = useToast();
  const { settings, isLoading } = useSettingService(currentProject?.id || 0);
  const [selectedSetting, setSelectedSetting] = useState<Setting | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  // Sample setting data for demonstration
  const sampleSetting: Setting = {
    id: 1,
    projectId: currentProject?.id || 1,
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
  };

  // Use the sample setting if no setting is selected
  React.useEffect(() => {
    if (!selectedSetting && settings.length === 0) {
      setSelectedSetting(sampleSetting);
    } else if (!selectedSetting && settings.length > 0) {
      setSelectedSetting(settings[0]);
    }
  }, [settings, selectedSetting]);

  // Filter settings based on search query
  const filteredSettings = settings.filter(
    (setting) =>
      setting.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (setting.type && setting.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateSetting = () => {
    toast({
      title: "Coming Soon",
      description: "Setting creation will be available soon!",
    });
  };

  const handleEditField = (field: string) => {
    toast({
      title: "Coming Soon",
      description: `Editing ${field} will be available soon!`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-hidden flex flex-col">
      <div className="border-b border-gray-700 p-4 bg-gray-800">
        <div className="flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-2 mb-2 md:mb-0">
            <HoverGlow color="primary">
              <Button 
                onClick={handleCreateSetting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>New Setting</span>
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
              placeholder="Search settings..."
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col md:flex-row">
        {/* Settings List (Left Panel) */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-700 overflow-y-auto bg-gray-800">
          {filteredSettings.length === 0 && searchQuery === "" ? (
            <div className="group py-3 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center bg-gray-700" onClick={() => setSelectedSetting(sampleSetting)}>
              <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                <span className="font-spectral text-white">B</span>
              </div>
              <div className="flex-1">
                <h3 className="font-spectral font-medium text-white">Blackwood Tower</h3>
                <p className="text-xs text-gray-400">Fortress • Dark Magic</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : filteredSettings.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <p>No settings found</p>
              <p className="text-sm mt-1">Try adjusting your search or create a new setting</p>
            </div>
          ) : (
            filteredSettings.map((setting) => (
              <div
                key={setting.id}
                className={`group py-3 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center ${
                  selectedSetting?.id === setting.id ? "bg-gray-700" : ""
                }`}
                onClick={() => setSelectedSetting(setting)}
              >
                <div className="w-10 h-10 rounded-full bg-green-600 flex items-center justify-center mr-3">
                  <span className="font-spectral text-white">
                    {setting.iconInitial || setting.name?.charAt(0) || "S"}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-spectral font-medium text-white">{setting.name}</h3>
                  <p className="text-xs text-gray-400">
                    {setting.type || "Setting"} {setting.description ? `• ${setting.description.substring(0, 20)}...` : ""}
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

        {/* Setting Details (Right Panel) */}
        {selectedSetting ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Setting Header */}
              <div className="flex flex-col md:flex-row md:items-start mb-8">
                <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
                  <div className="w-32 h-32 rounded-lg bg-gray-700 border-4 border-green-600 mb-4 overflow-hidden flex items-center justify-center">
                    <Mountain className="h-16 w-16 text-green-400 opacity-60" />
                  </div>
                  <button className="text-xs text-gray-400 hover:text-white">Change Image</button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-spectral font-bold text-white">{selectedSetting.name}</h2>
                      <div className="flex items-center mt-1">
                        <span className="text-sm px-3 py-1 rounded-full bg-green-900 text-green-200 mr-2">
                          {selectedSetting.type || "Location"}
                        </span>
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
                  
                  <p className="text-gray-300 mb-6">
                    {selectedSetting.description}
                  </p>
                  
                  {/* Setting Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <p className="text-xs text-gray-400">Type</p>
                      <p className="font-medium">{selectedSetting.type || "Unknown"}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <p className="text-xs text-gray-400">Climate</p>
                      <p className="font-medium">{selectedSetting.climate ? selectedSetting.climate.substring(0, 20) + "..." : "Unknown"}</p>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                      <p className="text-xs text-gray-400">Relevance</p>
                      <p className="font-medium">Major Location</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tabbed Navigation */}
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="border-b border-gray-700 mb-6 w-full bg-transparent">
                  <TabsTrigger 
                    value="details" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'details' ? 'border-green-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="maps" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'maps' ? 'border-green-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Maps
                  </TabsTrigger>
                  <TabsTrigger 
                    value="inhabitants" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'inhabitants' ? 'border-green-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Inhabitants
                  </TabsTrigger>
                  <TabsTrigger 
                    value="connections" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'connections' ? 'border-green-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Connections
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notes" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'notes' ? 'border-green-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Notes
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Column */}
                    <div>
                      <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                        <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m2 22 3-3"></path><path d="M10 12v7a1 1 0 0 0 1 1h1"></path><path d="m4 16 7-7"></path><path d="M7 9.8V5h4.8"></path><path d="m14 12 8-8"></path><path d="M20 12V4h-8"></path></svg>
                          Physical Description
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {selectedSetting.details || 
                            "A tall, obsidian tower that pierces the clouds, surrounded by a perpetual storm. The tower is constructed from black stone that seems to absorb light. Arcane symbols are etched into its exterior walls, glowing with a faint purple energy during the night. The interior is a maze of winding staircases, hidden chambers, and trap-laden corridors."}
                        </p>
                        <button 
                          onClick={() => handleEditField('details')}
                          className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                        >
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </button>
                      </div>
                      
                      <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                        <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c.3 0 5.3 1.8 7 3s3 4.5 3 7-1.3 5.8-3 7-6.7 3-7 3-5.3-1.8-7-3-3-4.5-3-7 1.3-5.8 3-7 6.7-3 7-3Z"></path><path d="M17 12a5 5 0 1 0-10 0 5 5 0 0 0 10 0Z"></path></svg>
                          Climate & Environment
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {selectedSetting.climate || 
                            "Perpetually stormy and cold, with occasional arcane thunderstorms that produce purple lightning. The land surrounding the tower is barren and devoid of vegetation for miles, as if the very life has been drained from it."}
                        </p>
                        <button 
                          onClick={() => handleEditField('climate')}
                          className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                        >
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </button>
                      </div>
                    </div>
                    
                    {/* Right Column */}
                    <div>
                      <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                        <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" x2="22" y1="12" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
                          Culture & Society
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {selectedSetting.culture || 
                            "Isolated and secretive. The tower serves as both a home and research facility for Thorne and his small cadre of apprentices and servants. A strict hierarchy exists, with knowledge and magical power determining one's status."}
                        </p>
                        <button 
                          onClick={() => handleEditField('culture')}
                          className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                        >
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </button>
                      </div>
                      
                      <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                        <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
                          History & Significance
                        </h3>
                        <p className="text-sm text-gray-300 leading-relaxed">
                          {selectedSetting.history || 
                            "Built three centuries ago by the sorcerer Malakai as a place to conduct dangerous magical experiments away from civilization. It was abandoned for decades after Malakai's mysterious disappearance, until Thorne discovered and claimed it twenty years ago."}
                        </p>
                        <button 
                          onClick={() => handleEditField('history')}
                          className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                        >
                          <Edit2 className="h-3 w-3 mr-1" /> Edit
                        </button>
                      </div>
                      
                      <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                        <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3 8 4-16 3 8h4"></path></svg>
                          Notable Features
                        </h3>
                        <div className="space-y-3">
                          <div className="bg-gray-700 rounded p-3">
                            <p className="text-sm font-medium text-white">The Arcane Observatory</p>
                            <p className="text-xs text-gray-400">Top floor chamber with a retractable roof for celestial magic</p>
                          </div>
                          <div className="bg-gray-700 rounded p-3">
                            <p className="text-sm font-medium text-white">The Binding Chambers</p>
                            <p className="text-xs text-gray-400">Underground cells where magical creatures are contained</p>
                          </div>
                          <div className="bg-gray-700 rounded p-3">
                            <p className="text-sm font-medium text-white">The Whispering Library</p>
                            <p className="text-xs text-gray-400">Collection of sentient grimoires that murmur their contents</p>
                          </div>
                        </div>
                        <button className="mt-3 text-xs text-primary hover:text-primary-light flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                          Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="maps" className="mt-0">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-spectral font-semibold text-white mb-4">Maps & Layouts</h3>
                    <p className="text-gray-400">This feature is coming soon. You'll be able to create and manage maps for this setting.</p>
                    
                    <div className="mt-6 bg-gray-700 rounded-lg p-8 border border-dashed border-gray-600 flex items-center justify-center">
                      <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-500 mb-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                        <h4 className="text-lg font-spectral font-medium text-white mb-2">Create Your First Map</h4>
                        <p className="text-sm text-gray-400 mb-4">Upload or draw detailed maps of your locations</p>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          <Plus className="h-4 w-4 mr-2" />
                          Add Map
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="inhabitants" className="mt-0">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-spectral font-semibold text-white mb-4">Inhabitants</h3>
                    <p className="text-gray-400">This feature is coming soon. You'll be able to manage characters that inhabit this location.</p>
                    
                    <div className="mt-6">
                      <h4 className="text-lg font-spectral font-medium text-white mb-3">Known Residents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 flex items-center">
                          <div className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center mr-4">
                            <span className="font-spectral text-white">T</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">Thorne Blackwood</p>
                            <p className="text-xs text-gray-400">Master of the Tower</p>
                          </div>
                        </div>
                        <div className="bg-gray-700 rounded-lg p-4 border border-gray-600 flex items-center">
                          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center mr-4">
                            <span className="font-spectral text-white">M</span>
                          </div>
                          <div>
                            <p className="font-medium text-white">Moria Shadowveil</p>
                            <p className="text-xs text-gray-400">Apprentice</p>
                          </div>
                        </div>
                      </div>
                      <Button className="mt-4 bg-gray-700 hover:bg-gray-600 text-white">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Inhabitant
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="connections" className="mt-0">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-spectral font-semibold text-white mb-4">Story Connections</h3>
                    <p className="text-gray-400 mb-6">How this setting connects to other elements of your story.</p>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-gray-700 to-red-900/30 rounded p-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">The Dark Tower Confrontation</p>
                          <p className="text-xs text-gray-400">Plot Element • Climax</p>
                        </div>
                        <button className="ml-auto text-gray-400 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-r from-gray-700 to-blue-900/30 rounded p-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Thorne Blackwood</p>
                          <p className="text-xs text-gray-400">Character • Antagonist</p>
                        </div>
                        <button className="ml-auto text-gray-400 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </div>
                      
                      <div className="bg-gradient-to-r from-gray-700 to-amber-900/30 rounded p-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="6 3 18 3 22 9 12 22 2 9"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Staff of Dark Whispers</p>
                          <p className="text-xs text-gray-400">Artifact • Weapon</p>
                        </div>
                        <button className="ml-auto text-gray-400 hover:text-white">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                        </button>
                      </div>
                    </div>
                    
                    <Button className="mt-4 bg-gray-700 hover:bg-gray-600 text-white">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Connection
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="notes" className="mt-0">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-spectral font-semibold text-white mb-4">Notes & Ideas</h3>
                    <Textarea 
                      placeholder="Add your notes about this setting here..." 
                      className="w-full bg-gray-700 border-gray-600 text-white h-48 mb-4 resize-none"
                    />
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Save Notes
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6 bg-gray-800">
            <div className="text-center">
              <h2 className="text-xl font-spectral font-semibold text-white mb-2">
                No Setting Selected
              </h2>
              <p className="text-gray-400 mb-4">
                Select a setting from the list or create a new one.
              </p>
              <Button 
                onClick={handleCreateSetting}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Setting
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RealmCrafter;
