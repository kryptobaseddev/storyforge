import React, { useState } from "react";
import { useProject } from "@/context/ProjectContext";
import { useObjectService } from "@/hooks/useObjectService";
import { Object as StoryObject } from "@shared/schema";
import { HoverGlow } from "@/components/ui/hover-glow";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Gem, Plus, Filter, Search, MoreVertical, Edit, Share, Edit2, User, MapPin } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const ArtifactVault: React.FC = () => {
  const { currentProject } = useProject();
  const { toast } = useToast();
  const { objects, isLoading } = useObjectService(currentProject?.id || 0);
  const [selectedObject, setSelectedObject] = useState<StoryObject | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("details");

  // Sample object data for demonstration
  const sampleObject: StoryObject = {
    id: 1,
    projectId: currentProject?.id || 1,
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
  };

  // Use the sample object if no object is selected
  React.useEffect(() => {
    if (!selectedObject && objects.length === 0) {
      setSelectedObject(sampleObject);
    } else if (!selectedObject && objects.length > 0) {
      setSelectedObject(objects[0]);
    }
  }, [objects, selectedObject]);

  // Filter objects based on search query
  const filteredObjects = objects.filter(
    (object) =>
      object.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (object.type && object.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleCreateObject = () => {
    toast({
      title: "Coming Soon",
      description: "Artifact creation will be available soon!",
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
                onClick={handleCreateObject}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                <span>New Artifact</span>
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
              placeholder="Search artifacts..."
              className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto flex flex-col md:flex-row">
        {/* Objects List (Left Panel) */}
        <div className="w-full md:w-1/3 lg:w-1/4 border-r border-gray-700 overflow-y-auto bg-gray-800">
          {filteredObjects.length === 0 && searchQuery === "" ? (
            <div className="group py-3 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center bg-gray-700" onClick={() => setSelectedObject(sampleObject)}>
              <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center mr-3">
                <span className="font-spectral text-white">S</span>
              </div>
              <div className="flex-1">
                <h3 className="font-spectral font-medium text-white">Staff of Dark Whispers</h3>
                <p className="text-xs text-gray-400">Weapon • Magical</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-600">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : filteredObjects.length === 0 ? (
            <div className="p-4 text-center text-gray-400">
              <p>No artifacts found</p>
              <p className="text-sm mt-1">Try adjusting your search or create a new artifact</p>
            </div>
          ) : (
            filteredObjects.map((object) => (
              <div
                key={object.id}
                className={`group py-3 px-4 border-b border-gray-700 hover:bg-gray-700 cursor-pointer flex items-center ${
                  selectedObject?.id === object.id ? "bg-gray-700" : ""
                }`}
                onClick={() => setSelectedObject(object)}
              >
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center mr-3">
                  <span className="font-spectral text-white">
                    {object.iconInitial || object.name?.charAt(0) || "A"}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-spectral font-medium text-white">{object.name}</h3>
                  <p className="text-xs text-gray-400">
                    {object.type || "Item"} {object.description ? `• ${object.description.substring(0, 15)}...` : ""}
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

        {/* Object Details (Right Panel) */}
        {selectedObject ? (
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Object Header */}
              <div className="flex flex-col md:flex-row md:items-start mb-8">
                <div className="flex flex-col items-center mb-6 md:mb-0 md:mr-8">
                  <div className="w-32 h-32 rounded-lg bg-gray-700 border-4 border-amber-600 mb-4 overflow-hidden flex items-center justify-center">
                    <Gem className="h-16 w-16 text-amber-400 opacity-60" />
                  </div>
                  <button className="text-xs text-gray-400 hover:text-white">Change Image</button>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-spectral font-bold text-white">{selectedObject.name}</h2>
                      <div className="flex items-center mt-1">
                        <span className="text-sm px-3 py-1 rounded-full bg-amber-900 text-amber-200 mr-2">
                          {selectedObject.type || "Item"}
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
                    {selectedObject.description}
                  </p>
                  
                  {/* Object Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center">
                      <User className="h-5 w-5 text-blue-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">Owner</p>
                        <p className="font-medium">Thorne Blackwood</p>
                      </div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-3 border border-gray-700 flex items-center">
                      <MapPin className="h-5 w-5 text-green-400 mr-3" />
                      <div>
                        <p className="text-xs text-gray-400">Location</p>
                        <p className="font-medium">Blackwood Tower</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Tabbed Navigation */}
              <Tabs defaultValue="details" value={activeTab} onValueChange={setActiveTab} className="mb-6">
                <TabsList className="border-b border-gray-700 mb-6 w-full bg-transparent">
                  <TabsTrigger 
                    value="details" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'details' ? 'border-amber-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="properties" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'properties' ? 'border-amber-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Properties
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'history' ? 'border-amber-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    History
                  </TabsTrigger>
                  <TabsTrigger 
                    value="connections" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'connections' ? 'border-amber-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Connections
                  </TabsTrigger>
                  <TabsTrigger 
                    value="notes" 
                    className={`py-3 px-4 border-b-2 ${activeTab === 'notes' ? 'border-amber-600 text-white' : 'border-transparent text-gray-400 hover:text-white hover:border-gray-500'}`}
                  >
                    Notes
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="details" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                      <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"></path><path d="M7 21h10"></path><path d="M12 3v18"></path><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"></path></svg>
                        Description
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        A staff of obsidian wood, approximately six feet in length, topped with a swirling orb of dark energy. The staff is covered in intricate runes that pulse with a faint purple glow when magic is channeled through it. The orb at the top appears to be made of a crystalline substance that contains swirling shadows within. The lower portion of the staff is wrapped in leather binding for a better grip, stained dark from years of use.
                      </p>
                      <button 
                        onClick={() => handleEditField('description')}
                        className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                      >
                        <Edit2 className="h-3 w-3 mr-1" /> Edit
                      </button>
                    </div>
                    
                    <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                      <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="m4.93 4.93 4.24 4.24"></path><path d="m14.83 9.17 4.24-4.24"></path><path d="m14.83 14.83 4.24 4.24"></path><path d="m9.17 14.83-4.24 4.24"></path><circle cx="12" cy="12" r="4"></circle></svg>
                        Significance
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        The Staff of Dark Whispers is Thorne Blackwood's primary weapon and the source of much of his power. It serves as both a symbol of his authority and a tool for his most devastating spells. The protagonist's quest will eventually lead to confronting Thorne and potentially destroying or claiming the staff, as it is one of the few artifacts capable of opening the sealed portal to the Shadow Realm.
                      </p>
                      <button 
                        onClick={() => handleEditField('significance')}
                        className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                      >
                        <Edit2 className="h-3 w-3 mr-1" /> Edit
                      </button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="properties" className="mt-0">
                  <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                    <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                      Magical Properties
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedObject.properties || 
                        "This obsidian staff is topped with a swirling orb of dark energy that constantly whispers secrets to its wielder. The whispers provide arcane knowledge but slowly corrupt the mind of the user. The staff can channel destructive spells with twice the normal power, but each use drains a portion of the wielder's life force. The orb can also trap souls, which power the staff's abilities."}
                    </p>
                    <button 
                      onClick={() => handleEditField('properties')}
                      className="mt-3 text-xs text-primary hover:text-primary-light flex items-center"
                    >
                      <Edit2 className="h-3 w-3 mr-1" /> Edit
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                      <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
                        Powers
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-gray-700 rounded p-3">
                          <p className="text-sm font-medium text-white">Shadow Bolt</p>
                          <p className="text-xs text-gray-400">Launches a devastating beam of shadow energy</p>
                        </div>
                        <div className="bg-gray-700 rounded p-3">
                          <p className="text-sm font-medium text-white">Mind Corruption</p>
                          <p className="text-xs text-gray-400">Allows the wielder to influence thoughts and memories</p>
                        </div>
                        <div className="bg-gray-700 rounded p-3">
                          <p className="text-sm font-medium text-white">Soul Capture</p>
                          <p className="text-xs text-gray-400">Can extract and contain the souls of the defeated</p>
                        </div>
                      </div>
                      <button className="mt-3 text-xs text-primary hover:text-primary-light flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                        Add Power
                      </button>
                    </div>
                    
                    <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                      <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-9"></path><path d="M18 9V5a2 2 0 0 0-2-2h-5l-5 5V9"></path><circle cx="13" cy="13" r="3"></circle></svg>
                        Limitations
                      </h3>
                      <div className="space-y-3">
                        <div className="bg-gray-700 rounded p-3">
                          <p className="text-sm font-medium text-white">Life Force Drain</p>
                          <p className="text-xs text-gray-400">Each use costs the wielder some of their vitality</p>
                        </div>
                        <div className="bg-gray-700 rounded p-3">
                          <p className="text-sm font-medium text-white">Mental Corruption</p>
                          <p className="text-xs text-gray-400">Prolonged use leads to paranoia and madness</p>
                        </div>
                        <div className="bg-gray-700 rounded p-3">
                          <p className="text-sm font-medium text-white">Light Vulnerability</p>
                          <p className="text-xs text-gray-400">Powers are weakened in areas of intense light or holy magic</p>
                        </div>
                      </div>
                      <button className="mt-3 text-xs text-primary hover:text-primary-light flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14"></path><path d="M5 12h14"></path></svg>
                        Add Limitation
                      </button>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="history" className="mt-0">
                  <div className="mb-6 bg-gray-800 rounded-lg p-5 border border-gray-700">
                    <h3 className="text-lg font-spectral font-semibold text-white mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"></path><path d="m19 9-5 5-4-4-3 3"></path></svg>
                      History & Origins
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      {selectedObject.history || 
                        "Created by the long-dead sorcerer Malakai from the heartwood of a tree struck by thirteen lightning bolts during a blood moon. It was lost for centuries until Thorne discovered it buried in ancient ruins. The staff chose him as its new master, sensing his ambition and darkness."}
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
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><circle cx="12" cy="12" r="4"></circle><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"></line><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"></line><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"></line><line x1="14.83" y1="9.17" x2="18.36" y2="5.64"></line><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"></line></svg>
                      Timeline
                    </h3>
                    <div className="relative pl-8 border-l-2 border-gray-700 space-y-8">
                      <div className="relative">
                        <div className="absolute -left-10 top-0 w-6 h-6 rounded-full bg-amber-900 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        </div>
                        <div>
                          <p className="text-xs text-amber-400">632 BE (Before Empire)</p>
                          <h4 className="text-sm font-medium text-white mt-1">Creation</h4>
                          <p className="text-xs text-gray-300 mt-1">
                            Forged by Malakai during the Arcane Conjunction
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-10 top-0 w-6 h-6 rounded-full bg-amber-900 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        </div>
                        <div>
                          <p className="text-xs text-amber-400">612 BE</p>
                          <h4 className="text-sm font-medium text-white mt-1">The Cataclysm</h4>
                          <p className="text-xs text-gray-300 mt-1">
                            Used by Malakai to tear open a rift to the Shadow Realm
                          </p>
                        </div>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute -left-10 top-0 w-6 h-6 rounded-full bg-amber-900 flex items-center justify-center">
                          <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                        </div>
                        <div>
                          <p className="text-xs text-amber-400">23 AE (After Empire)</p>
                          <h4 className="text-sm font-medium text-white mt-1">Rediscovery</h4>
                          <p className="text-xs text-gray-300 mt-1">
                            Found by Thorne Blackwood in the ruins of Ashfall Temple
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="connections" className="mt-0">
                  <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                    <h3 className="text-xl font-spectral font-semibold text-white mb-4">Story Connections</h3>
                    <p className="text-gray-400 mb-6">How this artifact connects to other elements of your story.</p>
                    
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-gray-700 to-red-900/30 rounded p-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">The Portal Ritual</p>
                          <p className="text-xs text-gray-400">Plot Element • Final Act</p>
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
                      
                      <div className="bg-gradient-to-r from-gray-700 to-green-900/30 rounded p-3 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center mr-3 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m8 3 4 8 5-5 5 15H2L8 3z"></path></svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">Blackwood Tower</p>
                          <p className="text-xs text-gray-400">Setting • Current Location</p>
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
                      placeholder="Add your notes about this artifact here..." 
                      className="w-full bg-gray-700 border-gray-600 text-white h-48 mb-4 resize-none"
                    />
                    <Button className="bg-amber-600 hover:bg-amber-700 text-white">
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
                No Artifact Selected
              </h2>
              <p className="text-gray-400 mb-4">
                Select an artifact from the list or create a new one.
              </p>
              <Button 
                onClick={handleCreateObject}
                className="bg-amber-600 hover:bg-amber-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Artifact
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArtifactVault;
